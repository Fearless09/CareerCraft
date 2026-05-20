'use client';

import React, { useState } from 'react';
import { resumeTips, interviewTips, Tip } from '../../data/tips';
import { CheckCircle, AlertCircle, FileText, HelpCircle, Sparkles, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function TipsPage() {
  const [activeTab, setActiveTab] = useState<'resume' | 'interview'>('resume');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const currentTipsList = activeTab === 'resume' ? resumeTips : interviewTips;
  
  // Extract unique categories for current tab
  const categories = ['All', ...new Set(currentTipsList.map((t) => t.category))];

  const filteredTips = currentTipsList.filter((tip) => {
    if (selectedCategory === 'All') return true;
    return tip.category === selectedCategory;
  });

  const handleTabChange = (tab: 'resume' | 'interview') => {
    setActiveTab(tab);
    setSelectedCategory('All'); // Reset filters
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 md:py-16">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Hiring Cheat Sheets
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary mb-4 leading-tight">
          Recruiter Secrets & Cheat Sheets
        </h1>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Nail every application step with proven do&apos;s and don&apos;ts. Compiled directly from hiring managers and recruiters in the 2026 technical job market.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex justify-center border-b border-zinc-200 mb-10 max-w-md mx-auto">
        <button
          onClick={() => handleTabChange('resume')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-4 font-semibold text-sm border-b-2 transition-all duration-200',
            activeTab === 'resume'
              ? 'border-primary text-primary'
              : 'border-transparent text-zinc-400 hover:text-zinc-650'
          )}
        >
          <FileText className="w-4 h-4" />
          Resume Guidelines
        </button>
        <button
          onClick={() => handleTabChange('interview')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-4 font-semibold text-sm border-b-2 transition-all duration-200',
            activeTab === 'interview'
              ? 'border-primary text-primary'
              : 'border-transparent text-zinc-400 hover:text-zinc-650'
          )}
        >
          <HelpCircle className="w-4 h-4" />
          Interview Cheat Sheet
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mr-2 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
              selectedCategory === cat
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-100 hover:border-zinc-300'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-fade-in">
        {filteredTips.map((tip) => {
          const isDo = tip.type === 'do';
          return (
            <div
              key={tip.id}
              className={cn(
                'flex flex-col p-6 sm:p-8 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden',
                isDo ? 'border-emerald-100/70 hover:border-emerald-200' : 'border-rose-100/70 hover:border-rose-200'
              )}
            >
              {/* Context Tag indicator */}
              <div className="absolute top-0 right-0 h-1.5 w-full bg-emerald-500" className={cn(
                'absolute top-0 left-0 h-1 w-full',
                isDo ? 'bg-emerald-500' : 'bg-rose-500'
              )} />
              
              <div className="flex items-center gap-2.5 mb-5">
                <span className={cn(
                  'p-1.5 rounded-lg border w-fit shrink-0',
                  isDo 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                    : 'bg-rose-50 border-rose-100 text-rose-600'
                )}>
                  {isDo ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-650 border border-zinc-200">
                  {tip.category}
                </span>
              </div>

              <h2 className="font-display font-bold text-lg text-primary mb-3">
                {tip.headline}
              </h2>

              <p className="text-zinc-500 text-sm leading-relaxed mb-5 flex-1">
                {tip.explanation}
              </p>

              {tip.example && (
                <div className={cn(
                  'p-4 rounded-xl border text-xs leading-relaxed font-body',
                  isDo 
                    ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' 
                    : 'bg-rose-50/50 border-rose-100 text-rose-800'
                )}>
                  <span className="font-bold block mb-1">Example:</span>
                  <span className="italic">{tip.example}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
