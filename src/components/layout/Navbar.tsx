"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Menu,
  X,
  FileText,
  HelpCircle,
  CheckSquare,
  BookOpen,
  MessageSquare,
  Sparkles,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "../../lib/utils";
import Image from "next/image";
import { GoogleSvg } from "../shared/Svgs";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const mobileRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (!isProfileOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isProfileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "auto";
      return;
    }

    document.body.style.overflow = "hidden";
    const handleClick = (e: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <nav
      className={cn(
        "transition-300 text-primary fixed inset-x-0 top-0 z-50 bg-white py-5 backdrop-blur-md",
        {
          "py-3 shadow-lg": scrolled,
        },
      )}
    >
      <section className="wrapper flex items-center justify-between gap-2 px-5">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="bg-primary group-hover:bg-accent transition-300 rounded-lg p-2 text-white">
            <Sparkles className="size-5" />
          </span>
          <span className="text-primary font-display text-xl font-bold tracking-tight">
            Career<span className="text-accent font-sans">Craft</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden items-center gap-2 lg:flex xl:gap-2.5">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "transition-300 text-zinc-650 flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium hover:bg-zinc-200 xl:px-4",
                {
                  "bg-primary hover:bg-primary/90 text-white shadow-md":
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href)),
                },
              )}
            >
              <item.icon className="hidden size-4 xl:inline" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions (Auth) */}
        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <span className="border-primary block size-6 animate-spin rounded-full border-3 border-t-zinc-200" />
          ) : session ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="transition-300 border-primary/10 hover:border-accent flex cursor-pointer items-center justify-center rounded-full border-2 focus:outline-none active:scale-95"
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User profile"}
                    width={32}
                    height={32}
                    className="size-8 rounded-full object-cover object-center"
                  />
                ) : (
                  <span className="bg-primary flex size-8 items-center justify-center rounded-full text-sm font-semibold text-white">
                    {session.user?.name ? (
                      session.user.name[0].toUpperCase()
                    ) : (
                      <User className="size-4" />
                    )}
                  </span>
                )}
              </button>

              <main
                className={cn(
                  "transition-300 absolute right-0 z-50 mt-2.5 w-60 origin-top-right rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl backdrop-blur-md",
                  { "pointer-events-none scale-0": !isProfileOpen },
                )}
              >
                <div className="mb-1.5 border-b border-zinc-100 px-3 pt-2 pb-3">
                  <p className="truncate text-sm font-semibold text-zinc-900">
                    {session.user?.name || "CareerCraft User"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {session.user?.email}
                  </p>
                </div>

                <Link
                  href="/generator"
                  onClick={() => setIsProfileOpen(false)}
                  className="transition-300 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                >
                  <FileText className="size-4 text-zinc-400" />
                  My Resumes
                </Link>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    signOut();
                  }}
                  className="transition-300 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-700 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </button>
              </main>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="transition-300 hover:text-primary flex cursor-pointer items-center gap-2 rounded-full border border-zinc-100 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:border-zinc-200 hover:bg-zinc-300 active:scale-95"
            >
              <GoogleSvg className="size-4" />
              Sign In
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-primary hover:text-accent transition-300 cursor-pointer p-1 focus:outline-none lg:hidden [&_svg]:size-6"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </section>

      {/* Mobile Nav Drawer */}
      <section
        ref={mobileRef}
        className={cn(
          "transition-300 fixed inset-x-0 top-15 z-40 flex origin-top flex-col gap-3 border-b border-zinc-200 bg-white px-6 py-6 shadow-lg lg:hidden",
          { "pointer-events-none scale-y-0": !isOpen },
        )}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "transition-300 hover:text-primary flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-base font-medium text-zinc-600 hover:bg-zinc-100",
                {
                  "bg-primary hover:bg-primary text-white hover:text-white":
                    isActive,
                },
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </section>
    </nav>
  );
}

const navItems = [
  { name: "Resume Builder", href: "/generator", icon: FileText },
  { name: "Tips Hub", href: "/tips", icon: Sparkles },
  { name: "Resume Guide", href: "/resume-guide", icon: BookOpen },
  { name: "Interview Guide", href: "/interview-guide", icon: HelpCircle },
  { name: "Q&A Practice", href: "/interview-practice", icon: CheckSquare },
  { name: "Blog", href: "/blog", icon: MessageSquare },
];
