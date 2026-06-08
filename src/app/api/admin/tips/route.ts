import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/db";
import { tip, admin, TipInsert } from "@/db/schema";
import { eq } from "drizzle-orm";

// Helper to verify admin role inside API route
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
    const body: TipInsert = await request.json();

    const [newTip] = await db.insert(tip).values(body).returning();

    return NextResponse.json({ success: true, tip: newTip }, { status: 201 });
  } catch (error) {
    console.error("Error creating tip:", error);
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
        { error: "Missing tip ID parameter" },
        { status: 400 },
      );
    }

    const body: Partial<TipInsert> = await request.json();

    const [updatedTip] = await db
      .update(tip)
      .set(body)
      .where(eq(tip.id, id))
      .returning();

    if (!updatedTip) {
      return NextResponse.json({ error: "Tip not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, tip: updatedTip });
  } catch (error) {
    console.error("Error updating tip:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing tip ID parameter" },
        { status: 400 },
      );
    }

    const [deletedTip] = await db.delete(tip).where(eq(tip.id, id)).returning();

    if (!deletedTip) {
      return NextResponse.json({ error: "Tip not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, tip: deletedTip });
  } catch (error) {
    console.error("Error deleting tip:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
