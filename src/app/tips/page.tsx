"use client";

import { useState } from "react";
import { resumeTips, interviewTips } from "@/data/tips";
import {
  CheckCircle,
  AlertCircle,
  FileText,
  HelpCircle,
  Sparkles,
  Filter,
} from "lucide-react";
import { cn } from "../../lib/utils";

export default function TipsPage() {
  const [activeTab, setActiveTab] = useState<"resume" | "interview">("resume");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const currentTipsList = activeTab === "resume" ? resumeTips : interviewTips;

  const filteredTips = currentTipsList.filter((tip) => {
    if (selectedCategory === "All") return true;
    return tip.category === selectedCategory;
  });

  const handleTabChange = (tab: "resume" | "interview") => {
    setActiveTab(tab);
    setSelectedCategory("All"); // Reset filters
  };

  // Extract unique categories for current tab
  const categories = [
    "All",
    ...new Set(currentTipsList.map((t) => t.category)),
  ];

  return (
    <section className="wrapper max-w-6xl py-12 md:py-16">
      {/* Page Header */}
      <header
        id="header"
        className="mx-auto mb-12 max-w-2xl text-center text-pretty"
      >
        <span className="bg-accent/10 border-accent/10 text-accent mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow">
          <Sparkles className="size-3.5 animate-pulse" />
          Hiring Cheat Sheets
        </span>

        <h1 className="font-display text-primary mb-4 text-3xl leading-tight font-extrabold sm:text-4xl">
          Recruiter Secrets & Cheat Sheets
        </h1>
        <p className="text-base leading-relaxed text-zinc-500">
          Nail every application step with proven do&apos;s and don&apos;ts.
          Compiled directly from hiring managers and recruiters in the 2026
          technical job market.
        </p>
      </header>

      {/* Selector Tabs */}
      <section
        id="tabs"
        className="mx-auto mb-10 grid max-w-md grid-cols-2 border-b border-zinc-200"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              if (activeTab === t.id) return;
              handleTabChange(t.id);
            }}
            className={cn(
              "transition-300 flex cursor-pointer items-center justify-center gap-2 border-b-2 border-transparent py-4 text-sm font-semibold text-zinc-400 hover:text-zinc-500",
              {
                "border-primary text-primary hover:text-primary/90":
                  activeTab === t.id,
              },
            )}
          >
            <t.icon className="size-4" />
            {t.name}
          </button>
        ))}
      </section>

      {/* Category Filters */}
      <section
        id="filters"
        className="mb-10 flex flex-wrap items-center justify-center gap-2"
      >
        <span className="mr-2 flex items-center gap-1.5 text-xs font-bold tracking-wider text-zinc-400 uppercase">
          <Filter className="h-3.5 w-3.5" />
          Filter:
        </span>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              if (cat === selectedCategory) return;
              setSelectedCategory(cat);
            }}
            className={cn(
              "transition-300 text-zinc-650 cursor-pointer rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-semibold hover:border-zinc-300 hover:bg-zinc-100",
              {
                "bg-primary border-primary hover:bg-primary/90 hover:border-primary text-white shadow-sm":
                  selectedCategory === cat,
              },
            )}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Tips Grid */}
      <section
        id="tips"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
      >
        {filteredTips.map((tip) => {
          const isDo = tip.type === "do";
          return (
            <div
              key={tip.id}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border border-rose-100/70 bg-white p-6 shadow-sm transition-all duration-200 hover:border-rose-200 hover:shadow-md sm:p-8",
                { "border-emerald-100/70 hover:border-emerald-200": isDo },
              )}
            >
              {/* Context Tag indicator */}
              <div
                className={cn(
                  "transition-300 absolute top-0.5 left-1/2 h-1 w-25 -translate-x-1/2 rounded-full bg-rose-500 group-hover:top-0 group-hover:w-full",
                  { "bg-emerald-500": isDo },
                )}
              />

              <div className="mb-5 flex items-stretch gap-2.5">
                <span
                  className={cn(
                    "w-fit shrink-0 rounded-lg border border-rose-100 bg-rose-50 p-1.5 text-rose-600 [&_svg]:size-5",
                    {
                      "border-emerald-100 bg-emerald-50 text-emerald-600": isDo,
                    },
                  )}
                >
                  {isDo ? <CheckCircle /> : <AlertCircle />}
                </span>
                <span className="flex items-center rounded-md border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-[10px] font-extrabold tracking-wider text-zinc-700 uppercase">
                  {tip.category}
                </span>
              </div>

              <h2 className="font-display text-primary mb-3 text-lg font-bold">
                {tip.headline}
              </h2>

              <p className="mb-5 flex-1 text-sm leading-relaxed text-zinc-500">
                {tip.explanation}
              </p>

              {!!tip.example && (
                <div
                  className={cn(
                    "font-body rounded-xl border border-rose-100 bg-rose-50/50 p-4 text-xs leading-relaxed text-rose-800",
                    {
                      "border-emerald-100 bg-emerald-50/50 text-emerald-800":
                        isDo,
                    },
                  )}
                >
                  <span className="mb-1 block font-bold uppercase">
                    Example:
                  </span>
                  <span className="italic">{tip.example}</span>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </section>
  );
}

const tabs = [
  { id: "resume" as const, icon: FileText, name: "Resume Guidelines" },
  { id: "interview" as const, icon: HelpCircle, name: "Interview Cheat Sheet" },
];
