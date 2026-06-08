import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { User } from "next-auth";
import { ResumeData } from "@/types/resume";
import { resume } from "@/db/schema/resume";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as User)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userResume = await db.query.resume.findFirst({
      where: eq(resume.userId, userId),
    });

    return NextResponse.json({ resume: userResume?.data || null });
  } catch (error) {
    console.error("Error fetching resume from DB:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as User)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { resumeData } = await req.json();
    const userResumeData = resumeData as ResumeData | null;
    if (!userResumeData) {
      return NextResponse.json(
        { error: "Missing resumeData in body" },
        { status: 400 },
      );
    }

    const existing = await db.query.resume.findFirst({
      where: eq(resume.userId, userId),
    });

    if (existing) {
      await db
        .update(resume)
        .set({ data: userResumeData, updatedAt: new Date() })
        .where(eq(resume.id, existing.id));
    } else {
      await db.insert(resume).values({
        userId: userId,
        title: "Active Resume",
        data: userResumeData,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving resume to DB:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
