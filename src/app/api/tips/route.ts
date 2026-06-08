import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  try {
    const allTips = await db.query.tip.findMany();

    return NextResponse.json({ tips: allTips });
  } catch (error) {
    console.error("Error fetching tips:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
 