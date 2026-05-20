'use client';

import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

export default function SummarySection() {
  const { resumeData, updateSummary } = useResume();
  const maxLength = 300;
  
  const charCount = resumeData.summary.length;
  const isOverLimit = charCount > maxLength;
  const isNearLimit = charCount >= maxLength - 40 && charCount <= maxLength;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSummary(e.target.value);
  };

  const getProgressColor = () => {
    if (isOverLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-amber-500';
    return 'bg-accent';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-zinc-100 mb-1">Professional Summary</h2>
        <p className="text-xs text-zinc-400">Write a brief statement detailing your active career highlights, core domain expertise, and professional aspirations.</p>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
            <span>Executive Summary</span>
          </span>
          <span className={`text-[11px] font-mono transition-all ${
            isOverLimit 
              ? 'text-red-400 font-bold animate-pulse' 
              : isNearLimit 
                ? 'text-amber-400 font-medium' 
                : 'text-zinc-500'
          }`}>
            {charCount} / {maxLength} chars
          </span>
        </label>
        
        <textarea
          value={resumeData.summary}
          onChange={handleChange}
          rows={6}
          placeholder="Passionate Senior Frontend Engineer with 6+ years of experience designing and developing responsive, high-performance web applications..."
          className={`w-full bg-zinc-900 border text-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 transition duration-150 ${
            isOverLimit 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-zinc-800 focus:border-accent focus:ring-accent'
          }`}
        />

        {/* Dynamic Character Constraint Progress Bar */}
        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-150 ${getProgressColor()}`}
            style={{ width: `${Math.min((charCount / maxLength) * 100, 100)}%` }}
          />
        </div>

        {/* Warning Indicator */}
        {isOverLimit && (
          <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Oops! Your summary is slightly too long. Recruiter research shows maintaining summaries under 300 characters ensures maximum engagement.</span>
          </div>
        )}
      </div>

      {/* Recruiter Cheat Tips */}
      <div className="bg-zinc-900/50 border border-zinc-850 rounded-xl p-4.5 space-y-3">
        <p className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Pro Resume Tips: Summaries</span>
        </p>
        
        <ul className="list-disc pl-4.5 space-y-1.8 text-[11.5px] text-zinc-400 leading-normal">
          <li><strong>Lead with numbers:</strong> "Led a 5-person team," "Boosted page loading by 40%." Impact is always measurable.</li>
          <li><strong>Avoid generalities:</strong> Ditch generic fluff phrases like "hard worker" or "highly motivated." Focus on practical actions.</li>
          <li><strong>Keep it tight:</strong> Limit this section to exactly 2-3 focused sentences. Your Work Experience will details the specifics!</li>
        </ul>
      </div>
    </div>
  );
}
