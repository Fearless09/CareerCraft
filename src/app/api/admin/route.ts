import { getServerSession, User } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/db";
import { admins, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const admin = await db
      .select()
      .from(admins)
      .innerJoin(users, eq(users.id, admins.userId));

    return NextResponse.json({
      admins: admin.map((item) => ({
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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as User)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = await db.query.admins.findFirst({
      where: eq(admins.userId, userId),
    });
    if (!admin) {
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

    await db.insert(admins).values({
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
    const admin = await db.query.admins.findFirst({
      where: eq(admins.userId, userId),
    });
    if (!admin) {
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

    await db.delete(admins).where(eq(admins.userId, adminToRemove.id));
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
