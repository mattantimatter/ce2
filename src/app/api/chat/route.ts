import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { transformStream } from "@crayonai/stream";
import { DBMessage, getMessageStore } from "./messageStore";
import { tools } from "./tools";
import { SYSTEM_PROMPTS } from "./systemPrompts";
import { MCPClient } from "./mcp";
import { JSONSchema } from "openai/lib/jsonschema.mjs";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Initialize MCP client
const mcpClient = new MCPClient();

async function ensureMCPConnection(): Promise<void> {
  if (mcpClient.tools.length === 0) {
    await mcpClient.connect();
  }
}

export async function POST(req: NextRequest) {
  const { prompt, threadId, responseId } = (await req.json()) as {
    prompt: DBMessage;
    threadId: string;
    responseId: string;
  };
  const client = new OpenAI({
    baseURL: "https://api.thesys.dev/v1/embed/",
    apiKey: process.env.THESYS_API_KEY,
  });
  const messageStore = getMessageStore(threadId);

  messageStore.addMessage(prompt);

  // Ensure MCP connection is established
  await ensureMCPConnection();

  // Convert MCP tools to runnable format
  const mcpRunnableTools = mcpClient.tools.map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.function.name,
      description: tool.function.description || "",
      parameters: tool.function.parameters as unknown as JSONSchema,
      parse: JSON.parse,
      function: async (args: unknown) => {
        const results = await mcpClient.runTool({
          tool_call_id: tool.function.name + Date.now().toString(),
          name: tool.function.name,
          args: args as Record<string, unknown>,
        });
        return results.content;
      },
    },
  }));

  // Combine existing tools with MCP tools
  const allTools = [...tools, ...mcpRunnableTools];

  const llmStream = await client.beta.chat.completions.runTools({
    model: `c1/openai/gpt-5/v-20250930`,
    temperature: 1 as unknown as number,
    messages: [
      { role: "system", content: SYSTEM_PROMPTS },
      ...messageStore.getOpenAICompatibleMessageList(),
    ],
    stream: true,
    tool_choice: allTools.length > 0 ? "auto" : "none",
    tools: allTools,
  });

  const responseStream = transformStream(
    llmStream,
    (chunk) => {
      return chunk.choices?.[0]?.delta?.content ?? "";
    },
    {
      onEnd: ({ accumulated }) => {
        const message = accumulated.filter((message) => {
          return message;
        }).join("");
        messageStore.addMessage({
          role: "assistant",
          content: message,
          id: responseId,
        });
      },
    }
  ) as ReadableStream<string>;

  return new NextResponse(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. This endpoint only accepts POST requests." },
    { status: 405 }
  );
}
