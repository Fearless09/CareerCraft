import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/db";
import { guide, admin, GuideInsert } from "@/db/schema";
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

    const body: GuideInsert = await request.json();
    const [newSection] = await db.insert(guide).values(body).returning();

    return NextResponse.json(
      { success: true, section: newSection },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating guide section:", error);
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
        { error: "Missing guide section ID parameter" },
        { status: 400 },
      );
    }

    const body: Partial<GuideInsert> = await request.json();
    const [updatedSection] = await db
      .update(guide)
      .set(body)
      .where(eq(guide.id, id))
      .returning();

    if (!updatedSection) {
      return NextResponse.json(
        { error: "Guide section not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, section: updatedSection });
  } catch (error) {
    console.error("Error updating guide section:", error);
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
        { error: "Missing guide section ID parameter" },
        { status: 400 },
      );
    }

    const [deletedSection] = await db
      .delete(guide)
      .where(eq(guide.id, id))
      .returning();

    if (!deletedSection) {
      return NextResponse.json(
        { error: "Guide section not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, section: deletedSection });
  } catch (error) {
    console.error("Error deleting guide section:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
