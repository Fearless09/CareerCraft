"use client";

import { useResume } from "@/context/ResumeContext";
import { Sparkles, MessageSquare, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_LENGTH = 300;

export default function SummarySection() {
  const { resumeData, updateSummary } = useResume();

  const charCount = resumeData.summary.length;
  const isOverLimit = charCount > MAX_LENGTH;
  const isNearLimit = charCount >= MAX_LENGTH - 40 && charCount <= MAX_LENGTH;

  return (
    <section className="space-y-6">
      <header>
        <h2 className="mb-1 text-lg font-bold text-zinc-100">
          Professional Summary
        </h2>
        <p className="text-sm text-balance text-zinc-400">
          Write a brief statement detailing your active career highlights, core
          domain expertise, and professional aspirations.
        </p>
      </header>

      <main id="summary_form" className="space-y-3">
        <label
          htmlFor="executive_summary"
          className="flex items-center justify-between text-xs font-semibold text-zinc-300"
        >
          <span className="flex items-center gap-1.5">
            <MessageSquare className="size-3.75 text-zinc-400" />
            <span>Executive Summary</span>
          </span>

          <span
            className={cn(
              `transition-300 font-mono text-[11px] text-zinc-500`,
              {
                "animate-pulse font-bold text-red-400": isOverLimit,
                "font-medium text-amber-400": isNearLimit,
              },
            )}
          >
            {charCount} / {MAX_LENGTH} chars
          </span>
        </label>

        <textarea
          id="executive_summary"
          value={resumeData.summary}
          onChange={(e) => updateSummary(e.target.value)}
          rows={6}
          placeholder="Passionate Senior Frontend Engineer with 6+ years of experience designing and developing responsive, high-performance web applications..."
          className={cn(
            `transition-300 focus:border-accent focus:ring-accent w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-200 focus:ring-1 focus:outline-none`,
            {
              "border-red-500 focus:border-red-500 focus:ring-red-500":
                isOverLimit,
            },
          )}
        />

        {/* Dynamic Character Constraint Progress Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className={cn(`transition-300 bg-accent h-full max-w-full`, {
              "bg-amber-500": isNearLimit,
              "bg-red-500": isOverLimit,
            })}
            style={{
              width: `${Math.min((charCount / MAX_LENGTH) * 100, 100)}%`,
            }}
          />
        </div>

        {/* Warning Indicator */}
        {isOverLimit && (
          <div className="flex items-start gap-1.5 rounded-lg border border-red-900/30 bg-red-950/10 p-2.5 text-xs font-medium text-red-400">
            <AlertCircle className="mt-px size-4 shrink-0" />
            <span>
              Oops! Your summary is slightly too long. Recruiter research shows
              maintaining summaries under 300 characters ensures maximum
              engagement.
            </span>
          </div>
        )}
      </main>

      {/* Recruiter Cheat Tips */}
      <main
        id="pro_tips"
        className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4.5"
      >
        <p className="flex items-center gap-1.5 text-sm font-semibold text-zinc-200">
          <Sparkles className="size-4 text-amber-400" />
          <span>Pro Resume Tips: Summaries</span>
        </p>

        <ul className="list-disc space-y-1.75 pl-4.75 text-xs leading-normal text-zinc-400">
          {tips.map((t, indx) => (
            <li key={indx}>
              <strong>{t.strong}</strong> {t.normal}
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
}

const tips = [
  {
    strong: "Lead with numbers:",
    normal:
      '"Led a 5-person team," "Boosted page loading by 40%." Impact is always measurable.',
  },
  {
    strong: "Avoid generalities:",
    normal:
      'Ditch generic fluff phrases like "hard worker" or "highly motivated." Focus on practical actions.',
  },
  {
    strong: "Keep it tight:",
    normal:
      "Limit this section to exactly 2-3 focused sentences. Your Work Experience will details the specifics!",
  },
];
