import { connection, NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { Guide, guide } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  await connection();

  try {
    const type = request.nextUrl.searchParams.get("type") as
      | Guide["type"]
      | null;

    if (!!type) {
      const sections = await db.query.guide.findMany({
        where: eq(guide.type, type),
        orderBy: asc(guide.sortOrder),
      });
      return NextResponse.json({ sections });
    }

    const sections = await db.query.guide.findMany({
      // where: eq(guide.type, type),
      orderBy: asc(guide.sortOrder),
    });

    return NextResponse.json({ sections });
  } catch (error) {
    console.error("Error fetching guides:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
