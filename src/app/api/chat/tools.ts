import type { RunnableToolFunctionWithParse } from "openai/lib/RunnableFunction.mjs";
import type { RunnableToolFunctionWithoutParse } from "openai/lib/RunnableFunction.mjs";
import { googleImageTool } from "./tools/googleImage";
import { weatherTool } from "./tools/weather";

/**
 * Collection of tools available to the AI agent.
 * Each tool is a function that the AI can use to perform specific tasks.
 *
 * Current tools:
 * - weatherTool: Gets weather information
 * - googleImageTool: DISABLED due to Google API 403 errors (requires billing)
 *
 * To enable Google Image Search:
 * 1. Enable Custom Search API in Google Cloud Console
 * 2. Enable billing on your Google Cloud project
 * 3. Uncomment googleImageTool below
 */

export const tools: (
  | RunnableToolFunctionWithoutParse
  | RunnableToolFunctionWithParse<{ altText: string[] }>
  | RunnableToolFunctionWithParse<{ location: string }>
)[] = [
  weatherTool,
  // googleImageTool, // Disabled: Google API returns 403 (billing required)
];
