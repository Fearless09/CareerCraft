"use client";

import React, { useEffect, useState } from "react";
import { BlogPost } from "../../data/blog";
import { useProgress } from "../../context/ProgressContext";
import { useUI } from "../../context/UIContext";
import { Share2, Bookmark, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  post: BlogPost;
}

export default function BlogContent({ post }: Props) {
  const { markArticleRead } = useProgress();
  const { addToast } = useUI();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Mark article as read when user opens the page
    markArticleRead(post.slug);
  }, [post.slug, markArticleRead]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      addToast("Article link copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      {/* Article Content */}
      <main className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8 lg:col-span-9">
        <article className="prose max-w-none">
          {parseMarkdown({ post })}
        </article>
      </main>

      {/* Share sidebar widget */}
      <aside className="no-print sticky top-25 flex h-fit flex-col gap-6 lg:col-span-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-primary mb-4 text-xs font-semibold tracking-wider uppercase">
            Actions
          </h3>

          <button
            onClick={handleShare}
            className={cn(
              "transition-300 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-600 shadow-sm hover:bg-zinc-50 hover:text-zinc-700 [&>svg]:size-4",
              {
                "border-emerald-200 bg-emerald-50 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600":
                  copied,
              },
            )}
          >
            {copied ? (
              <>
                <Check />
                Copied!
              </>
            ) : (
              <>
                <Share2 />
                Share article
              </>
            )}
          </button>
        </div>

        <div className="from-primary rounded-2xl bg-linear-to-br to-indigo-950 p-5 text-center text-white shadow-sm">
          <Bookmark className="text-accent mx-auto mb-3 size-6" />
          <h4 className="font-display mb-1 text-sm font-bold">
            Interactive Q&A
          </h4>
          <p className="mb-4 text-[10px] leading-relaxed text-zinc-400">
            Put these interview tips to practice in our flashcard studio.
          </p>
          <Link
            href="/interview-practice"
            className="bg-accent hover:bg-accent/90 transition-300 block w-full rounded-lg px-4 py-2 text-center text-[10px] font-bold tracking-wider text-white uppercase"
          >
            Start Practice
          </Link>
        </div>
      </aside>
    </section>
  );
}

const parseMarkdown = ({ post }: Props) => {
  const blocks = post.content.split(/\n\n+/);
  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("# ")) {
      // Skip main title because we render it in the parent SSR page
      if (
        idx === 0 ||
        trimmed
          .toLowerCase()
          .includes(post.title.toLowerCase().substring(0, 10))
      )
        return null;
      return (
        <h2
          key={idx}
          className="font-display text-primary mt-8 mb-4 border-b border-zinc-100 pb-2 text-2xl font-semibold"
        >
          {trimmed.replace("# ", "")}
        </h2>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h3
          key={idx}
          className="font-body text-primary mt-6 mb-3 text-xl font-semibold"
        >
          {trimmed.replace("## ", "")}
        </h3>
      );
    }
    if (trimmed.startsWith("> ")) {
      return (
        <blockquote
          key={idx}
          className="border-accent font-body my-4 rounded-r-xl border-l-4 bg-zinc-100 p-4 leading-relaxed text-zinc-600 italic"
        >
          {trimmed.replace("> ", "")}
        </blockquote>
      );
    }
    if (trimmed.startsWith("- ")) {
      const items = trimmed
        .split("\n")
        .map((line) => line.replace("- ", "").trim());
      return (
        <ul
          key={idx}
          className="my-4 flex list-disc flex-col gap-2 pl-6 text-zinc-500"
        >
          {items.map((item, i) => (
            <li key={i} className="font-body text-base leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed
        .split("\n")
        .map((line) => line.replace(/^\d+\.\s/, "").trim());
      return (
        <ol
          key={idx}
          className="my-4 flex list-decimal flex-col gap-2 pl-6 text-zinc-500"
        >
          {items.map((item, i) => (
            <li key={i} className="font-body text-base leading-relaxed">
              {item}
            </li>
          ))}
        </ol>
      );
    }
    return (
      <p
        key={idx}
        className="font-body my-4 text-base leading-relaxed text-zinc-500"
      >
        {trimmed}
      </p>
    );
  });
};
