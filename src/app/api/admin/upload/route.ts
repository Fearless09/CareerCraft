import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/db";
import { admin } from "@/db/schema";
import { eq } from "drizzle-orm";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as User)?.id;
  if (!userId) return false;

  const admins = await db.query.admin.findFirst({
    where: eq(admin.userId, userId),
  });
  return !!admins;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (clientPayload /*, additionalFields */) => {
        // Validate admin session
        if (!(await verifyAdmin())) {
          throw new Error("Unauthorized: Admin authorization required");
        }

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
