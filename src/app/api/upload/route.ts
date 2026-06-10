import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
          ],
          tokenPayload: JSON.stringify({
            // Extra payload can be appended here
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Run any optional code after successful upload (e.g. log metadata)
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Vercel Blob client upload token generation failed:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Image upload failed" },
      { status: 400 },
    );
  }
}
