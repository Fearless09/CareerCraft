import { connection, NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blog, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

 
export async function GET(request: NextRequest) {
  await connection();
  
  try {
    const slug = request.nextUrl.searchParams.get("slug");

    if (slug) {
      const [post] = await db
        .select()
        .from(blog)
        .where(eq(blog.slug, slug))
        .innerJoin(users, eq(blog.authorId, users.id));

      if (!post) {
        return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        post: {
          ...post.blog,
          author: {
            name: post.user.name,
            image: post.user.image,
            email: post.user.email,
          },
        },
      });
    }

    const allPosts = await db
      .select()
      .from(blog)
      .innerJoin(users, eq(blog.authorId, users.id))
      .orderBy(desc(blog.createdAt));

    return NextResponse.json({
      posts: allPosts.map((post) => ({
        ...post.blog,
        author: {
          name: post.user.name,
          image: post.user.image,
          email: post.user.email,
        },
      })),
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
