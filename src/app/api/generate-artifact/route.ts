import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ArtifactRequest {
  prompt: string;
  type: "slides" | "report";
  artifactId?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { prompt, type, artifactId } = (await req.json()) as ArtifactRequest;

    console.log("[Artifact API] Generating artifact:", { type, prompt: prompt.substring(0, 100) });

    const client = new OpenAI({
      baseURL: "https://api.thesys.dev/v1/artifact",
      apiKey: process.env.THESYS_API_KEY,
    });

    const artifact = await client.chat.completions.create({
      model: "c1/artifact/v-20251030",
      messages: [
        {
          role: "system",
          content: `You are generating a ${type} artifact. Follow best practices for ${type === "slides" ? "presentation design" : "report writing"}. Include proper structure, visual elements, and cite all sources used.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      metadata: {
        thesys: JSON.stringify({
          c1_artifact_type: type,
          id: artifactId || `artifact-${Date.now()}`,
        }),
      },
    });

    const content = artifact.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated from artifact API");
    }

    console.log("[Artifact API] Successfully generated artifact");

    return NextResponse.json({
      content,
      type,
      id: artifactId || `artifact-${Date.now()}`,
    });
  } catch (error) {
    console.error("[Artifact API] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: `Artifact generation failed: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}

