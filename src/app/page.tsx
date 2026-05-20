import Link from "next/link";
import {
  FileText,
  Sparkles,
  BookOpen,
  HelpCircle,
  CheckSquare,
  MessageSquare,
  TrendingUp,
  Award,
  Video,
  MoveRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <section className="w-full overflow-x-hidden bg-zinc-50/50 font-sans">
      {/* 1. Hero Section */}
      <section
        id="hero"
        className="from-primary relative flex min-h-[calc(100dvh-76px)] flex-col items-center justify-center overflow-hidden bg-linear-to-br via-slate-900 to-indigo-950 px-5 py-20 text-white lg:py-28"
      >
        {/* Dynamic backdrop accent rings */}
        <div className="bg-accent/10 absolute top-1/4 -left-36 size-96 rounded-full blur-3xl" />
        <div className="absolute -right-20 bottom-10 size-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <main className="relative z-10 mx-auto max-w-6xl text-center">
          <div className="text-accent mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold">
            <TrendingUp className="size-3.5" />
            Designed for the 2026 Hiring Landscape
          </div>

          <h1 className="font-display mx-auto mb-6 max-w-4xl text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Craft Your Career.
            <br />
            <span className="text-accent">Land the Dream Job.</span>
          </h1>

          <p className="font-body mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
            An all-in-one career launchpad empowering job seekers. Build
            high-fidelity resumes with live split-screen preview, study
            step-by-step guides, and master interactive STAR interview prep.
          </p>

          <div className="mx-auto mb-14 flex max-w-sm flex-col justify-center gap-4 sm:max-w-none sm:flex-row">
            <Link
              href="/generator"
              className="bg-accent hover:bg-accent/90 hover:shadow-accent/20 transition-300 group flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-medium text-white shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Build Your Resume
              <MoveRight className="transition-300 size-5 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/resume-guide"
              className="transition-300 flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-8 py-4 font-medium hover:-translate-y-0.5 hover:bg-white/15 active:translate-y-0"
            >
              Read the Guides
            </Link>
          </div>
        </main>
      </section>

      {/* 2. Page Directory Grid */}
      <section id="tools" className="wrapper py-20">
        <header className="mb-16 text-center">
          <h2 className="font-display text-primary mb-4 text-3xl font-bold sm:text-4xl">
            An Integrated Career Toolkit
          </h2>
          <p className="mx-auto max-w-xl leading-relaxed text-zinc-500">
            Every section of CareerCraft is engineered to help you craft the
            professional presence you need to stand out.
          </p>
        </header>

        <main className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {directoryCards.map((card) => (
            <div
              key={card.title}
              className="transition-300 group flex flex-col rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-6 flex items-start justify-between">
                <span
                  className={cn(
                    "transition-300 rounded-xl border p-3.5",
                    card.color,
                  )}
                >
                  <card.icon className="size-6" />
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
                className="text-primary group hover:text-accent transition-300 inline-flex w-fit items-center gap-1.5 text-sm font-semibold"
              >
                Get started
                <MoveRight className="transition-300 size-4 group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </main>
      </section>

      {/* 3. How It Works Section */}
      <section
        id="how-it-works"
        className="border-y border-zinc-100 bg-white py-20"
      >
        <section className="wrapper">
          <header className="mb-16 text-center">
            <h2 className="font-display text-primary mb-3 text-3xl font-bold">
              How the Resume Builder Works
            </h2>
            <p className="mx-auto max-w-md leading-relaxed text-zinc-500">
              We have eliminated split-screen friction to help you focus
              entirely on your professional story.
            </p>
          </header>

          <main className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Steps */}
            {howItWorks.map(({ color, description, id, title }) => (
              <div key={id} className="flex flex-col items-center text-center">
                <span
                  className={cn(
                    "mb-6 flex size-12 items-center justify-center rounded-full border text-lg font-bold shadow-sm",
                    color,
                  )}
                >
                  {id}
                </span>
                <h3 className="text-primary mb-2 text-lg font-bold">{title}</h3>
                <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
                  {description}
                </p>
              </div>
            ))}
          </main>
        </section>
      </section>

      {/* 4. Tips Snapshot Row */}
      <section
        id="tips"
        className="wrapper grid max-w-5xl grid-cols-1 items-center gap-8 py-20 lg:grid-cols-12 lg:gap-12"
      >
        <main className="lg:col-span-5">
          <span className="bg-accent/10 text-accent border-accent/5 mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow">
            <Award className="size-3.5" />
            Actionable Strategy
          </span>

          <h2 className="font-display text-primary mb-4 text-3xl leading-tight font-bold">
            Recruiter Insights Built-In
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-zinc-500">
            Our documentation and interactive check tools incorporate standard
            guidelines compiled directly from hiring managers and technical
            recruiters.
          </p>
          <Link
            href="/tips"
            className="bg-primary transition-300 group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white hover:bg-slate-900"
          >
            See All Tips
            <MoveRight className="transition-300 size-4 group-hover:translate-x-1" />
          </Link>
        </main>

        <main className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
          {tips.map(({ des, id, idColors, title }) => (
            <div
              key={id}
              className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg"
            >
              <span
                className={cn(
                  "w-fit rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase shadow",
                  idColors,
                )}
              >
                {id}
              </span>
              <h3 className="text-primary text-base font-bold">{title}</h3>
              <p className="flex-1 text-xs leading-relaxed text-zinc-500">
                {des}
              </p>
            </div>
          ))}
        </main>
      </section>

      {/* 5. Practice Q&A CTA Banner */}
      <section
        id="cta"
        className="from-primary relative overflow-hidden bg-linear-to-t to-indigo-950 py-16 text-center text-white"
      >
        <main className="wrapper relative z-10 flex max-w-3xl flex-col items-center">
          <span className="text-accent mb-6 rounded-full bg-white/10 p-3">
            <Video className="size-6" />
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
            className="bg-accent hover:bg-accent/90 hover:shadow-accent/20 transition-300 rounded-xl px-8 py-3.5 font-medium text-white shadow-md"
          >
            Practice Q&A Online
          </Link>
        </main>
      </section>
    </section>
  );
}

const directoryCards = [
  {
    title: "Resume Generator",
    description:
      "Build your professional resume in minutes using our live split-screen editor. Watch changes compile instantly and download a polished PDF.",
    href: "/generator",
    icon: FileText,
    color:
      "bg-indigo-50 border-indigo-200 text-indigo-700 group-hover:bg-indigo-100/50",
    badge: "Interactive",
  },
  {
    title: "Tips & Cheat Sheets",
    description:
      "Explore the do's and don'ts of modern hiring. Standard rules, ATS checks, formatting, attire, body language, and common pitfalls.",
    href: "/tips",
    icon: Sparkles,
    color:
      "bg-rose-50 border-rose-200 text-rose-700 group-hover:bg-rose-100/50",
    badge: "Quick Cheat Sheet",
  },
  {
    title: "Resume Guide",
    description:
      "A step-by-step structural deep dive. Learn how to draft summaries, achievements, and technical blocks that grab recruiter attention.",
    href: "/resume-guide",
    icon: BookOpen,
    color:
      "bg-emerald-50 border-emerald-200 text-emerald-700 group-hover:bg-emerald-100/50",
    badge: "Core Guide",
  },
  {
    title: "Interview Prep Guide",
    description:
      "Everything you need to master phone screens, technical panels, video calls, dress codes, body language, and salary negotiation.",
    href: "/interview-guide",
    icon: HelpCircle,
    color:
      "bg-amber-50 border-amber-200 text-amber-700 group-hover:bg-amber-100/50",
    badge: "Deep Prep",
  },
  {
    title: "STAR Q&A Practice",
    description:
      "Interactive flashcards loaded with standard interview questions. Reveal model STAR responses, bookmark favorites, and track progress.",
    href: "/interview-practice",
    icon: CheckSquare,
    color:
      "bg-violet-50 border-violet-200 text-violet-700 group-hover:bg-violet-100/50",
    badge: "Interactive Q&A",
  },
  {
    title: "Career Blog",
    description:
      "Stay ahead of current hiring markets. Read articles about keyword mapping, professional portfolios, and negotiating job offers.",
    href: "/blog",
    icon: MessageSquare,
    color: "bg-sky-50 border-sky-200 text-sky-700 group-hover:bg-sky-100/50",
    badge: "Market Insights",
  },
];

const howItWorks = [
  {
    id: 1,
    title: "Input Your Details",
    description:
      "Fill in structured forms covering experience, education, skills, and certifications step-by-step.",
    color: "text-indigo-700 border-indigo-200 bg-indigo-50",
  },
  {
    id: 2,
    title: "Watch Live Sync",
    description:
      "See your resume build side-by-side with zero latency. Seamlessly toggle templates and colors.",
    color: "border-rose-200 bg-rose-50 text-rose-700",
  },
  {
    id: 3,
    title: "Download Polished PDF",
    description:
      "Generate high-quality standard PDFs locally using our responsive multi-page rendering engine.",
    color: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
];

const tips = [
  {
    id: "Resume Do",
    idColors: "text-emerald-800 bg-emerald-100 border-emerald-200",
    title: "Quantify Achievements",
    des: `Recruiters love data. Write "Led migration to Next.js, boosting load speed by 40%" instead of "Worked on Next.js frontend code."`,
  },
  {
    id: "Interview Don't",
    idColors: "bg-rose-100 text-rose-800 border-rose-200",
    title: "Avoid Vague Examples",
    des: `Avoid generic statements like "I handle conflicts well." Use the STAR method to anchor answers in verifiable historical events.`,
  },
];
