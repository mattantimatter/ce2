import type { RunnableToolFunctionWithParse } from "openai/lib/RunnableFunction.mjs";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { JSONSchema } from "openai/lib/jsonschema.mjs";
import { createToolErrorMessage } from "./utils/toolErrorHandler";
import OpenAI from "openai";

/**
 * Artifact Generation Tool
 * 
 * Calls the Thesys Artifact API to generate slides or reports.
 * The artifact API uses a dedicated endpoint and model optimized for creating
 * structured content with proper formatting and visual elements.
 */
export const artifactTool: RunnableToolFunctionWithParse<{
  prompt: string;
  type: "slides" | "report";
}> = {
  type: "function",
  function: {
    name: "generate_artifact",
    description:
      "Generate a professional slide presentation or comprehensive report using the Thesys Artifact API. " +
      "\n\n" +
      "Use this tool when the user asks to create, generate, or build slides, presentations, reports, or documents. " +
      "\n\n" +
      "For SLIDES: Creates a multi-slide presentation with title slide, content slides, visual elements, and sources. " +
      "Best for: presentations, overviews, educational content, pitches. " +
      "\n\n" +
      "For REPORTS: Creates a comprehensive document with executive summary, detailed sections, data visualizations, and references. " +
      "Best for: analysis, research summaries, business reports, detailed documentation. " +
      "\n\n" +
      "The prompt should describe what content to include. The tool will automatically structure and format the artifact appropriately.",
    parse: JSON.parse,
    parameters: zodToJsonSchema(
      z.object({
        prompt: z
          .string()
          .describe(
            "The detailed prompt describing what content to include in the artifact. Be specific about topics, key points, and any data to include."
          ),
        type: z
          .enum(["slides", "report"])
          .describe(
            "The type of artifact to generate. Use 'slides' for presentations and 'report' for documents."
          ),
      })
    ) as JSONSchema,
    function: async ({ prompt, type }: { prompt: string; type: "slides" | "report" }) => {
      try {
        console.log(`[Artifact Tool] Generating ${type} with prompt:`, prompt.substring(0, 100));

        const client = new OpenAI({
          baseURL: "https://api.thesys.dev/v1/artifact",
          apiKey: process.env.THESYS_API_KEY,
        });

        const artifact = await client.chat.completions.create({
          model: "c1/artifact/v-20251030",
          messages: [
            {
              role: "system",
              content: `You are generating a ${type} artifact. Follow best practices for ${type === "slides" ? "presentation design with clear slides and visuals" : "comprehensive report writing with sections and analysis"}. Always cite sources used.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          metadata: {
            thesys: JSON.stringify({
              c1_artifact_type: type,
              id: `artifact-${type}-${Date.now()}`,
            }),
          },
        });

        const content = artifact.choices[0]?.message?.content;

        if (!content) {
          throw new Error("No content generated from artifact API");
        }

        console.log(`[Artifact Tool] Successfully generated ${type}, content length:`, content.length);

        return {
          success: true,
          type,
          artifact: content,
          message: `${type === "slides" ? "Slide presentation" : "Report"} generated successfully! The artifact should now be displayed above.`,
        };
      } catch (error) {
        console.error("[Artifact Tool] Error:", error);
        return createToolErrorMessage(error, {
          action: `generating ${type}`,
          userFriendlyContext: `for prompt: "${prompt.substring(0, 50)}..."`,
          suggestion: "Please try simplifying your request or try again later.",
        });
      }
    },
    strict: true,
  },
};
