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
        <div className="hidden items-center gap-2.5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "transition-300 text-zinc-650 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium hover:bg-zinc-200",
                {
                  "bg-primary hover:bg-primary/90 text-white shadow-md":
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href)),
                },
              )}
            >
              <item.icon className="size-4" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-primary hover:text-accent p-1 focus:outline-none [&_svg]:size-6"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </section>

      {/* Mobile Nav Drawer */}
      <div
        className={cn(
          "border-zinc-150 fixed inset-x-0 top-15 z-40 origin-top border-b bg-white px-6 py-6 shadow-lg transition-all duration-300 lg:hidden",
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

const navItems = [
  { name: "Resume Builder", href: "/generator", icon: FileText },
  { name: "Tips Hub", href: "/tips", icon: Sparkles },
  { name: "Resume Guide", href: "/resume-guide", icon: BookOpen },
  { name: "Interview Guide", href: "/interview-guide", icon: HelpCircle },
  { name: "Q&A Practice", href: "/interview-practice", icon: CheckSquare },
  { name: "Blog", href: "/blog", icon: MessageSquare },
];
