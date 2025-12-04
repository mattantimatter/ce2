import type { RunnableToolFunctionWithParse } from "openai/lib/RunnableFunction.mjs";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import GoogleImages from "google-images";
import type { JSONSchema } from "openai/lib/jsonschema.mjs";
import { createToolErrorMessage } from "./utils/toolErrorHandler";

/**
 * Google Image Search Setup Requirements:
 * 
 * 1. Create API Key in Google Cloud Console (NOT AI Studio):
 *    - Go to https://console.cloud.google.com/apis/credentials
 *    - Create/Select a project
 *    - Click "Create Credentials" > "API Key"
 *    - Copy the key to GOOGLE_API_KEY environment variable
 * 
 * 2. Enable Custom Search API:
 *    - Go to https://console.cloud.google.com/apis/library/customsearch.googleapis.com
 *    - Click "Enable"
 * 
 * 3. Create Programmable Search Engine:
 *    - Go to https://programmablesearchengine.google.com/
 *    - Click "Add" to create new search engine
 *    - In "Sites to search", select "Search the entire web"
 *    - Enable "Image search" in Settings
 *    - Copy the Search Engine ID to GOOGLE_CX environment variable
 */

// Lazy initialization to avoid instantiating during build time
let client: GoogleImages | null = null;

const getClient = () => {
  const googleCX = process.env.GOOGLE_CX;
  const googleAPIKey = process.env.GOOGLE_API_KEY;
  
  console.log("[Google Image Client] Environment check:", {
    hasCX: !!googleCX,
    hasAPIKey: !!googleAPIKey,
    cxPrefix: googleCX?.substring(0, 8) + "...",
    apiKeyPrefix: googleAPIKey?.substring(0, 10) + "..."
  });
  
  // Check for API keys
  if (!googleCX || !googleAPIKey) {
    const errorMsg = `Google API credentials missing! CX: ${!!googleCX}, API Key: ${!!googleAPIKey}. Set GOOGLE_CX and GOOGLE_API_KEY in Vercel environment variables.`;
    console.error("[Google Image Client]", errorMsg);
    throw new Error(errorMsg);
  }
  
  // Validate API key format (should start with AIza for Google Cloud keys)
  if (!googleAPIKey.startsWith("AIza")) {
    console.warn("[Google Image Client] WARNING: API key doesn't start with 'AIza'. Make sure you're using a Google Cloud Console API key (not AI Studio) with Custom Search API enabled.");
  }
  
  if (!client) {
    console.log("[Google Image Client] Initializing with CX:", googleCX.substring(0, 8) + "...");
    client = new GoogleImages(googleCX, googleAPIKey);
  }
  return client;
};

export const googleImageTool: RunnableToolFunctionWithParse<{
  altText: string[];
}> = {
  type: "function",
  function: {
    name: "imageSearch",
    description:
      "ONLY USE THIS TOOL IF YOU ARE LOOKING FOR IMAGES. DO NOT GENERATE IMAGE URLS ON YOUR OWN AND USE THIS TOOL." +
      "\n\n" +
      "Search for and retrieve image URLs based on an array of descriptive texts. " +
      "The function returns both a direct image URL (imageUrl) and a thumbnail URL (thumbnailUrl) for each description." +
      "\n\n" +
      "If you are using a LIST_COMPONENT, use the thumbnailUrl for displaying images in the list. In all other cases, use imageUrl by default." +
      "\n\n" +
      'Example: ["A photo of a cat", "A photo of a dog"]',
    parse: JSON.parse,
    parameters: zodToJsonSchema(
      z.object({
        altText: z
          .array(z.string())
          .describe("An array of alt texts for the images"),
      }),
    ) as JSONSchema,
    function: async ({ altText }: { altText: string[] }) => {
      try {
        console.log("[Google Image Search] Starting search for:", altText);
        console.log("[Google Image Search] Environment:", {
          hasGoogleCX: !!process.env.GOOGLE_CX,
          hasGoogleAPIKey: !!process.env.GOOGLE_API_KEY,
          cxPrefix: process.env.GOOGLE_CX ? `${process.env.GOOGLE_CX.substring(0, 8)}...` : 'MISSING',
          apiKeyPrefix: process.env.GOOGLE_API_KEY ? `${process.env.GOOGLE_API_KEY.substring(0, 10)}...` : 'MISSING',
        });
        
        let imageClient;
        try {
          imageClient = getClient();
        } catch (initError) {
          console.error("[Google Image Search] Client initialization failed:", initError);
          return {
            error: "Image search unavailable. Please configure GOOGLE_CX and GOOGLE_API_KEY in your Vercel environment variables.",
            details: initError instanceof Error ? initError.message : String(initError),
            altText: altText,
          };
        }
        
        const results = await Promise.all(
          altText.map(async (text) => {
            try {
              console.log(`[Google Image Search] Searching for: "${text}"`);
              const searchResults = await imageClient.search(text, {
                size: "medium",
              });
              console.log(`[Google Image Search] Results for "${text}":`, searchResults?.length || 0);

              if (!searchResults || searchResults.length === 0) {
                console.warn(`[Google Image Search] No results for: "${text}"`);
                return { altText: text, imageUrl: null, thumbnailUrl: null };
              }

              const item = searchResults[0];
              const imageUrl = item?.url;
              const thumbnailUrl = item?.thumbnail?.url || null;

              console.log(`[Google Image Search] Success for "${text}":`, { imageUrl, thumbnailUrl });
              return { altText: text, imageUrl, thumbnailUrl };
            } catch (searchError: unknown) {
              // Extract detailed error info from Google API response
              const errorObj = searchError as { message?: string; response?: { body?: { error?: { message?: string; code?: number; status?: string } } } };
              const googleError = errorObj?.response?.body?.error;
              const errorMessage = googleError?.message || errorObj?.message || String(searchError);
              const errorCode = googleError?.code;
              const errorStatus = googleError?.status;
              
              console.error(`[Google Image Search] Error for "${text}":`, {
                message: errorMessage,
                code: errorCode,
                status: errorStatus,
                fullError: searchError
              });
              
              // Provide specific guidance based on error type
              let suggestion = "Check your Google Cloud Console configuration.";
              if (errorMessage.includes("API key not valid") || errorCode === 400) {
                suggestion = "Your GOOGLE_API_KEY is invalid. Get a new key from Google Cloud Console (not AI Studio) and enable Custom Search API.";
              } else if (errorMessage.includes("Request had insufficient authentication") || errorCode === 401) {
                suggestion = "Authentication failed. Ensure your API key has Custom Search API enabled in Google Cloud Console.";
              } else if (errorMessage.includes("exceeded") || errorCode === 429) {
                suggestion = "API quota exceeded. Check your usage limits in Google Cloud Console.";
              } else if (errorCode === 403) {
                suggestion = "Access denied. Enable Custom Search API in Google Cloud Console and check API key restrictions.";
              }
              
              return {
                altText: text,
                imageUrl: null,
                thumbnailUrl: null,
                error: `Image search failed: ${errorMessage}`,
                code: errorCode,
                suggestion: suggestion,
              };
            }
          }),
        );
        return results;
      } catch (error) {
        console.error("[Google Image Search] Unexpected error:", error);
        return createToolErrorMessage(error, {
          action: "searching for images",
          userFriendlyContext: `with terms: ${altText.join(", ")}`,
          suggestion: "Check that Custom Search API is enabled in Google Cloud Console and your API key is valid.",
        });
      }
    },
    strict: true,
  },
};
