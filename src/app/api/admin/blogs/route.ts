import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/db";
import { blog, admin, users, BlogInsert } from "@/db/schema";
import { eq } from "drizzle-orm";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as User)?.id;
  if (!userId) return { _admin: null };

  const [admins] = await db
    .select()
    .from(admin)
    .innerJoin(users, eq(admin.userId, users.id))
    .where(eq(admin.userId, userId))
    .limit(1);

  return { _admin: { ...admins.user, ...admins.admin } };
}

export async function POST(request: NextRequest) {
  try {
    const { _admin } = await verifyAdmin();
    if (!_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: BlogInsert = await request.json();

    const [newPost] = await db
      .insert(blog)
      .values({
        ...body,
        authorId: _admin.userId,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        post: {
          ...newPost,
          author: {
            name: _admin.name,
            email: _admin.email,
            image: _admin.image,
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { _admin } = await verifyAdmin();
    if (!_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Missing blog slug parameter" },
        { status: 400 },
      );
    }

    const body: Partial<BlogInsert> = await request.json();

    const [updatedPost] = await db
      .update(blog)
      .set(body)
      .where(eq(blog.slug, slug))
      .returning();

    if (!updatedPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { _admin } = await verifyAdmin();
    if (!_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Missing blog slug parameter" },
        { status: 400 },
      );
    }

    const [deletedPost] = await db
      .delete(blog)
      .where(eq(blog.slug, slug))
      .returning();

    if (!deletedPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, post: deletedPost });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
