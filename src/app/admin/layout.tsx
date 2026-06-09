"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  HelpCircle,
  MessageSquare,
  CheckSquare,
  Users,
  LogOut,
  Menu,
  X,
  User,
  ExternalLink,
  MoveLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = "auto";
      return;
    }

    document.body.style.overflow = "hidden";
    const handleClick = (e: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [mobileMenuOpen]);

  return (
    <section
      id="admin-layout"
      className="wrapper relative flex-1 gap-12 lg:grid lg:grid-cols-[260px_1fr]"
    >
      {/* Desktop Sidebar */}
      <aside
        className="sticky top-16 hidden h-full max-h-[calc(100dvh-75px)] flex-col overflow-y-auto border-r border-zinc-100 lg:flex"
        aria-label="Desktop admin menu"
        role="navigation"
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between pr-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="bg-accent rounded-lg p-1.5 text-white">
              <Sparkles className="size-4" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-zinc-900">
              Career<span className="text-accent font-sans">Craft</span>{" "}
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 uppercase">
                Admin
              </span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 border-y border-zinc-100 py-6 pr-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group transition-300 flex items-center gap-3 rounded-r-lg px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
                  {
                    "border-accent border-l-2 bg-zinc-100 pl-2.5 font-semibold text-zinc-950":
                      isActive,
                  },
                )}
              >
                <item.icon
                  className={cn(
                    "transition-300 size-4 text-zinc-400 group-hover:text-zinc-700",
                    { "text-accent group-hover:text-accent/90": isActive },
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions & profile */}
        <div className="space-y-2 p-4 pl-0">
          <Link
            href="/"
            className="transition-300 flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <span className="flex items-center gap-2">
              <MoveLeft className="size-3.5" />
              Main Website
            </span>
            <ExternalLink className="size-3 text-zinc-400" />
          </Link>

          {session && (
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3 shadow-xs">
              <div className="flex items-center gap-2.5 truncate">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Admin"}
                    width={32}
                    height={32}
                    className="size-8 rounded-full border border-zinc-200"
                  />
                ) : (
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-700 uppercase">
                    {session.user?.name ? (
                      session.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    ) : (
                      <User className="size-3.5" />
                    )}
                  </span>
                )}
                <div className="truncate">
                  <span className="block truncate text-xs font-bold text-zinc-800">
                    {session.user?.name}
                  </span>
                  <span className="block truncate text-[10px] text-zinc-500">
                    {session.user?.email}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="text-zinc-450 cursor-pointer rounded-lg p-1.5 transition-all hover:bg-zinc-200 hover:text-red-600 active:scale-95"
                title="Sign Out"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={cn(
          "bg-accent transition-300 sticky top-17 z-10 mt-3 flex w-fit cursor-pointer items-center gap-0.5 rounded-lg px-2 py-1.5 text-xs font-medium text-white uppercase shadow-lg lg:hidden [&_svg]:size-4",
          { "translate-x-[300px]": mobileMenuOpen },
        )}
      >
        {mobileMenuOpen ? <X /> : <Menu />}
        Admin Panel
      </button>

      {/* Mobile Menu Drawer */}
      <section
        className={cn(
          "transition-300 fixed top-15 left-0 z-50 flex h-full max-h-[calc(100dvh-60px)] w-[300px] origin-left flex-col gap-2 overflow-y-auto border-r border-zinc-100 bg-white px-5 py-6 lg:hidden",
          {
            "pointer-events-none scale-x-0": !mobileMenuOpen,
          },
        )}
        aria-modal={true}
        role="navigation"
        aria-label="Mobile admin menu"
        ref={mobileRef}
      >
        <nav className="flex flex-1 flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "transition-300 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
                  {
                    "bg-zinc-100 font-semibold text-zinc-900": isActive,
                  },
                )}
              >
                <item.icon
                  className={cn("size-4 text-zinc-400", {
                    "text-accent": isActive,
                  })}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <hr className="my-3 border-zinc-200" />
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="transition-300 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
        >
          <MoveLeft className="size-4" />
          Main Website
        </Link>
        <button
          onClick={handleSignOut}
          className="transition-300 flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-zinc-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="size-4 text-red-600" />
          Sign Out
        </button>
      </section>

      {/* Main Content Area */}
      <main className="py-10" role="main">
        {children}
      </main>
    </section>
  );
}

const menuItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Manage Tips", href: "/admin/tips", icon: Sparkles },
  { name: "Resume Guide", href: "/admin/resume-guide", icon: BookOpen },
  {
    name: "Interview Guide",
    href: "/admin/interview-guide",
    icon: HelpCircle,
  },
  { name: "Manage Blogs", href: "/admin/blogs", icon: MessageSquare },
  { name: "Q&A Practice", href: "/admin/practice", icon: CheckSquare },
  { name: "Manage Admins", href: "/admin/admins", icon: Users },
];
