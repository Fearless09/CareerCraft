import Link from "next/link";
import { Sparkles, Mail, Compass } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary border-t border-zinc-800 text-zinc-300">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          {/* Brand Info */}
          <div className="flex flex-col gap-4 md:col-span-2">
            <Link href="/" className="group flex w-fit items-center gap-2">
              <span className="bg-accent rounded-lg p-2 text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Career<span className="text-accent font-sans">Craft</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
              Your all-in-one career launchpad. Craft professional resumes,
              learn high-impact strategies, and land your dream job with our
              interactive tools designed for the 2026 job market.
            </p>
            <div className="mt-2 flex gap-4">
              {/* <a href="#" className="hover:text-accent transition-colors" aria-label="Github link"><Github className="w-5 h-5" /></a> */}
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Mail contact"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Compass website"
              >
                <Compass className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
              Tools
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
              <li>
                <Link
                  href="/generator"
                  className="transition-colors hover:text-white"
                >
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link
                  href="/interview-practice"
                  className="transition-colors hover:text-white"
                >
                  STAR Interview Q&A
                </Link>
              </li>
              <li>
                <Link
                  href="/tips"
                  className="transition-colors hover:text-white"
                >
                  Curated Cheat Sheets
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
              Resources
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
              <li>
                <Link
                  href="/resume-guide"
                  className="transition-colors hover:text-white"
                >
                  Resume Writing Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/interview-guide"
                  className="transition-colors hover:text-white"
                >
                  Interview Prep Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="transition-colors hover:text-white"
                >
                  Career Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 text-xs text-zinc-500 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} CareerCraft. All rights reserved.
            Deliberately crafted for 2026.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-zinc-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
