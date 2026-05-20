"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  FileText,
  HelpCircle,
  CheckSquare,
  BookOpen,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { cn } from "../../lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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

  const navItems = [
    { name: "Resume Builder", href: "/generator", icon: FileText },
    { name: "Tips Hub", href: "/tips", icon: Sparkles },
    { name: "Resume Guide", href: "/resume-guide", icon: BookOpen },
    { name: "Interview Guide", href: "/interview-guide", icon: HelpCircle },
    { name: "Q&A Practice", href: "/interview-practice", icon: CheckSquare },
    { name: "Blog", href: "/blog", icon: MessageSquare },
  ];

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 bg-transparent py-5 transition-all duration-300",
        {
          "bg-white/80 py-3 shadow-lg backdrop-blur-md": scrolled,
        },
      )}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="bg-primary group-hover:bg-accent rounded-lg p-2 text-white transition-colors duration-250">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="font-display text-primary text-xl font-bold tracking-tight">
              Career<span className="text-accent font-sans">Craft</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-zinc-650 hover:text-primary hover:bg-zinc-100",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary hover:text-accent p-1 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div
        className={cn(
          "border-zinc-150 fixed inset-x-0 top-[60px] z-40 origin-top border-b bg-white px-6 py-6 shadow-lg transition-all duration-300 lg:hidden",
          isOpen
            ? "scale-y-100 opacity-100"
            : "pointer-events-none scale-y-0 opacity-0",
        )}
      >
        <div className="flex flex-col gap-3">
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
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-white"
                    : "text-zinc-650 hover:text-primary hover:bg-zinc-55 bg-zinc-50",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
