'use client';

import React, { useEffect, useState } from 'react';
import { BlogPost } from '../../data/blog';
import { useProgress } from '../../context/ProgressContext';
import { useUI } from '../../context/UIContext';
import { Share2, Bookmark, Check } from 'lucide-react';

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
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      addToast('Article link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const parseMarkdown = (markdown: string) => {
    const blocks = markdown.split(/\n\n+/);
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('# ')) {
        // Skip main title because we render it in the parent SSR page
        if (idx === 0 || trimmed.toLowerCase().includes(post.title.toLowerCase().substring(0, 10))) return null;
        return (
          <h2 key={idx} className="font-display text-2xl font-bold text-primary mt-8 mb-4 border-b border-zinc-100 pb-2">
            {trimmed.replace('# ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-display text-xl font-bold text-primary mt-6 mb-3">
            {trimmed.replace('## ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="p-4 bg-zinc-50 border-l-4 border-accent text-zinc-650 rounded-r-xl italic my-4 leading-relaxed font-body">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map(line => line.replace('- ', '').trim());
        return (
          <ul key={idx} className="list-disc pl-6 my-4 flex flex-col gap-2 text-zinc-500">
            {items.map((item, i) => (
              <li key={i} className="text-zinc-500 text-sm leading-relaxed font-body">
                {item}
              </li>
            ))}
          </ul>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split('\n').map(line => line.replace(/^\d+\.\s/, '').trim());
        return (
          <ol key={idx} className="list-decimal pl-6 my-4 flex flex-col gap-2 text-zinc-500">
            {items.map((item, i) => (
              <li key={i} className="text-zinc-500 text-sm leading-relaxed font-body">
                {item}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <p key={idx} className="text-zinc-500 text-sm leading-relaxed my-4 font-body">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      {/* Article Content */}
      <div className="lg:col-span-9 bg-white border border-zinc-150 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="prose max-w-none">
          {parseMarkdown(post.content)}
        </div>
      </div>

      {/* Share sidebar widget */}
      <aside className="lg:col-span-3 flex flex-col gap-6 sticky top-[100px] h-fit no-print">
        <div className="bg-white border border-zinc-150 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-xs text-primary uppercase tracking-wider mb-4">
            Actions
          </h3>
          
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-650 hover:bg-zinc-50 hover:text-zinc-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Share article'}
          </button>
        </div>

        <div className="bg-gradient-to-br from-primary to-indigo-950 text-white rounded-2xl p-5 shadow-sm text-center">
          <Bookmark className="w-6 h-6 text-accent mx-auto mb-3" />
          <h4 className="font-display font-bold text-sm mb-1">Interactive Q&A</h4>
          <p className="text-zinc-400 text-[10px] leading-relaxed mb-4">
            Put these interview tips to practice in our flashcard studio.
          </p>
          <Link
            href="/interview-practice"
            className="block text-center w-full py-2 px-4 rounded-lg bg-accent hover:bg-accent/90 text-white text-[10px] font-bold tracking-wider uppercase transition-colors"
          >
            Start Practice
          </Link>
        </div>
      </aside>

    </div>
  );
}
