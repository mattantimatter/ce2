import type { RunnableToolFunctionWithParse } from "openai/lib/RunnableFunction.mjs";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import GoogleImages from "google-images";
import type { JSONSchema } from "openai/lib/jsonschema.mjs";
import { createToolErrorMessage } from "./utils/toolErrorHandler";

// Lazy initialization to avoid instantiating during build time
let client: GoogleImages | null = null;
const getClient = () => {
  const googleCX = process.env.GOOGLE_CX;
  const googleAPIKey = process.env.GOOGLE_API_KEY;
  
  console.log("[Google Image Client] Environment check:", {
    hasCX: !!googleCX,
    hasAPIKey: !!googleAPIKey,
    cxLength: googleCX?.length,
    apiKeyLength: googleAPIKey?.length
  });
  
  // Check for API keys
  if (!googleCX || !googleAPIKey) {
    const errorMsg = `Google API credentials missing! CX: ${!!googleCX}, API Key: ${!!googleAPIKey}. Set in Vercel environment variables.`;
    console.error("[Google Image Client]", errorMsg);
    throw new Error(errorMsg);
  }
  
  if (!client) {
    console.log("[Google Image Client] Initializing with CX:", googleCX);
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
        console.log("[Google Image Search] API Keys present:", {
          hasGoogleCX: !!process.env.GOOGLE_CX,
          hasGoogleAPIKey: !!process.env.GOOGLE_API_KEY,
          googleCX: process.env.GOOGLE_CX ? `${process.env.GOOGLE_CX.substring(0, 5)}...` : 'missing',
        });
        
        const imageClient = getClient();
        
        // Return helpful message if API keys are missing
        if (!imageClient) {
          console.error("[Google Image Search] Client initialization failed");
          return {
            error: "Image search unavailable. Please configure GOOGLE_CX and GOOGLE_API_KEY in your Vercel environment variables.",
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
            } catch (searchError) {
              console.error(`[Google Image Search] Error for "${text}":`, searchError);
              const errorMessage = searchError instanceof Error ? searchError.message : String(searchError);
              return {
                altText: text,
                imageUrl: null,
                thumbnailUrl: null,
                error: `Image search failed for "${text}": ${errorMessage}. Please check GOOGLE_CX (${process.env.GOOGLE_CX ? 'set' : 'MISSING'}) and GOOGLE_API_KEY (${process.env.GOOGLE_API_KEY ? 'set' : 'MISSING'}) in Vercel environment variables.`,
              };
            }
          }),
        );
        return results;
      } catch (error) {
        return createToolErrorMessage(error, {
          action: "searching for images",
          userFriendlyContext: `with terms: ${altText.join(", ")}`,
          suggestion: "Please try different search terms or try again later.",
        });
      }
    },
    strict: true,
  },
};
