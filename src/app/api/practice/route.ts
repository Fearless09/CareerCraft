import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  try {
    const questions = await db.query.practiceQuestion.findMany();

    return NextResponse.json({ practiceQuestions: questions });
  } catch (error) {
    console.error("Error fetching practice questions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
 