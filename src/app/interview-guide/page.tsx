"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  CornerDownRight,
  HelpCircle,
  Loader2,
  MoveRight,
} from "lucide-react";
import { apiRequest, cn } from "../../lib/utils";
import useSWR from "swr";
import { Guide } from "@/db/schema";

export default function InterviewGuidePage() {
  const { data, isLoading } = useSWR<{
    sections: Guide[];
  }>("/api/guides", apiRequest);
  const guides = data?.sections?.filter((s) => s.type === "Interview") || [];

  const [activeSection, setActiveSection] = useState<Guide["id"]>(
    guides[0]?.id || "",
  );
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor scroll progress & active sections
  useEffect(() => {
    if (guides.length === 0) return;

    setActiveSection(guides[0].id);
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // Check which section is currently centered on screen
      const sections = guides.map((s) => document.getElementById(s.id));
      const scrollPos = window.scrollY + 200;

      for (let i = 0; i < sections.length; i++) {
        const el = sections[i];
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollPos >= top && scrollPos <= bottom) {
            setActiveSection(guides[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [guides]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <section className="relative flex w-full flex-1 flex-col">
      {/* Scroll Progress Indicator Bar */}
      <div
        className="bg-accent fixed top-15 left-0 z-40 h-1 max-w-full transition-all duration-100 ease-linear"
        style={{ width: `${scrollProgress}%` }}
      />

      <section className="wrapper grid flex-1 grid-cols-1 gap-12 py-12 md:py-16 lg:grid-cols-12">
        {/* Table of Contents Sticky Sidebar (Desktop) */}
        <aside className="sticky top-30 hidden h-fit max-h-[calc(100vh-150px)] overflow-y-auto pr-6 lg:col-span-4 lg:block">
          <div className="text-primary mb-6 flex items-center gap-2">
            <HelpCircle className="size-5" />
            <h2 className="font-display -mt-1 text-lg font-extrabold">
              Interview prep
            </h2>
          </div>

          <nav className="flex flex-col gap-1 border-l-2 border-zinc-200">
            {guides.map((sect) => (
              <button
                key={sect.id}
                onClick={() => scrollToSection(sect.id)}
                className={cn(
                  "transition-300 -ml-0.5 cursor-pointer truncate border-l-2 border-transparent py-2 pl-4 text-left text-sm font-semibold text-zinc-400 hover:border-zinc-300 hover:text-zinc-600",
                  {
                    "border-primary hover:border-primary hover:text-primary text-primary bg-zinc-100 font-bold":
                      activeSection === sect.id,
                  },
                )}
              >
                {sect.title}
              </button>
            ))}
          </nav>

          <div className="from-primary mt-8 flex flex-col gap-4 rounded-2xl bg-linear-to-br to-indigo-950 p-6 text-white shadow-sm">
            <h3 className="font-display text-base leading-tight font-bold">
              Practice makes permanent.
            </h3>
            <p className="text-xs leading-relaxed text-zinc-300">
              Open our flashcard drill and try organizing your stories in the
              STAR structure.
            </p>
            <Link
              href="/interview-practice"
              className="bg-accent hover:bg-accent/90 group transition-300 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white"
            >
              Start Q&A Drill
              <MoveRight className="transition-300 size-3.5 group-hover:translate-x-1" />
            </Link>
          </div>
        </aside>

        {/* Long-form Reading Content Container */}
        <main className="space-y-12 lg:col-span-8">
          <div className="border-b border-zinc-200 pb-8">
            <span className="mb-4 block w-fit rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-rose-500 uppercase shadow">
              Comprehensive Reading Module
            </span>

            <h1 className="font-display text-primary mb-4 text-4xl leading-tight font-extrabold">
              Interview Strategy Blueprint
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-500">
              Nail every interview format. Learn dynamic strategies covering
              live tech coding rounds, virtual settings setups, salary scripts,
              and behavioral mapping systems.
            </p>
          </div>

          {isLoading ? (
            <div className="flex h-50 flex-col items-center justify-center gap-3">
              <Loader2 className="text-accent size-10 animate-spin" />
              <span className="text-xs font-medium text-zinc-500">
                Loading interview strategy blueprint...
              </span>
            </div>
          ) : guides.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center">
              <HelpCircle className="text-accent mb-3 size-10" />
              <h3 className="text-sm font-bold text-zinc-800">
                No guide sections found
              </h3>
              <p className="mt-2 max-w-xs text-xs text-pretty text-zinc-400">
                We couldn't locate what you're looking for. Please check your
                internet connection and try again, or the interview guide may
                not be available at the moment.
              </p>
            </div>
          ) : (
            guides.map((sect) => (
              <section
                key={sect.id}
                id={sect.id}
                className="scroll-mt-36 rounded-2xl border border-zinc-200 bg-white p-6 shadow sm:p-8"
              >
                {!!sect.subtitle && (
                  <span className="text-accent mb-2 block text-xs font-bold tracking-wide uppercase">
                    {sect.subtitle}
                  </span>
                )}

                <h2 className="font-display text-primary mb-4 text-2xl font-bold">
                  {sect.title}
                </h2>

                <p className="font-body mb-6 text-sm leading-relaxed text-zinc-500">
                  {sect.content}
                </p>

                {!!sect.bullets && sect.bullets.length > 0 && (
                  <ul className="flex flex-col gap-3 border-t border-zinc-200 pt-6">
                    {sect.bullets.map((bullet, idx) => (
                      <li
                        key={idx}
                        className="text-zinc-550 flex items-start gap-3 text-xs leading-relaxed"
                      >
                        <span className="mt-px shrink-0 rounded border border-rose-200 bg-rose-100 p-0.5 text-rose-600">
                          <Check className="size-3 stroke-3" />
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {!!sect.ctaText && !!sect.ctaLink && (
                  <div className="mt-8 flex flex-col justify-between gap-4 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center">
                    <span className="text-primary flex items-center gap-1.5 text-xs font-semibold">
                      <CornerDownRight className="text-accent size-4 shrink-0" />
                      Take action on this blueprint
                    </span>
                    <Link
                      href={sect.ctaLink}
                      className="bg-primary group transition-300 inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-medium text-white shadow hover:bg-slate-900"
                    >
                      {sect.ctaText}
                      <MoveRight className="transition-300 size-3.5 group-hover:translate-x-1" />
                    </Link>
                  </div>
                )}
              </section>
            ))
          )}
        </main>
      </section>
    </section>
  );
}
