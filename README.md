<div align="center">

# 🎯 CareerCraft

### Your All-in-One Career Launchpad

*Craft your career. Land the job.*

[![Version](https://img.shields.io/badge/version-1.1.2-e94560?style=flat-square)](./CHANGE-LOG.md)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-Private-1a1a2e?style=flat-square)](#)

</div>

---

## 📖 Table of Contents

- [What Is CareerCraft?](#-what-is-careercraft)
- [Mission, Vision & Goals](#-mission-vision--goals)
- [Core Value Proposition](#-core-value-proposition)
- [Features & Scope](#-features--scope)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Pages & Routes](#-pages--routes)
- [Data Models](#-data-models)
- [State Management](#-state-management)
- [Design System](#-design-system)
- [What Has Been Built](#-what-has-been-built)
- [What Is Coming Next](#-what-is-coming-next)
- [Development Milestones](#-development-milestones)
- [Current Version](#-current-version)
- [Contributing](#-contributing)
- [Changelog](#-changelog)

---

## 🚀 What Is CareerCraft?

**CareerCraft** is a comprehensive, multi-page web application built for job seekers who want to take their career preparation seriously. It is not just a resume builder — it is a fully integrated career toolkit that covers every stage of the job application journey: from crafting a professional resume to preparing confidently for interviews.

The name *CareerCraft* reflects the deliberate, hands-on nature of career building. Every section of the application is a purposefully designed tool that helps users craft the career they want — no filler, no fluff, just actionable resources built for the 2026 job market.

At its core, CareerCraft delivers:

- A **live split-screen resume builder** with real-time preview, multiple templates, and one-click PDF export
- A **curated tips library** covering resume writing and interview performance do's and don'ts
- **Step-by-step written guides** for both resume writing and interview preparation
- An **interactive interview practice tool** with model answers, STAR breakdowns, bookmarks, and progress tracking
- A **career-focused blog** with in-depth articles tailored for 2026 job seekers
- Zero sign-up friction — all progress is saved locally with no account required in MVP

---

## 🌟 Mission, Vision & Goals

### Mission
To make professional career preparation accessible to every job seeker — regardless of experience level, background, or industry — by providing a free, beautifully designed, and easy-to-use toolkit that brings resumes, guides, practice, and insight together in one place.

### Vision
To become the most trusted all-in-one career launchpad for job seekers in 2026 and beyond — a platform where users can arrive underprepared and leave with a polished resume, a confident interview strategy, and the knowledge to navigate the modern job market.

### Goals

| Goal | Success Metric |
|---|---|
| Users can generate a complete, professional resume | Resume completion rate ≥ 60% |
| Real-time preview works without noticeable lag | Preview update latency < 150ms |
| Users engage with more than one section of the app | Average session pages > 2 |
| Users return to continue building their resume | localStorage resume recovery rate |
| Blog content drives organic traffic and trust | Time-on-page > 2 minutes (Phase 2) |

---

## 💎 Core Value Proposition

| Pillar | Description |
|---|---|
| **Live Resume Preview** | See your resume update instantly as you type — no toggling between tabs |
| **All-in-One Toolkit** | Resume builder, tips, step-by-step guides, interview practice, and a blog — all under one roof |
| **Zero Sign-Up Friction** | All progress is persisted locally via `localStorage` — no account needed for MVP |
| **2026-Ready Content** | Every guide, tip, and blog article is written with the current and evolving job market in mind |
| **Premium Design** | A polished, visually refined UI that feels as professional as the resumes it helps create |

---

## ✨ Features & Scope

### 1. 🏠 Home Page (`/`)
The front door of CareerCraft. Introduces every feature of the application and drives users into the tools.

**Sections include:**
- **Hero** — Headline CTA with links to the Resume Generator and Resume Guide
- **What Is CareerCraft?** — Application scope overview
- **How It Works** — 3-step visual explainer (Fill → Preview → Download)
- **Page Directory** — One card per page of the app, explaining what each offers
- **Resume Templates Preview** — Visual thumbnails of Classic, Modern, and Minimal templates
- **Tips Snapshot** — Quick-hit tips preview with a link to the full Tips page
- **Blog Highlights** — 3 featured article cards
- **Interview Practice CTA** — Dedicated call-to-action section
- **2026 Job Market Note** — Contextual callout on why preparation matters now

---

### 2. 📝 Resume Generator (`/generator`)
The flagship feature — a split-screen interface for building a professional resume live.

**Form Sections (multi-step):**
1. Personal Information (name, contact, LinkedIn, portfolio, photo)
2. Professional Summary (with character counter and inline tips)
3. Work Experience (repeatable entries with bullet achievements)
4. Education (repeatable entries with GPA and honours)
5. Skills (tag-based input — Technical, Soft, Languages)
6. Projects (optional, with live URL and GitHub URL)
7. Certifications (optional, with issuing organisation and year)
8. Additional Sections (Volunteer Work, Awards, Publications, Hobbies)

**Preview Panel Features:**
- Live sync on every keystroke (debounced 150ms)
- 3 resume templates: Classic, Modern, Minimal
- 5 preset accent colour themes
- Zoom controls (fit-to-panel / 100%)
- Dynamic A4 page fold indicators
- One-click PDF export (`html2canvas-pro + jsPDF`)

**Persistence:**
- Auto-saves to `localStorage` on every change (debounced 500ms)
- "Resume restored" toast notification on returning visits
- "Clear & Start Over" with confirmation dialog

---

### 3. 💡 Tips Page (`/tips`)
Scannable, categorised do's and don'ts for resumes and interviews.

**Two tabbed sections:**
- **Resume Tips** — ATS optimisation, formatting, wording, length, common mistakes
- **Interview Tips** — Preparation, attire, body language, STAR method, follow-up

Each tip card includes: a category badge, a ✅ Do / ❌ Don't indicator, a bold headline, a 2–3 sentence explanation, and an optional real-world example.

---

### 4. 📚 Resume Guide (`/resume-guide`)
A comprehensive, step-by-step written guide on crafting a professional resume.

**Covers:** Resume formats, section-by-section breakdowns, writing a professional summary, describing work experience, ATS optimisation checklist, and a final pre-submission review checklist.

**UI features:** Sticky table of contents sidebar, reading progress bar, and inline CTAs linking back to the generator.

---

### 5. 🎤 Interview Guide (`/interview-guide`)
A full preparation guide for succeeding in any interview format in 2026.

**Covers:** Interview types (phone, video, in-person, panel, technical, AI-screened), researching companies, STAR method deep dive, dress code guidance, day-of checklists, body language, questions to ask interviewers, and post-interview follow-up.

---

### 6. 🧠 Interview Practice (`/interview-practice`)
An interactive Q&A tool for drilling real interview questions with model answers.

**Features:**
- Browse questions by category (General, Behavioural, Situational, Strengths & Weaknesses, Career Goals, Remote/Hybrid Work, Industry-specific)
- Reveal model answers at your own pace
- STAR method annotations (S / T / A / R labels) on model answers
- Bookmark questions to a personal practice list
- Progress tracking ("X of Y practised") per category, persisted in localStorage
- Random flashcard mode — one question at a time, reveal, then next
- Reset progress per category or globally

---

### 7. 📰 Blog (`/blog` and `/blog/[slug]`)
Career-focused articles written for 2026 job seekers.

**Blog listing page:** 3-column card grid with category filter tabs and client-side search.

**Article page:** Long-form layout with estimated read time, author profile, sticky table of contents, related articles, and a "Copy link" share button.

**Seed articles include:** Resume mistakes, professional summaries, STAR method, ATS in 2026, entry-level tips, remote interview prep, salary negotiation, and more.

---

## 🛠 Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | SSR/SSG for content pages; CSR for the generator and practice tool |
| **Language** | TypeScript 5 (strict mode) | End-to-end type safety |
| **Styling** | Tailwind CSS v4 | Utility-first; custom design tokens via `@theme` directive |
| **Conditional Classes** | `clsx` + `tailwind-merge` (`cn()`) | All dynamic `className` expressions use the shared `cn()` helper |
| **State Management** | React Context API | `ResumeContext`, `ProgressContext`, `UIContext` — all synced to localStorage |
| **Storage (MVP)** | `localStorage` | Persists resume data, user progress, and draft reads |
| **PDF Export** | `html2canvas-pro` + `jsPDF` | Client-side PDF generation from the live preview panel |
| **Icons** | Lucide React | Consistent, minimal icon set |
| **Animations** | CSS / Tailwind CSS v4 only | Custom `@keyframes` in `globals.css`; no Framer Motion |
| **Validation** | Zod | Schema validation for form data and data models |
| **Package Manager** | pnpm | Workspace-aware; fast installs |
| **Linting** | ESLint 9 + Prettier 3 | Enforced formatting and code quality |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Client)                   │
│                                                     │
│  ┌──────────────────┐  ┌──────────────────────────┐ │
│  │  React Context   │◄─│  React Component Tree    │ │
│  │  - ResumeContext │  │  (Next.js 16 App Router) │ │
│  │  - ProgressCtx   │  └──────────────────────────┘ │
│  │  - UIContext     │                               │
│  └────────┬─────────┘                               │
│           │                                         │
│  ┌────────▼─────────┐                               │
│  │  localStorage    │  (Persist resume + progress)  │
│  └──────────────────┘                               │
└─────────────────────────────────────────────────────┘
         │  (Future — Phase 2)
┌────────▼──────────────────────┐
│   Express REST API            │
│   - User auth (JWT)           │
│   - Cloud resume storage      │
│   - Blog CMS endpoints        │
└───────────────────────────────┘
```

All state lives in React Context with no third-party state library. Contexts are composed under a single `<AppProvider>` in `app/layout.tsx`, each independently hydrating from and syncing to `localStorage` with debounced writes.

---

## 📁 Project Structure

```
career_craft/
├── src/
│   ├── app/                              # Next.js 16 App Router
│   │   ├── layout.tsx                    # Root layout (Navbar, Footer, Providers)
│   │   ├── page.tsx                      # Home page
│   │   ├── globals.css                   # Global styles & @theme tokens
│   │   ├── icon.tsx                      # App icon generation
│   │   ├── generator/
│   │   │   └── page.tsx                  # Resume Generator (CSR)
│   │   ├── tips/
│   │   │   └── page.tsx                  # Tips — Resume & Interview tabs
│   │   ├── resume-guide/
│   │   │   └── page.tsx                  # Resume Writing Guide
│   │   ├── interview-guide/
│   │   │   └── page.tsx                  # Interview Preparation Guide
│   │   ├── interview-practice/
│   │   │   └── page.tsx                  # Practice Q&A (CSR)
│   │   ├── blog/
│   │   │   ├── page.tsx                  # Blog listing page
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # Blog article page
│   │   └── api/                          # API routes (placeholder for Phase 2)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                # Sticky nav with active page highlighting
│   │   │   └── Footer.tsx                # Site footer
│   │   ├── generator/
│   │   │   ├── ResumeForm/               # Multi-step form sections
│   │   │   │   ├── PersonalInfoSection.tsx
│   │   │   │   ├── ExperienceSection.tsx
│   │   │   │   ├── EducationSection.tsx
│   │   │   │   ├── SkillsSection.tsx
│   │   │   │   ├── ProjectsSection.tsx
│   │   │   │   ├── CertificationsSection.tsx
│   │   │   │   └── SummarySection.tsx
│   │   │   └── ResumePreview/            # Live preview components
│   │   │       ├── PreviewContainer.tsx
│   │   │       └── templates/
│   │   │           ├── ClassicTemplate.tsx
│   │   │           ├── ModernTemplate.tsx
│   │   │           └── MinimalTemplate.tsx
│   │   ├── blog/
│   │   │   ├── BlogCard.tsx
│   │   │   └── BlogContent.tsx
│   │   └── shared/
│   │       ├── FeedbackModal.tsx         # User feedback modal
│   │       ├── FeedbackWidget.tsx        # Floating feedback trigger
│   │       ├── Svgs.tsx                  # Centralised SVG definitions
│   │       └── ToastNotification.tsx     # Auto-dismissing toast alerts
│   │
│   ├── context/
│   │   ├── ResumeContext.tsx             # Resume form data + actions
│   │   ├── ProgressContext.tsx           # User activity progress
│   │   ├── UIContext.tsx                 # Active tab, step, toast queue
│   │   └── index.tsx                    # Combined AppProvider barrel export
│   │
│   ├── data/
│   │   ├── tips.ts                       # Static tips data
│   │   ├── resumeGuide.ts                # Guide content sections
│   │   ├── interviewGuide.ts             # Interview guide content
│   │   ├── practiceQuestions.ts          # Q&A data with STAR annotations
│   │   └── blog/                         # JSON blog article data
│   │
│   ├── types/
│   │   └── resume.ts                     # TypeScript interfaces
│   │
│   └── lib/
│       ├── utils.ts                      # cn() helper (clsx + tailwind-merge)
│       ├── pdfExport.ts                  # PDF generation & page block engine
│       └── localStorage.ts               # Storage read/write utilities
│
├── public/
│   └── assets/                           # Static assets
│
├── PRD.md                                # Product Requirements Document
├── CHANGE-LOG.md                         # Version history
├── README.md                             # This file
├── package.json
├── next.config.ts
├── tsconfig.json
└── .prettierrc
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** `>= 20.x`
- **pnpm** `>= 9.x` — Install with `npm install -g pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/Fearless09/CareerCraft.git
cd career_craft

# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the project root (see `.env.local` for reference — do not commit real secrets):

```env
# Phase 2 — not required for MVP local development
NEXT_PUBLIC_API_URL=
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `pnpm run dev` | Start the Next.js development server with hot reload |
| `pnpm run build` | Build the production bundle |
| `pnpm run start` | Start the production server (requires `build` first) |
| `pnpm run lint` | Run ESLint across the project |

---

## 🗺 Pages & Routes

| Route | Page | Rendering |
|---|---|---|
| `/` | Home | SSG |
| `/generator` | Resume Generator | CSR (`'use client'`) |
| `/tips` | Tips (Resume & Interview) | SSG |
| `/resume-guide` | Resume Writing Guide | SSG |
| `/interview-guide` | Interview Preparation Guide | SSG |
| `/interview-practice` | Interview Practice Tool | CSR (`'use client'`) |
| `/blog` | Blog Listing | SSG + ISR |
| `/blog/[slug]` | Blog Article | SSG + ISR |
| `*` | 404 Not Found | Static |

---

## 🗃 Data Models

### ResumeData

```typescript
interface ResumeData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    website?: string;
    photoUrl?: string;
  };
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  projects?: ProjectEntry[];
  certifications?: CertificationEntry[];
  additionalSections?: AdditionalSection[];
  meta: {
    templateId: 'classic' | 'modern' | 'minimal';
    accentColor: string;
    lastUpdated: string; // ISO date string
  };
}
```

### UserProgress

```typescript
interface UserProgress {
  resumeCompletedSections: string[];   // Section IDs completed in the generator
  practiceQuestionsAnswered: string[]; // Question IDs practised
  bookmarkedQuestions: string[];       // Bookmarked question IDs
  blogArticlesRead: string[];          // Article slugs read
  lastVisited: string;                 // ISO date string
}
```

---

## 🔄 State Management

State is managed exclusively with React Context API — no third-party state library.

```
app/layout.tsx
  └── <AppProvider>          ← combines all contexts
        ├── <ResumeProvider>   ← resume form data + actions
        ├── <ProgressProvider> ← user activity tracking
        └── <UIProvider>       ← active step, active tab, toast queue
```

### localStorage Keys

| Key | Type | Description |
|---|---|---|
| `cc_resume_data` | `ResumeData` (JSON) | Full resume draft |
| `cc_user_progress` | `UserProgress` (JSON) | Practice & reading progress |
| `cc_last_step` | `number` | Last active form step in the generator |

> **Graceful degradation:** If `localStorage` is unavailable (e.g. private browsing), the app falls back to in-memory state and displays a non-intrusive info banner.

---

## 🎨 Design System

### Design Language

| Attribute | Value |
|---|---|
| **Theme** | Light (dark mode planned for Phase 2) |
| **Display Font** | *Playfair Display* |
| **Body Font** | *DM Sans* |
| **Primary Colour** | `#1A1A2E` (deep navy) |
| **Accent Colour** | `#E94560` (vibrant red-coral) |
| **Surface Colour** | `#F9F9FB` (off-white) |
| **Border Radius** | `8px` base; `16px` for cards |
| **Shadows** | Subtle, layered: `0 2px 8px rgba(0,0,0,0.08)` |

### Tailwind CSS v4 `@theme` Tokens

```css
@theme {
  --color-primary: #1a1a2e;
  --color-accent:  #e94560;
  --color-surface: #f9f9fb;
  --color-muted:   #6b7280;
  --font-display:  'Playfair Display', serif;
  --font-body:     'DM Sans', sans-serif;
  --radius-card:   16px;
  --radius-base:   8px;
}
```

### `cn()` Utility

All conditional or dynamic `className` values use the shared `cn()` helper from `lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Animations

All animations use **CSS only** — Tailwind transition utilities and custom `@keyframes` in `globals.css`. No Framer Motion or JS animation libraries are used.

---

## ✅ What Has Been Built

The following has been delivered as of **v1.1.2**:

| Area | Status | Notes |
|---|---|---|
| Project scaffolding (Next.js 16, TypeScript, Tailwind v4) | ✅ Complete | |
| Design system (`@theme` tokens, `cn()`, global CSS) | ✅ Complete | |
| Navbar & Footer layout components | ✅ Complete | Sticky, semi-transparent, accessible |
| Home Page — all sections including Page Directory | ✅ Complete | Full visual overhaul applied |
| Resume Generator — all 8 form sections | ✅ Complete | Multi-step with validation |
| Resume Preview — live sync, 3 templates, colour picker | ✅ Complete | Debounced 150ms |
| PDF Export — `html2canvas-pro` + `jsPDF` | ✅ Complete | With padding-aware page-block engine |
| Dynamic A4 page fold indicators with ResizeObserver | ✅ Complete | 1mm subpixel tolerance fix applied |
| localStorage persistence (resume + progress) | ✅ Complete | Debounced writes, graceful degradation |
| Tips Page — Resume & Interview tabs | ✅ Complete | |
| Resume Writing Guide | ✅ Complete | Sticky TOC, reading progress bar |
| Interview Preparation Guide | ✅ Complete | |
| Interview Practice Tool — Q&A, STAR, bookmarks, progress | ✅ Complete | |
| Blog — listing page, article page, seed articles | ✅ Complete | Premium redesigned layout |
| FeedbackModal & FeedbackWidget | ✅ Complete | Floating persistent widget |
| Custom icon generation | ✅ Complete | |
| Code style alignment (linting + formatting) | ✅ Complete | ESLint 9 + Prettier 3 |

---

## 🔮 What Is Coming Next

### Phase 2 — Backend & Accounts

| Feature | Description |
|---|---|
| **User Authentication** | Email + OAuth sign-in via an Express REST API with JWT |
| **Cloud Resume Storage** | Save and manage multiple resumes per account (PostgreSQL + Prisma) |
| **Admin Blog CMS** | Create and manage blog articles via an admin panel with markdown support |
| **Email Newsletter Signup** | Subscribe to a CareerCraft newsletter |
| **Dark Mode** | Full Tailwind `dark:` variant support; user preference persisted |

### Phase 3 — AI & Power Features

| Feature | Description |
|---|---|
| **AI Summary & Bullet Suggestions** | LLM-powered professional summary and bullet-point generation |
| **Cover Letter Generator** | Generate a tailored cover letter using resume data as context |
| **ATS Score Checker** | Keyword match scoring against a pasted job description |
| **Resume Public Sharing** | Share your resume via a unique public link |

### Phase 4 — Mobile

| Feature | Description |
|---|---|
| **React Native App** | Full mobile application sharing types and API with the web app |

---

## 📅 Development Milestones

| Milestone | Deliverables | Target |
|---|---|---|
| **M1 – Foundation** | Repo, Next.js 16, Tailwind v4, `cn()`, layout, routing | Jan 2026 |
| **M2 – Resume Generator** | All form sections, live preview, templates, localStorage, PDF export | Feb–Mar 2026 |
| **M3 – Resource Pages** | Tips, Resume Guide, Interview Guide | Mar–Apr 2026 |
| **M4 – Interview Practice** | Q&A browser, STAR, bookmarks, random mode, progress tracking | Apr 2026 |
| **M5 – Blog** | Listing page, article page, 8 seed articles | May 2026 |
| **M6 – Home Page** | Full home page with all sections and Page Directory cards | May 2026 |
| **M7 – Polish & QA** | Responsive fixes, a11y audit, animation review, cross-browser testing | Jun 2026 |
| **M8 – Launch** | Vercel deployment, domain, final review, public announcement | Jun 2026 |

---

## 📌 Current Version

```
CareerCraft v1.1.2
Released: May 2026
```

**What's new in v1.1.2:**
- FeedbackModal and FeedbackWidget components added for in-app user feedback
- Centralised SVG definitions via `Svgs.tsx`
- Continued Navbar accessibility and styling refinements

See the full [CHANGE-LOG.md](./CHANGE-LOG.md) for a complete version history.

---

## 🤝 Contributing

This is a private project. Contributions are by invitation only. If you have been given access:

1. Create a feature branch from `main`: `git checkout -b feature/your-feature-name`
2. Follow the existing code style (run `pnpm run lint` before committing)
3. Use the `cn()` helper for all conditional `className` expressions
4. Write descriptive commit messages
5. Open a pull request with a clear description of your changes

---

## 📋 Changelog

See [CHANGE-LOG.md](./CHANGE-LOG.md) for the full version history.

---

<div align="center">

**Built with ❤️ for job seekers everywhere.**

*CareerCraft — © 2026. All rights reserved.*

</div>
