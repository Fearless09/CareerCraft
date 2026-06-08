import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, MoveLeft, UserRound } from "lucide-react";
import BlogContent from "@/components/blog/BlogContent";
import { cn, getPostCatColor } from "@/lib/utils";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { blog, BlogPost, users } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const { slug } = await params;

  // fetch Blog
  const post = await fetchBlog(slug);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  const previousKeywords = (await parent).keywords || [];

  return {
    title: post.title + " | CareerCraft",
    description: post.excerpt,
    openGraph: {
      images: post.image ? [post.image, ...previousImages] : previousImages,
    },
    keywords: [post.category, ...previousKeywords],
  };
}

const fetchBlog = async (slug: string) => {
  "use cache";
  try {
    const [post] = await db
      .select()
      .from(blog)
      .where(eq(blog.slug, slug))
      .innerJoin(users, eq(blog.authorId, users.id));
    if (!post) notFound();

    return {
      ...post.blog,
      author: {
        name: post.user.name,
        image: post.user.image,
        email: post.user.email,
      },
    };
  } catch (error) {
    notFound();
  }
};

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post: BlogPost = await fetchBlog(slug);

  return (
    <section className="wrapper max-w-5xl flex-1 py-12 md:py-16">
      {/* Back Button */}
      <Link
        href="/blog"
        className="hover:text-primary transition-300 mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500"
      >
        <MoveLeft className="size-4" />
        Back to blog
      </Link>

      {/* Article Header */}
      <header className="mb-10 border-b border-zinc-200 pb-8">
        <span
          className={cn(
            "mb-4 inline-flex w-fit items-center gap-1 rounded-md border px-2.5 py-1 text-[9px] font-extrabold tracking-wider uppercase",
            getPostCatColor(post.category),
          )}
        >
          {post.category}
        </span>

        <h1 className="font-display text-primary mb-6 text-3xl leading-tight font-extrabold text-balance sm:text-4xl">
          {post.title}
        </h1>

        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          {/* Author */}
          <div className="flex items-center gap-3">
            <span className="text-primary font-display relative flex size-10 items-center justify-center overflow-clip rounded-full border border-zinc-300 bg-zinc-200 text-sm font-bold uppercase">
              {post.author.image ? (
                <Image
                  alt={post.author.name || "Author"}
                  src={post.author.image}
                  fill
                  sizes="100%"
                  className="object-cover object-center"
                />
              ) : post.author.name ? (
                post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              ) : (
                <UserRound className="size-5.5" />
              )}
            </span>
            <div>
              {post.author.name && (
                <span className="text-primary block text-sm font-bold capitalize">
                  {post.author.name}
                </span>
              )}
              {post.author.email && (
                <span className="block text-xs font-semibold text-zinc-500">
                  {post.author.email}
                </span>
              )}
            </div>
          </div>

          {/* Time & Share */}
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
            <span className="flex items-center gap-1">
              <Calendar className="size-4" />
              {post.publishDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              {post.readTime}
            </span>
          </div>
        </div>
      </header>

      {/* Main content client wrapper */}
      {post.image && (
        <main className="rounded-card relative mb-6 aspect-video overflow-clip border-zinc-200 bg-zinc-50 shadow-xl">
          <Image
            alt={post.title}
            src={post.image}
            fill
            sizes="100%"
            className="object-cover object-center"
            loading="eager"
          />
        </main>
      )}

      <BlogContent post={post} />
    </section>
  );
}
