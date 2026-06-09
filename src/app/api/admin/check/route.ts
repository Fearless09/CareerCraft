import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/db";
import { admin } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as User)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admins = await db.query.admin.findFirst({
      where: eq(admin.userId, userId),
    });

    return NextResponse.json({ isAdmin: !!admins });
  } catch (error) {
    console.error("Error in admin check API:", error);
    return NextResponse.json(
      { error: "Internal Server Error", isAdmin: false },
      { status: 500 },
    );
  }
}
