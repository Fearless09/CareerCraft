import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/db";
import { practiceQuestion, admin, PracticeQuestionInsert } from "@/db/schema";
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
 
export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: PracticeQuestionInsert = await request.json();

    const [newQuestion] = await db
      .insert(practiceQuestion)
      .values(body)
      .returning();

    return NextResponse.json(
      { success: true, question: newQuestion },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating practice question:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing practice question ID parameter" },
        { status: 400 },
      );
    }

    const body: Partial<PracticeQuestionInsert> = await request.json();

    const [updatedQuestion] = await db
      .update(practiceQuestion)
      .set(body)
      .where(eq(practiceQuestion.id, id))
      .returning();

    if (!updatedQuestion) {
      return NextResponse.json(
        { error: "Practice question not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, question: updatedQuestion });
  } catch (error) {
    console.error("Error updating practice question:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing practice question ID parameter" },
        { status: 400 },
      );
    }

    const [deletedQuestion] = await db
      .delete(practiceQuestion)
      .where(eq(practiceQuestion.id, id))
      .returning();

    if (!deletedQuestion) {
      return NextResponse.json(
        { error: "Practice question not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, question: deletedQuestion });
  } catch (error) {
    console.error("Error deleting practice question:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
