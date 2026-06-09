"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { useProgress } from "@/context/ProgressContext";
import {
  Search,
  Calendar,
  Clock,
  BookOpen,
  MessageSquare,
  Tag,
  Eye,
  ImageIcon,
  UserRound,
} from "lucide-react";
import { apiRequest, cn, getPostCatColor } from "@/lib/utils";
import Image from "next/image";
import useSWR from "swr";
import { BlogPost } from "@/db/schema";
import { Loader } from "@/components/shared/Loader";

export default function BlogListingPage() {
  const { data, isLoading } = useSWR<{ posts: BlogPost[] }>(
    "/api/blogs",
    apiRequest,
  );
  const blogPosts = data?.posts || [];
  const categories = ["All", ...new Set(blogPosts.map((b) => b.category))];

  const { progress } = useProgress();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 md:py-16">
      {/* Header */}
      <header id="header" className="mx-auto mb-12 max-w-2xl text-center">
        <span className="bg-accent/10 border-accent/10 text-accent mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
          <MessageSquare className="size-3.5 animate-pulse" />
          Hiring Market Insights
        </span>

        <h1 className="font-display text-primary mb-4 text-3xl leading-tight font-extrabold sm:text-4xl">
          The CareerCraft Blog
        </h1>
        <p className="text-base leading-relaxed text-zinc-500">
          Stay ahead of current hiring trends. Read guides, interview tactics,
          resume optimization checks, and salary negotiation formulas written
          for 2026 job seekers.
        </p>
      </header>

      {/* Search & Categories Bar */}
      <main
        id="filters"
        className="mb-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow md:flex-row"
      >
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="text-primary font-body transition-300 w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pr-4 pl-11 text-xs shadow-sm focus:border-zinc-400 focus:outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex w-full flex-wrap items-center justify-start gap-2 md:w-auto md:justify-end">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                if (cat === selectedCategory) return;
                setSelectedCategory(cat);
              }}
              className={cn(
                "transition-300 cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-2 text-[10px] font-bold tracking-wider text-zinc-600 uppercase hover:border-zinc-300 hover:bg-zinc-100",
                {
                  "bg-primary border-primary hover:bg-primary/90 hover:border-primary text-white shadow-sm":
                    selectedCategory === cat,
                },
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </main>

      {/* Blog Cards Grid */}
      {isLoading ? (
        <div className="flex h-50 flex-col items-center justify-center gap-3">
          {/* <Loader2 className="text-accent size-10 animate-spin" /> */}
          <Loader length={12} />
          <span className="text-xs font-medium text-zinc-500">
            Loading articles...
          </span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <main
          id="no-post-found"
          className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white px-5 py-16 text-center shadow"
        >
          <BookOpen className="mx-auto mb-4 size-10 text-zinc-300" />
          <h3 className="font-display text-primary mb-2 text-lg font-bold">
            No articles found
          </h3>
          <p className="px-6 text-xs text-zinc-500">
            We couldn&apos;t find any articles, matching your search query. Try
            keywords like {categories.join(" ")}.
          </p>
        </main>
      ) : (
        <section id="posts" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredPosts.map((post) => {
            const isRead = progress.blogArticlesRead.includes(post.slug);
            return (
              <article
                key={post.slug}
                className="transition-300 group flex flex-col overflow-clip rounded-2xl border border-zinc-200 bg-white shadow hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative flex aspect-video overflow-clip bg-zinc-50 text-zinc-500">
                  {post.image ? (
                    <Image
                      alt={post.slug}
                      src={post.image}
                      fill
                      sizes="100%"
                      className="transition-300 group-hover:scale-105"
                      loading="eager"
                    />
                  ) : (
                    <ImageIcon className="m-auto size-12" />
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6 pt-4! sm:p-8">
                  {/* Meta details */}
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[9px] font-extrabold tracking-wider uppercase",
                        getPostCatColor(post.category),
                      )}
                    >
                      <Tag className="size-3" />
                      {post.category}
                    </span>

                    {isRead && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <Eye className="size-3.5" />
                        Read
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <Link
                    className="font-display text-primary hover:text-accent transition-300 mb-3 text-xl leading-snug font-bold"
                    href={`/blog/${post.slug}`}
                  >
                    {post.title}
                  </Link>

                  {/* Excerpt */}
                  <p className="font-body mb-6 flex-1 text-sm leading-relaxed text-zinc-500">
                    {post.excerpt}
                  </p>

                  {/* Footer details */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4">
                    {/* Author details */}
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-display relative flex size-8.5 items-center justify-center overflow-clip rounded-full border border-zinc-300 bg-zinc-200 text-xs font-bold uppercase shadow-sm">
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
                      <div className="font-semibold">
                        {post.author.name && (
                          <span className="text-primary block text-xs font-bold">
                            {post.author.name}
                          </span>
                        )}
                        {post.author.email && (
                          <span className="block text-[10px] text-zinc-500">
                            {post.author.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Publish date and read time */}
                    <div className="flex shrink-0 items-center gap-4 text-[10px] font-medium text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {post.publishDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
