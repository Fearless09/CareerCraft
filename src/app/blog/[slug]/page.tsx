import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getPostCatColor } from "../../../data/blog";
import { ArrowLeft, Clock, Calendar, MoveLeft } from "lucide-react";
import BlogContent from "../../../components/blog/BlogContent";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="wrapper max-w-4xl flex-1 py-12 md:py-16">
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

        <h1 className="font-display text-primary mb-6 text-3xl leading-tight font-extrabold sm:text-4xl">
          {post.title}
        </h1>

        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          {/* Author */}
          <div className="flex items-center gap-3">
            <span className="text-primary font-display flex size-10 items-center justify-center rounded-full border border-zinc-300 bg-zinc-200 text-sm font-bold uppercase">
              {post.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <div className="">
              <span className="text-primary block text-sm font-bold uppercase">
                {post.author.name}
              </span>
              <span className="block text-xs font-semibold text-zinc-500">
                {post.author.role}
              </span>
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
      <BlogContent post={post} />
    </div>
  );
}
