import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import OpenAI from "openai";

export class MCPClient {
  private mcp: Client;
  private transport: StdioClientTransport | null = null;
  public tools: OpenAI.ChatCompletionTool[] = [];

  constructor() {
    this.mcp = new Client({
      name: "atom-gen-mcp-client",
      version: "1.0.0"
    });
  }

  async connect() {
    // Connect to fetch MCP server to access Thesys documentation
    const command = "npx";
    const args = [
      "-y",
      "@modelcontextprotocol/server-fetch@latest",
    ];

    this.transport = new StdioClientTransport({
      command,
      args,
    });

    await this.mcp.connect(this.transport);

    // List available tools from the MCP server
    const toolsResult = await this.mcp.listTools();
    this.tools = toolsResult.tools.map((tool) => ({
      type: "function" as const,
      function: {
          name: tool.name,
          description: tool.description || "Fetch content from URLs including Thesys documentation",
          parameters: tool.inputSchema,
      },
    }));
  }

  async runTool({
    tool_call_id,
    name,
    args,
  }: {
    tool_call_id: string;
    name: string;
    args: Record<string, unknown>;
  }) {
    try {
      const result = await this.mcp.callTool({
        name,
        arguments: args,
      });

      return {
        tool_call_id,
        role: "tool" as const,
        content: JSON.stringify(result.content),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return {
        tool_call_id,
        role: "tool" as const,
        content: JSON.stringify({
          error: `Tool call failed: ${errorMessage}`,
        }),
      };
    }
  }

  async disconnect() {
    if (this.transport) {
      await this.transport.close();
    }
  }
}
