"use client";

import { useEffect } from "react";
import { useProgress } from "../../context/ProgressContext";
import { useUI } from "../../context/UIContext";
import { Share2, Bookmark, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { parseMarkdown } from "@/lib/parseMarkdown";
import { BlogPost } from "@/db/schema";
import useCopy from "@/hooks/useCopy";

interface Props {
  post: BlogPost;
}

export default function BlogContent({ post }: Props) {
  const { markArticleRead } = useProgress();
  const { addToast } = useUI();
  const { copied, copy } = useCopy();

  useEffect(() => {
    // Mark article as read when user opens the page
    markArticleRead(post.slug);
  }, [post.slug, markArticleRead]);

  return (
    <>
      <section className="grid grid-cols-1 gap-10 gap-x-5 lg:grid-cols-12">
        {/* Article Content */}
        <main className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8 lg:col-span-9">
          <article className="prose max-w-none">
            {parseMarkdown({ markdown: post.content, title: post.title })}
          </article>
        </main>

        {/* Share sidebar widget */}
        <aside className="no-print sticky top-25 flex h-fit flex-col gap-6 lg:col-span-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-primary mb-4 text-xs font-semibold tracking-wider uppercase">
              Actions
            </h3>

            <button
              onClick={() => {
                if (typeof window == "undefined") return;
                copy(window.location.href);
                addToast("Article link copied to clipboard!", "success");
              }}
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
    </>
  );
}
