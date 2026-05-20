import Link from "next/link";
import {
  FileText,
  Sparkles,
  BookOpen,
  HelpCircle,
  CheckSquare,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Award,
  Video,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const directoryCards = [
    {
      title: "Resume Generator",
      description:
        "Build your professional resume in minutes using our live split-screen editor. Watch changes compile instantly and download a polished PDF.",
      href: "/generator",
      icon: FileText,
      color:
        "bg-indigo-50 border-indigo-150 text-indigo-700 hover:bg-indigo-100/50",
      badge: "Interactive",
    },
    {
      title: "Tips & Cheat Sheets",
      description:
        "Explore the do's and don'ts of modern hiring. Standard rules, ATS checks, formatting, attire, body language, and common pitfalls.",
      href: "/tips",
      icon: Sparkles,
      color: "bg-rose-50 border-rose-150 text-rose-700 hover:bg-rose-100/50",
      badge: "Quick Cheat Sheet",
    },
    {
      title: "Resume Guide",
      description:
        "A step-by-step structural deep dive. Learn how to draft summaries, achievements, and technical blocks that grab recruiter attention.",
      href: "/resume-guide",
      icon: BookOpen,
      color:
        "bg-emerald-50 border-emerald-150 text-emerald-700 hover:bg-emerald-100/50",
      badge: "Core Guide",
    },
    {
      title: "Interview Prep Guide",
      description:
        "Everything you need to master phone screens, technical panels, video calls, dress codes, body language, and salary negotiation.",
      href: "/interview-guide",
      icon: HelpCircle,
      color:
        "bg-amber-50 border-amber-150 text-amber-700 hover:bg-amber-100/50",
      badge: "Deep Prep",
    },
    {
      title: "STAR Q&A Practice",
      description:
        "Interactive flashcards loaded with standard interview questions. Reveal model STAR responses, bookmark favorites, and track progress.",
      href: "/interview-practice",
      icon: CheckSquare,
      color:
        "bg-violet-50 border-violet-150 text-violet-700 hover:bg-violet-100/50",
      badge: "Interactive Q&A",
    },
    {
      title: "Career Blog",
      description:
        "Stay ahead of current hiring markets. Read articles about keyword mapping, professional portfolios, and negotiating job offers.",
      href: "/blog",
      icon: MessageSquare,
      color: "bg-sky-50 border-sky-150 text-sky-700 hover:bg-sky-100/50",
      badge: "Market Insights",
    },
  ];

  return (
    <div className="flex w-full flex-1 flex-col overflow-x-hidden bg-zinc-50/50 font-sans">
      {/* 1. Hero Section */}
      <section className="from-primary relative overflow-hidden bg-gradient-to-br via-slate-900 to-indigo-950 px-6 py-20 text-white lg:py-28">
        {/* Dynamic backdrop accent rings */}
        <div className="bg-accent/10 absolute top-1/4 -left-36 h-96 w-96 rounded-full blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <div className="text-accent animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            Designed for the 2026 Hiring Landscape
          </div>

          <h1 className="font-display mx-auto mb-6 max-w-4xl text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Craft Your Career.
            <br />
            <span className="text-accent bg-clip-text">
              Land the Dream Job.
            </span>
          </h1>

          <p className="font-body mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
            An all-in-one career launchpad empowering job seekers. Build
            high-fidelity resumes with live split-screen preview, study
            step-by-step guides, and master interactive STAR interview prep.
          </p>

          <div className="mx-auto mb-14 flex max-w-sm flex-col justify-center gap-4 sm:max-w-none sm:flex-row">
            <Link
              href="/generator"
              className="bg-accent hover:bg-accent/90 hover:shadow-accent/20 flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Build Your Resume
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/resume-guide"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-8 py-4 font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 active:translate-y-0"
            >
              Read the Guides
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Page Directory Grid */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="mb-16 text-center">
          <h2 className="font-display text-primary mb-4 text-3xl font-bold sm:text-4xl">
            An Integrated Career Toolkit
          </h2>
          <p className="mx-auto max-w-xl leading-relaxed text-zinc-500">
            Every section of CareerCraft is engineered to help you craft the
            professional presence you need to stand out.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {directoryCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={cn(
                  "animate-fade-in-up flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
                  `[animation-delay:${idx * 75}ms]`,
                )}
              >
                <div className="mb-6 flex items-start justify-between">
                  <span
                    className={cn(
                      "rounded-xl border p-3.5",
                      card.color.split(" ")[0],
                      card.color.split(" ")[1],
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-zinc-650 rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase">
                    {card.badge}
                  </span>
                </div>

                <h3 className="font-display text-primary mb-3 text-xl font-bold">
                  {card.title}
                </h3>

                <p className="mb-6 flex-1 text-sm leading-relaxed text-zinc-500">
                  {card.description}
                </p>

                <Link
                  href={card.href}
                  className="text-primary group hover:text-accent inline-flex w-fit items-center gap-1.5 text-sm font-semibold transition-colors"
                >
                  Get started
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="border-zinc-150 border-y bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="font-display text-primary mb-3 text-3xl font-bold">
              How the Resume Builder Works
            </h2>
            <p className="mx-auto max-w-md leading-relaxed text-zinc-500">
              We have eliminated split-screen friction to help you focus
              entirely on your professional story.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Steps */}
            <div className="flex flex-col items-center text-center">
              <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 text-lg font-bold text-indigo-700 shadow-sm">
                1
              </span>
              <h3 className="text-primary mb-2 text-lg font-bold">
                Input Your Details
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
                Fill in structured forms covering experience, education, skills,
                and certifications step-by-step.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-lg font-bold text-rose-700 shadow-sm">
                2
              </span>
              <h3 className="text-primary mb-2 text-lg font-bold">
                Watch Live Sync
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
                See your resume build side-by-side with zero latency. Seamlessly
                toggle templates and colors.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-lg font-bold text-emerald-700 shadow-sm">
                3
              </span>
              <h3 className="text-primary mb-2 text-lg font-bold">
                Download Polished PDF
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
                Generate high-quality standard PDFs locally using our responsive
                multi-page rendering engine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tips Snapshot Row */}
      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="bg-accent/10 text-accent mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
              <Award className="h-3.5 w-3.5" />
              Actionable Strategy
            </span>
            <h2 className="font-display text-primary mb-4 text-3xl leading-tight font-bold">
              Recruiter Insights Built In
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-zinc-500">
              Our documentation and interactive check tools incorporate standard
              guidelines compiled directly from hiring managers and technical
              recruiters.
            </p>
            <Link
              href="/tips"
              className="bg-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-900"
            >
              See All Tips
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
            <div className="border-zinc-150 flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm">
              <span className="border-emerald-250 w-fit rounded-full border bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-emerald-800 uppercase">
                Resume Do
              </span>
              <h3 className="text-primary text-base font-bold">
                Quantify Achievements
              </h3>
              <p className="flex-1 text-xs leading-relaxed text-zinc-500">
                Recruiters love data. Write &quot;Led migration to Next.js,
                boosting load speed by 40%&quot; instead of &quot;Worked on
                Next.js frontend code.&quot;
              </p>
            </div>

            <div className="border-zinc-150 flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm">
              <span className="border-rose-250 w-fit rounded-full border bg-rose-100 px-2.5 py-1 text-[10px] font-extrabold text-rose-800 uppercase">
                Interview Don&apos;t
              </span>
              <h3 className="text-primary text-base font-bold">
                Avoid Vague Examples
              </h3>
              <p className="flex-1 text-xs leading-relaxed text-zinc-500">
                Avoid generic statements like &quot;I handle conflicts
                well.&quot; Use the STAR method to anchor answers in verifiable
                historical events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Practice Q&A CTA Banner */}
      <section className="from-primary relative overflow-hidden bg-gradient-to-r to-indigo-950 px-6 py-16 text-center text-white">
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
          <span className="text-accent mb-6 rounded-full bg-white/10 p-3">
            <Video className="h-6 w-6" />
          </span>
          <h2 className="font-display mb-4 text-3xl font-bold">
            Master the STAR Interview Method
          </h2>
          <p className="font-body mb-8 max-w-xl leading-relaxed text-zinc-300">
            Nail behavioral and technical questions using our interactive
            flashcard suite. Reveal model structured breakdowns and bookmark
            categories to log your progress.
          </p>
          <Link
            href="/interview-practice"
            className="bg-accent hover:bg-accent/90 hover:shadow-accent/10 rounded-xl px-8 py-3.5 font-medium text-white shadow-md transition-all duration-200"
          >
            Practice Q&A Online
          </Link>
        </div>
      </section>
    </div>
  );
}
