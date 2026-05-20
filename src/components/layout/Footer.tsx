import Link from "next/link";
import { Sparkles, Mail } from "lucide-react";
import { GitHubSvg, XSvg } from "../shared/Svgs";

export default function Footer() {
  return (
    <footer className="bg-primary border-t border-white/3 text-zinc-300">
      <section className="wrapper pt-12 pb-5">
        <main className="flex flex-wrap justify-between gap-10 gap-x-5 md:gap-8">
          {/* Brand Info */}
          <div className="flex w-full max-w-sm flex-col gap-4">
            <Link href="/" className="group flex w-fit items-center gap-2">
              <span className="bg-accent rounded-lg p-2 text-white">
                <Sparkles className="size-5" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Career<span className="text-accent font-sans">Craft</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-zinc-400">
              Your all-in-one career launchpad. Craft professional resumes,
              learn high-impact strategies, and land your dream job with our
              interactive tools designed for the 2026 job market.
            </p>

            <div className="mt-2 flex gap-4">
              {socialLinks.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="hover:text-accent transition-300"
                  aria-label={s.label + " contact"}
                  target={s.href.startsWith("http") ? "_blank" : "_self"}
                >
                  <s.icon className="size-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map(({ links, title }) => (
            <div key={title} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
                {title}
              </h3>
              <ul className="flex flex-col gap-2.5 text-sm text-zinc-300">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="transition-300 hover:text-white"
                      target={href.startsWith("http") ? "_blank" : "_self"}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </main>

        <main className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-4 text-xs text-zinc-400 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} CareerCraft. All rights reserved.
            Deliberately crafted for 2026.
          </p>

          <div className="flex gap-6">
            {[
              { label: "Privacy Policy", href: "#privacy" },
              { label: "Terms of Service", href: "#tos" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-300 hover:text-zinc-200"
                target={href.startsWith("http") ? "_blank" : "_self"}
              >
                {label}
              </Link>
            ))}
          </div>
        </main>
      </section>
    </footer>
  );
}

const socialLinks = [
  { icon: Mail, label: "Mail", href: "#mail" },
  { icon: XSvg, label: "X.com", href: "#x.com" },
  { icon: GitHubSvg, label: "GitHub", href: "#github" },
];

const footerLinks = [
  {
    title: "Tools",
    links: [
      { label: "Resume Builder", href: "/generator" },
      { label: "STAR Interview Q&A", href: "/interview-practice" },
      { label: "Curated Cheat Sheets", href: "/tips" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Resume Writing Guide", href: "/resume-guide" },
      { label: "Interview Prep Guide", href: "/interview-guide" },
      { label: "Career Blog", href: "/blog" },
    ],
  },
  {
    title: "Contact Us",
    links: socialLinks.map(({ href, label }) => ({ label, href })),
  },
];
