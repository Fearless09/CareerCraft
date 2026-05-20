import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts } from '../../../data/blog';
import { ArrowLeft, Clock, Calendar, Bookmark, Share2 } from 'lucide-react';
import BlogContent from '../../../components/blog/BlogContent';

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
    <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-16">
      
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-primary mb-8 transition-colors no-print"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to blog
      </Link>

      {/* Article Header */}
      <header className="border-b border-zinc-150 pb-8 mb-10">
        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-150 text-indigo-700 w-fit mb-4">
          {post.category}
        </span>
        
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          {/* Author */}
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center font-bold text-sm text-primary font-display">
              {post.author.name.split(' ').map((n) => n[0]).join('')}
            </span>
            <div className="text-xs font-semibold leading-relaxed">
              <span className="block text-primary font-bold text-sm">{post.author.name}</span>
              <span className="block text-zinc-400 text-xs">{post.author.role}</span>
            </div>
          </div>

          {/* Time & Share */}
          <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.publishDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
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
