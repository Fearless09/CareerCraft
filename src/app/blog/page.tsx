'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { blogPosts } from '../../data/blog';
import { useProgress } from '../../context/ProgressContext';
import { Search, Calendar, Clock, BookOpen, MessageSquare, Tag, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function BlogListingPage() {
  const { progress } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Resume', 'Interview', 'Negotiation', 'Job Search'];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 md:py-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent mb-4">
          <MessageSquare className="w-3.5 h-3.5 animate-pulse" />
          Hiring Market Insights
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary mb-4 leading-tight">
          The CareerCraft Blog
        </h1>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Stay ahead of current hiring trends. Read guides, interview tactics, resume optimization checks, and salary negotiation formulas written for 2026 job seekers.
        </p>
      </div>

      {/* Search & Categories Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white border border-zinc-150 rounded-2xl p-6 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-zinc-250 bg-zinc-50 text-xs text-primary focus:outline-none focus:border-primary font-body"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto justify-start md:justify-end">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-xl text-[10px] uppercase font-bold border tracking-wider transition-all duration-150',
                selectedCategory === cat
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white border-zinc-250 text-zinc-650 hover:bg-zinc-100 hover:border-zinc-300'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Blog Cards Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-zinc-150 rounded-2xl shadow-sm max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
          <h3 className="font-display font-bold text-lg text-primary mb-2">No articles found</h3>
          <p className="text-zinc-450 text-xs px-6">
            We couldn&apos;t find any articles matching your search query. Try keywords like &quot;STAR&quot;, &quot;negotiation&quot;, or &quot;resume&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          {filteredPosts.map((post) => {
            const isRead = progress.blogArticlesRead.includes(post.slug);
            return (
              <article
                key={post.slug}
                className="flex flex-col p-6 sm:p-8 rounded-2xl border border-zinc-150 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Meta details */}
                <div className="flex justify-between items-center gap-4 mb-4">
                  <span className={cn(
                    'inline-flex items-center gap-1 text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md border',
                    {
                      'bg-indigo-50 border-indigo-100 text-indigo-700': post.category === 'Resume',
                      'bg-rose-50 border-rose-100 text-rose-700': post.category === 'Interview',
                      'bg-emerald-50 border-emerald-100 text-emerald-700': post.category === 'Negotiation',
                      'bg-sky-50 border-sky-100 text-sky-700': post.category === 'Job Search',
                    }
                  )}>
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>
                  
                  {isRead && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <Eye className="w-3.5 h-3.5" />
                      Read
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="font-display font-bold text-xl text-primary mb-3 hover:text-accent transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="text-zinc-500 text-xs leading-relaxed mb-6 flex-1 font-body">
                  {post.excerpt}
                </p>

                {/* Footer details */}
                <div className="flex items-center justify-between border-t border-zinc-100 pt-5">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center font-bold text-xs text-primary font-display">
                      {post.author.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                    <div className="text-[10px] font-semibold leading-relaxed">
                      <span className="block text-primary font-bold">{post.author.name}</span>
                      <span className="block text-zinc-400">{post.author.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.publishDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                </div>

              </article>
            );
          })}
        </div>
      )}

    </div>
  );
}
