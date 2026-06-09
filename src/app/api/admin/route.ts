import { getServerSession, User } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/db";
import { admin, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const admins = await db
      .select()
      .from(admin)
      .innerJoin(users, eq(users.id, admin.userId));

    return NextResponse.json({
      admins: admins.map((item) => ({
        ...item.user,
        ...item.admin,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;

  const _admin = await db.query.admin.findFirst({
    where: eq(admin.userId, userId),
  });

  return _admin;
}

export async function POST(req: NextRequest) {
  try {
    const _admin = await verifyAdmin();
    if (!_admin) {
      return NextResponse.json(
        { error: "Unauthorized: You're not allow to perform admin operation" },
        { status: 401 },
      );
    }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }
    const adminToBe = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!adminToBe) {
      return NextResponse.json(
        {
          error: "The user you are trying to promote does not exist",
        },
        { status: 404 },
      );
    }

    await db.insert(admin).values({
      userId: adminToBe.id,
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as User)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admins = await db.query.admin.findFirst({
      where: eq(admin.userId, userId),
    });
    if (!admins) {
      return NextResponse.json(
        { error: "Unauthorized: You're not allow to perform admin operation" },
        { status: 401 },
      );
    }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const adminToRemove = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!adminToRemove) {
      return NextResponse.json(
        {
          error: "The user you are trying to demote does not exist",
        },
        { status: 404 },
      );
    }

    await db.delete(admin).where(eq(admin.userId, adminToRemove.id));
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
