import type { RunnableToolFunctionWithParse } from "openai/lib/RunnableFunction.mjs";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { JSONSchema } from "openai/lib/jsonschema.mjs";
import { createToolErrorMessage } from "./utils/toolErrorHandler";

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

        // Call our internal artifact API endpoint
        const response = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/generate-artifact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            type,
            artifactId: `artifact-${type}-${Date.now()}`,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || `Artifact API returned ${response.status}`);
        }

        const result = await response.json();
        console.log(`[Artifact Tool] Successfully generated ${type}`);

        return {
          success: true,
          type,
          content: result.content,
          id: result.id,
          message: `${type === "slides" ? "Slide presentation" : "Report"} generated successfully! The artifact is now displayed.`,
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

