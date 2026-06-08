import { db } from "@/db";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  BookOpen,
  MessageSquare,
  CheckSquare,
  Users,
  ChevronRight,
  TrendingUp,
  FileText,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  "use cache";
  const [tips, guides, blogs, practiceQuestions, admins] = await Promise.all([
    db.query.tip.findMany(),
    db.query.guide.findMany(),
    db.query.blog.findMany(),
    db.query.practiceQuestion.findMany(),
    db.query.admin.findMany(),
  ]);

  const statCards = [
    {
      name: "Total Tips",
      count: tips.length,
      icon: Sparkles,
      color: "bg-orange-50 text-orange-600 border-orange-100",
      border: "hover:border-orange-200",
      text: "group-hover:text-orange-500",
      href: "/admin/tips",
    },
    {
      name: "Resume Modules",
      count: guides.filter((item) => item.type === "Resume").length,
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      border: "hover:border-blue-200",
      text: "group-hover:text-blue-500",
      href: "/admin/resume-guide",
    },
    {
      name: "Interview Modules",
      count: guides.filter((item) => item.type === "Interview").length,
      icon: HelpCircle,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
      border: "hover:border-indigo-200",
      text: "group-hover:text-indigo-500",
      href: "/admin/interview-guide",
    },
    {
      name: "Blog Posts",
      count: blogs.length,
      icon: MessageSquare,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      border: "hover:border-purple-200",
      text: "group-hover:text-purple-500",
      href: "/admin/blogs",
    },
    {
      name: "Practice Q&As",
      count: practiceQuestions.length,
      icon: CheckSquare,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      border: "hover:border-emerald-200",
      text: "group-hover:text-emerald-500",
      href: "/admin/practice",
    },
    {
      name: "Active Admins",
      count: admins.length,
      icon: Users,
      color: "bg-rose-50 text-rose-600 border-rose-100",
      border: "hover:border-rose-200",
      text: "group-hover:text-rose-500",
      href: "/admin/admins",
    },
  ];

  return (
    <section className="space-y-10">
      {/* Header Banner */}
      <header className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Admin Overview
          </h1>
          <p className="mt-1.5 max-w-lg text-sm text-balance text-zinc-500">
            Welcome to the CareerCraft Control Center. Monitor metrics and
            manage dynamic resource states.
          </p>
        </div>

        <span className="flex w-max shrink-0 items-center gap-2 rounded-xl border border-zinc-100 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 shadow-sm">
          <ShieldCheck className="text-accent size-4 animate-pulse" />
          <span>Security Protocol Active</span>
        </span>
      </header>

      {/* Grid of Metric Cards */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <main
            key={card.name}
            className={cn(
              "group transition-300 relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md",
              card.border,
            )}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold tracking-wide text-zinc-400 uppercase">
                {card.name}
              </h4>
              <span
                className={cn(
                  "transition-300 rounded-xl border p-2.5",
                  card.color,
                )}
              >
                <card.icon className="size-5" />
              </span>
            </div>

            <h1 className="mt-4 flex items-baseline gap-2">
              <span
                className={cn(
                  "transition-300 font-mono text-4xl font-extrabold tracking-tight text-zinc-900",
                  card.text,
                )}
              >
                {card.count}
              </span>
              <span
                className={cn(
                  "transition-300 text-xs font-semibold text-zinc-500",
                  card.text,
                )}
              >
                records
              </span>
            </h1>

            <Link
              href={card.href}
              className="transition-300 mt-6 flex items-center justify-between text-xs font-bold text-zinc-500 hover:text-zinc-800"
            >
              <span>Manage settings</span>
              <ChevronRight className="transition-300 size-3.5 group-hover:translate-x-1" />
            </Link>
          </main>
        ))}
      </section>

      {/* Quick Actions & Walkthrough */}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Quick Actions Panel */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:col-span-7">
          <h2 className="font-display mb-6 flex items-center gap-2 text-lg font-bold text-zinc-900">
            <TrendingUp className="text-accent size-4" />
            Quick Content Shortcuts
          </h2>

          <main className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {shortcuts.map((s, idx) => (
              <Link
                key={idx}
                href={s.link}
                className={cn(
                  "transition-300 group flex items-center gap-3.5 rounded-xl border border-zinc-200 bg-zinc-50/20 p-4 shadow-sm",
                  s.border,
                )}
              >
                <span className={cn("rounded-lg border p-2.5", s.iconColor)}>
                  <s.icon className="size-4" />
                </span>
                <div>
                  <span
                    className={cn(
                      "transition-300 block text-xs font-bold text-zinc-800",
                      s.textColor,
                    )}
                  >
                    {s.title}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-zinc-500">
                    {s.des}
                  </span>
                </div>
              </Link>
            ))}
          </main>
        </section>

        {/* Database Status Panel */}
        <section className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:col-span-5">
          <main>
            <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-bold text-zinc-900">
              <FileText className="size-4 text-blue-500" />
              System Information
            </h2>

            <ul className="mt-5 space-y-3.5">
              {systemInfo.map((info, idx) => (
                <li
                  key={idx}
                  className="grid grid-cols-2 items-center gap-2 truncate text-xs"
                >
                  <span className="text-zinc-500">{info.title}</span>
                  <span className="text-right font-mono font-semibold text-zinc-800">
                    {info.value}
                  </span>
                </li>
              ))}
            </ul>
          </main>

          <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-3 text-[10px] text-zinc-400">
            <span>CareerCraft Admin v1.2.2</span>
            <span>Local Time: {new Date().toLocaleDateString()}</span>
          </div>
        </section>
      </section>
    </section>
  );
}

const shortcuts = [
  {
    link: "/admin/blogs?action=new",
    icon: MessageSquare,
    iconColor: "bg-purple-50 border-purple-100 text-purple-600",
    border: "hover:border-purple-200",
    textColor: "group-hover:text-purple-600",
    title: "Compose Blog Post",
    des: "Vercel Blob asset upload",
  },
  {
    link: "/admin/tips?action=new",
    icon: Sparkles,
    iconColor: "bg-orange-50 border-orange-100 text-orange-600",
    border: "hover:border-orange-200",
    textColor: "group-hover:text-orange-600",
    title: "Add Insider Tip",
    des: "Resume / Interview",
  },
  {
    link: "/admin/practice?action=new",
    icon: CheckSquare,
    iconColor: "bg-emerald-50 border-emerald-100 text-emerald-600",
    border: "hover:border-emerald-200",
    textColor: "group-hover:text-emerald-600",
    title: "Add Practice Q&A",
    des: "STAR behavioral support",
  },
  {
    link: "/admin/resume-guide",
    icon: BookOpen,
    iconColor: "bg-blue-50 border-blue-100 text-blue-600",
    border: "hover:border-blue-200",
    textColor: "group-hover:text-blue-600",
    title: "Refactor Guides",
    des: "Edit step-by-step reading",
  },
];

const systemInfo = [
  {
    title: "Database Framework",
    value: "Drizzle ORM + PgPool",
  },
  {
    title: "Primary Instance",
    value: "Supabase/Neon Pooler",
  },
  {
    title: "Asset Cloud",
    value: "Vercel Blob Store",
  },
  {
    title: "Auth Engine",
    value: "NextAuth JWT v4",
  },
];
