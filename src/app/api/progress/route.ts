import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/db";
import { userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { User } from "next-auth";
import { UserProgress } from "@/types/resume";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as User).id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const progress = await db.query.userProgress.findFirst({
      where: eq(userProgress.userId, userId),
    });

    return NextResponse.json({ progress: progress?.data || null });
  } catch (error) {
    console.error("Error fetching progress from DB:", error);
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
    const { progressData } = await req.json();
    const userProgressData = progressData as UserProgress | null;
    if (!userProgressData) {
      return NextResponse.json(
        { error: "Missing progressData in body" },
        { status: 400 },
      );
    }

    const existing = await db.query.userProgress.findFirst({
      where: eq(userProgress.userId, userId),
    });

    if (existing) {
      await db
        .update(userProgress)
        .set({ data: userProgressData, updatedAt: new Date() })
        .where(eq(userProgress.userId, userId));
    } else {
      await db.insert(userProgress).values({
        userId: userId,
        data: userProgressData,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving progress to DB:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
