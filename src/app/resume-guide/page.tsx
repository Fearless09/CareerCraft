'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { resumeGuideSections } from '../../data/resumeGuide';
import { BookOpen, Check, ArrowRight, CornerDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ResumeGuidePage() {
  const [activeSection, setActiveSection] = useState<string>('res-g-1');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor scroll progress & active sections
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // Check which section is currently centered on screen
      const sections = resumeGuideSections.map((s) => document.getElementById(s.id));
      const scrollPos = window.scrollY + 200;

      for (let i = 0; i < sections.length; i++) {
        const el = sections[i];
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollPos >= top && scrollPos <= bottom) {
            setActiveSection(resumeGuideSections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full relative">
      
      {/* Scroll Progress Indicator Bar */}
      <div 
        className="fixed top-[60px] md:top-[76px] left-0 h-1 bg-accent z-40 transition-all duration-100 ease-out no-print"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Table of Contents Sticky Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-[120px] h-fit max-h-[calc(100vh-200px)] overflow-y-auto pr-6 no-print">
          <div className="flex items-center gap-2 mb-6 text-primary">
            <BookOpen className="w-5 h-5" />
            <h2 className="font-display font-extrabold text-lg">Resume Blueprint</h2>
          </div>
          <nav className="flex flex-col gap-1 border-l border-zinc-200">
            {resumeGuideSections.map((sect) => (
              <button
                key={sect.id}
                onClick={() => scrollToSection(sect.id)}
                className={cn(
                  'text-left pl-4 py-2 text-sm font-semibold border-l -ml-[1px] transition-all duration-200',
                  activeSection === sect.id
                    ? 'border-primary text-primary font-bold bg-zinc-100/55'
                    : 'border-transparent text-zinc-400 hover:text-zinc-650 hover:border-zinc-300'
                )}
              >
                {sect.title}
              </button>
            ))}
          </nav>

          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary to-indigo-950 text-white shadow-sm flex flex-col gap-4">
            <h3 className="font-display font-bold text-base leading-tight">Ready to craft your resume?</h3>
            <p className="text-zinc-450 text-xs leading-relaxed">
              Open the builder side-by-side with your copy and build in real time.
            </p>
            <Link
              href="/generator"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition-colors"
            >
              Start Builder
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

        {/* Long-form Reading Content Container */}
        <main className="lg:col-span-8 flex flex-col gap-14">
          
          <div className="border-b border-zinc-150 pb-8">
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 w-fit block mb-4">
              Comprehensive Reading Module
            </span>
            <h1 className="font-display text-4xl font-extrabold text-primary mb-4 leading-tight">
              Resume Writing Blueprint
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">
              Understand the core mechanics of crafting an interview-winning, ATS-proof resume. This guide outlines standard strategies, bullet wording, and verification parameters.
            </p>
          </div>

          <div className="flex flex-col gap-16">
            {resumeGuideSections.map((sect) => (
              <section
                key={sect.id}
                id={sect.id}
                className="scroll-mt-36 p-6 sm:p-8 rounded-2xl bg-white border border-zinc-150 shadow-sm animate-fade-in-up"
              >
                {sect.subtitle && (
                  <span className="text-xs font-bold text-accent uppercase tracking-wide block mb-2">
                    {sect.subtitle}
                  </span>
                )}
                
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  {sect.title}
                </h2>
                
                <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-body">
                  {sect.content}
                </p>

                {sect.bullets && sect.bullets.length > 0 && (
                  <ul className="flex flex-col gap-3 border-t border-zinc-100 pt-6">
                    {sect.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex gap-3 text-xs text-zinc-550 leading-relaxed items-start">
                        <span className="bg-emerald-50 border border-emerald-150 text-emerald-600 p-0.5 rounded mt-0.5 shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {sect.ctaText && sect.ctaLink && (
                  <div className="mt-8 border-t border-zinc-100 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <CornerDownRight className="w-4 h-4 text-accent shrink-0" />
                      Take action on this blueprint
                    </span>
                    <Link
                      href={sect.ctaLink}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-medium hover:bg-slate-900 shadow-sm transition-colors"
                    >
                      {sect.ctaText}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </section>
            ))}
          </div>

        </main>
      </div>

    </div>
  );
}
