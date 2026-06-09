<div align="center">

# 🎯 CareerCraft

### Your All-in-One Career Launchpad

_Craft your career. Land the job._

[![Version](https://img.shields.io/badge/version-1.3.0-e94560?style=flat-square)](./CHANGE-LOG.md)
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

The name _CareerCraft_ reflects the deliberate, hands-on nature of career building. Every section of the application is a purposefully designed tool that helps users craft the career they want — no filler, no fluff, just actionable resources built for the job market.

At its core, CareerCraft delivers:

- A **live split-screen resume builder** with real-time preview, multiple templates, and one-click PDF export
- A **curated tips library** covering resume writing and interview performance do's and don'ts
- **Step-by-step written guides** for both resume writing and interview preparation
- An **interactive interview practice tool** with model answers, STAR breakdowns, bookmarks, and progress tracking
- A **career-focused blog** with in-depth articles, markdown parsing, and cover image support
- **Zero sign-up friction** — progress is saved locally by default, with automatic cloud synchronization to a PostgreSQL database once logged in via Google OAuth
- An **integrated Admin CMS Portal** allowing authorized administrators to manage guides, daily tips, practice questions, blog articles (with image uploads), and administrator role permissions
- A **GitHub-integrated feedback system** to submit structured issues and bug reports from any view directly to the development repository

---

## 🌟 Mission, Vision & Goals

### Mission

To make professional career preparation accessible to every job seeker — regardless of experience level, background, or industry — by providing a free, beautifully designed, and easy-to-use toolkit that brings resumes, guides, practice, and insight together in one place.

### Vision

To become the most trusted all-in-one career launchpad for job seekers in 2026 and beyond — a platform where users can arrive underprepared and leave with a polished resume, a confident interview strategy, and the knowledge to navigate the modern job market.

### Goals

| Goal                                               | Success Metric                     |
| -------------------------------------------------- | ---------------------------------- |
| Users can generate a complete, professional resume | Resume completion rate ≥ 60%       |
| Real-time preview works without noticeable lag     | Preview update latency < 150ms     |
| Users engage with more than one section of the app | Average session pages > 2          |
| Users return to continue building their resume     | localStorage resume recovery rate  |
| Blog content drives organic traffic and trust      | Time-on-page > 2 minutes (Phase 2) |

---

## 💎 Core Value Proposition

| Pillar                    | Description                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| **Live Resume Preview**   | See your resume update instantly as you type — no toggling between tabs                        |
| **All-in-One Toolkit**    | Resume builder, tips, step-by-step guides, interview practice, and a blog — all under one roof |
| **Zero Sign-Up Friction** | All progress is persisted locally via `localStorage` — no account needed for MVP               |
| **2026-Ready Content**    | Every guide, tip, and blog article is written with the current and evolving job market in mind |
| **Premium Design**        | A polished, visually refined UI that feels as professional as the resumes it helps create      |

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

| Layer                   | Technology                         | Notes                                                                        |
| ----------------------- | ---------------------------------- | ---------------------------------------------------------------------------- |
| **Framework**           | Next.js 16 (App Router)            | SSR/SSG for content pages; CSR/SSR for admin & generator                     |
| **Language**            | TypeScript 5 (strict mode)         | End-to-end type safety                                                       |
| **Styling**             | Tailwind CSS v4                    | Utility-first; custom design tokens via `@theme` directive                   |
| **Conditional Classes** | `clsx` + `tailwind-merge` (`cn()`) | All dynamic `className` expressions use the shared `cn()` helper             |
| **State Management**    | React Context API + SWR            | Client-side contexts hydrated and synchronized with server SWR queries       |
| **Authentication**      | NextAuth (next-auth v4)            | Google OAuth provider; custom JWT-to-session admin checks                    |
| **Database & ORM**      | Drizzle ORM + PostgreSQL           | PostgreSQL connection pool with primary & 2 read replicas using `withReplicas` adapter |
| **Storage (Local)**     | `localStorage`                     | Fallback local backup safety net; offline support for guests                 |
| **PDF Export**          | `html2canvas-pro` + `jsPDF`        | Client-side PDF generation with padding-aware page block engine               |
| **Image Hosting**       | Vercel Blob Storage                | Uploads and hosts blog cover images via `@vercel/blob` upload APIs           |
| **Icons**               | Lucide React                       | Consistent, minimal icon set                                                 |
| **Animations**          | CSS / Tailwind CSS v4 only         | Custom `@keyframes` in `globals.css`; no Framer Motion                       |
| **Validation**          | Zod                                | Schema validation for form data and API endpoints                            |
| **Package Manager**     | pnpm                               | Workspace-aware; fast installs                                               |
| **Linting**             | ESLint 9 + Prettier 3              | Enforced formatting and code quality                                         |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                         │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                 React Component Tree                    │   │
│   │               (Next.js 16 App Router)                   │   │
│   └──────────┬────────────────────────────────────▲─────────┘   │
│              │                                    │             │
│              │ (useResume/useProgress)            │ (useSWR)    │
│              ▼                                    │             │
│   ┌──────────────────┐  (Debounced local)   ┌─────┴─────────┐   │
│   │  React Context   ├─────────────────────►│ localStorage  │   │
│   │  - ResumeContext │                      │ (Local Backup)│   │
│   │  - ProgressCtx   │                      └───────────────┘   │
│   │  - UIContext     │                                          │
│   └──────────┬───────┘                                          │
└──────────────┼──────────────────────────────────────────────────┘
               │ (API calls: /api/resume, /api/progress)
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Next.js API Routes (Server)                   │
│                                                                 │
│   ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐   │
│   │  NextAuth (JWT)  │  │   Drizzle ORM    │  │ Vercel Blob │   │
│   │  - Google OAuth  │  │   - Schema logic │  │  - Images   │   │
│   └────────┬─────────┘  └────────┬─────────┘  └─────────────┘   │
└────────────┼─────────────────────┼──────────────────────────────┘
             │                     │
             ▼ (Adapter checks)    ▼ (SQL Queries)
┌─────────────────────────────────────────────────────────────────┐
│                       PostgreSQL Database                       │
│                                                                 │
│         ┌──────────────┐          ┌──────────────────────┐      │
│         │  Primary DB  ├─────────►│ Read Replicas (x2)   │      │
│         │  (Writes)    │ (Sync)   │ (Replica reads)      │      │
│         └──────────────┘          └──────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
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
│   │   ├── globals.css                   # Global styles & theme tokens
│   │   ├── loading.tsx                   # Page loading indicator
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
│   │   ├── admin/                        # Admin Portal Managers (Phase 2 CMS)
│   │   │   ├── layout.tsx                # Admin server layout wrapper
│   │   │   ├── page.tsx                  # Admin overview dashboard
│   │   │   ├── tips/
│   │   │   │   └── page.tsx              # Manage Daily Tips CRUD
│   │   │   ├── resume-guide/
│   │   │   │   └── page.tsx              # Manage Resume Guide CRUD
│   │   │   ├── interview-guide/
│   │   │   │   └── page.tsx              # Manage Interview Guide CRUD
│   │   │   ├── blogs/
│   │   │   │   └── page.tsx              # Manage Blogs CRUD with image upload
│   │   │   ├── practice/
│   │   │   │   └── page.tsx              # Manage Q&A Practice CRUD
│   │   │   └── admins/
│   │   │       └── page.tsx              # Manage Administrator Permissions
│   │   └── api/                          # Next.js API Routes (Backend Layer)
│   │       ├── auth/[...nextauth]/       # NextAuth.js OAuth configuration
│   │       ├── resume/                   # Fetch / Sync active resumes
│   │       ├── progress/                 # Fetch / Sync learning progress
│   │       ├── feedback/                 # GitHub integrated issue submission
│   │       └── admin/                    # CRUD API endpoints for resources
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                # Sticky nav with active page highlighting
│   │   │   └── Footer.tsx                # Site footer
│   │   ├── admin/
│   │   │   └── AdminLayout.tsx           # Sidebar, drawer navigation & profile
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
│   │   │   └── BlogContent.tsx
│   │   └── shared/
│   │       ├── FeedbackModal.tsx         # User feedback modal
│   │       ├── FeedbackWidget.tsx        # Floating feedback trigger
│   │       ├── Loader.tsx                # Unified wave-animated loading spinner
│   │       ├── ToastNotification.tsx     # Auto-dismissing toast alerts
│   │       ├── DeletModal.tsx            # Admin delete confirmation modal
│   │       └── AddnUpdateModalWrapper.tsx # Admin CRUD slide-over wrapper drawer
│   │
│   ├── context/
│   │   ├── ResumeContext.tsx             # Resume state sync, db fetch & local backup
│   │   ├── ProgressContext.tsx           # Practice/bookmarks progress synchronization
│   │   ├── UIContext.tsx                 # Active tab, step, toast queue
│   │   └── index.tsx                    # Combined AppProvider barrel export
│   │
│   ├── db/                               # Drizzle ORM Setup & Schema
│   │   ├── index.ts                      # PG Pool setup with replica read-splitting
│   │   ├── schema/                       # Declarative drizzle table definitions
│   │   │   ├── index.ts                  # Schemas barrel export & NextAuth tables
│   │   │   ├── admin.ts                  # Admin user roles mapping
│   │   │   ├── resume.ts                 # Resume documents jsonb store
│   │   │   ├── userProgress.ts           # Progress metadata jsonb store
│   │   │   ├── tip.ts                    # Career tips schema
│   │   │   ├── guide.ts                  # Guide chapters schema
│   │   │   ├── practiceQuestion.ts       # Interview Q&A questions schema
│   │   │   └── blog.ts                   # Blog posts schema
│   │   └── migrations/                   # SQL migrations generated by drizzle-kit
│   │
│   ├── data/
│   │   └── sampleResume.ts               # Sample resume data template
│   │
│   ├── types/
│   │   ├── resume.ts                     # TypeScript interfaces
│   │   ├── drizzle.d.ts                  # Schema inferences helper
│   │   └── nextauth.d.ts                 # NextAuth Session typings override
│   │
│   ├── hooks/
│   │   └── useCopy.tsx                   # Text clipboard copying helper
│   │
│   ├── lib/
│   │   ├── utils.ts                      # cn() helper (clsx + tailwind-merge)
│   │   ├── pdfExport.ts                  # PDF generation & page block engine
│   │   └── localStorage.ts               # Storage read/write utilities
│   │
│   └── proxy.ts                          # Next.js dev server proxy rules
│
├── public/
│   └── assets/                           # Static assets
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
- **PostgreSQL** database instance

### Installation & Database Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Fearless09/CareerCraft.git
   cd career_craft
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the project root with the following configuration:
   ```env
   # Database credentials (including primary DB & 2 read replicas)
   DATABASE_URL="postgresql://user:password@localhost:5432/careercraft"
   DATABASE_REPLICA_1="postgresql://user:password@replica1:5432/careercraft"
   DATABASE_REPLICA_2="postgresql://user:password@replica2:5432/careercraft"

   # NextAuth Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-jwt-auth-secret-key"

   # OAuth Providers (Google Client Credentials)
   AUTH_GOOGLE_ID="your-google-oauth-client-id"
   AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

   # Feedback Integration (GitHub Personal Token & Repo Details)
   GITHUB_TOKEN="your-github-personal-access-token"
   GITHUB_OWNER="Fearless09"
   GITHUB_REPO="CareerCraft"

   # Vercel Blob Image Uploads
   BLOB_READ_WRITE_TOKEN="your-vercel-blob-read-write-token"
   ```

4. **Run Database Migrations:**
   ```bash
   # Push structural schema changes directly to PostgreSQL database
   pnpm run db:push
   ```

5. **Start the development server:**
   ```bash
   pnpm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command          | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `pnpm run dev`   | Start the Next.js development server with hot reload |
| `pnpm run build` | Build the production bundle                          |
| `pnpm run start` | Start the production server (requires `build` first) |
| `pnpm run lint`  | Run ESLint across the project                        |

---

## 🗺 Pages & Routes

### Front-End Web Routes

| Route                 | Page                        | Rendering            |
| --------------------- | --------------------------- | -------------------- |
| `/`                   | Home                        | SSG                  |
| `/generator`          | Resume Generator            | CSR (`'use client'`) |
| `/tips`               | Tips (Resume & Interview)   | SSG                  |
| `/resume-guide`       | Resume Writing Guide        | SSG                  |
| `/interview-guide`    | Interview Preparation Guide | SSG                  |
| `/interview-practice` | Interview Practice Tool     | CSR (`'use client'`) |
| `/blog`               | Blog Listing                | SSG + ISR            |
| `/blog/[slug]`        | Blog Article                | SSG + ISR            |
| `/admin`              | Admin Dashboard Overview    | SSG + Session Guards |
| `/admin/tips`         | Admin Tips Manager          | CSR + Session Guards |
| `/admin/resume-guide` | Admin Resume Guide Manager  | CSR + Session Guards |
| `/admin/interview-guide`| Admin Interview Guide Manager| CSR + Session Guards |
| `/admin/blogs`        | Admin Blogs Manager         | CSR + Session Guards |
| `/admin/practice`     | Admin Q&A Practice Manager  | CSR + Session Guards |
| `/admin/admins`       | Admin Administrators Manager| CSR + Session Guards |
| `*`                   | 404 Not Found               | Static               |

### Back-End API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/auth/[...nextauth]` | GET, POST | OAuth authentication and session callbacks |
| `/api/resume` | GET, POST | Fetch database resume / update active resume data |
| `/api/progress` | GET, POST | Fetch database progress logs / update progress metadata |
| `/api/feedback` | POST | Submits feedback details as a GitHub repository issue |
| `/api/admin` | GET, POST | Fetch admin registries / promote admins by email |
| `/api/admin/check` | GET | Verify whether active session corresponds to an admin role |
| `/api/admin/blogs` | GET, POST, PUT, DELETE | CRUD operations on the database Blog table |
| `/api/admin/guides` | GET, POST, PUT, DELETE | CRUD operations on the database Guide table |
| `/api/admin/tips` | GET, POST, PUT, DELETE | CRUD operations on the database Tip table |
| `/api/admin/practice` | GET, POST, PUT, DELETE | CRUD operations on the database Practice Question table |
| `/api/admin/upload` | POST | Image upload proxy to Vercel Blob storage |

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
    templateId: "classic" | "modern" | "minimal";
    accentColor: string;
    lastUpdated: string; // ISO date string
  };
}
```

### UserProgress

```typescript
interface UserProgress {
  resumeCompletedSections: string[]; // Section IDs completed in the generator
  practiceQuestionsAnswered: string[]; // Question IDs practised
  bookmarkedQuestions: string[]; // Bookmarked question IDs
  blogArticlesRead: string[]; // Article slugs read
  lastVisited: string; // ISO date string
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

| Key                | Type                  | Description                            |
| ------------------ | --------------------- | -------------------------------------- |
| `cc_resume_data`   | `ResumeData` (JSON)   | Full resume draft                      |
| `cc_user_progress` | `UserProgress` (JSON) | Practice & reading progress            |
| `cc_last_step`     | `number`              | Last active form step in the generator |

> **Graceful degradation:** If `localStorage` is unavailable (e.g. private browsing), the app falls back to in-memory state and displays a non-intrusive info banner.

---

## 🎨 Design System

### Design Language

| Attribute          | Value                                         |
| ------------------ | --------------------------------------------- |
| **Theme**          | Light (dark mode planned for Phase 2)         |
| **Display Font**   | _Playfair Display_                            |
| **Body Font**      | _DM Sans_                                     |
| **Primary Colour** | `#1A1A2E` (deep navy)                         |
| **Accent Colour**  | `#E94560` (vibrant red-coral)                 |
| **Surface Colour** | `#F9F9FB` (off-white)                         |
| **Border Radius**  | `8px` base; `16px` for cards                  |
| **Shadows**        | Subtle, layered: `0 2px 8px rgba(0,0,0,0.08)` |

### Tailwind CSS v4 `@theme` Tokens

```css
@theme {
  --color-primary: #1a1a2e;
  --color-accent: #e94560;
  --color-surface: #f9f9fb;
  --color-muted: #6b7280;
  --font-display: "Playfair Display", serif;
  --font-body: "DM Sans", sans-serif;
  --radius-card: 16px;
  --radius-base: 8px;
}
```

### `cn()` Utility

All conditional or dynamic `className` values use the shared `cn()` helper from `lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Animations

All animations use **CSS only** — Tailwind transition utilities and custom `@keyframes` in `globals.css`. No Framer Motion or JS animation libraries are used.

---

## ✅ What Has Been Built

The following has been delivered as of **v1.3.0**:

| Area                                                      | Status      | Notes                                  |
| --------------------------------------------------------- | ----------- | -------------------------------------- |
| Project scaffolding (Next.js 16, TypeScript, Tailwind v4) | ✅ Complete |                                        |
| Design system (`@theme` tokens, `cn()`, global CSS)       | ✅ Complete |                                        |
| Navbar & Footer layout components                         | ✅ Complete | Sticky, semi-transparent, accessible   |
| Home Page — all sections including Page Directory         | ✅ Complete | Full visual overhaul applied           |
| Resume Generator — all 8 form sections                    | ✅ Complete | Multi-step with validation             |
| Resume Preview — live sync, 3 templates, colour picker    | ✅ Complete | Debounced 150ms                        |
| PDF Export — `html2canvas-pro` + `jsPDF`                  | ✅ Complete | With padding-aware page-block engine   |
| Dynamic A4 page fold indicators with ResizeObserver       | ✅ Complete | 1mm subpixel tolerance fix applied     |
| localStorage persistence (resume + progress)              | ✅ Complete | Debounced writes, graceful degradation |
| Tips Page — Resume & Interview tabs                       | ✅ Complete |                                        |
| Resume Writing Guide                                      | ✅ Complete | Sticky TOC, reading progress bar       |
| Interview Preparation Guide                               | ✅ Complete |                                        |
| Interview Practice Tool — Q&A, STAR, bookmarks, progress  | ✅ Complete |                                        |
| Blog — listing page, article page, seed articles          | ✅ Complete | Premium redesigned layout              |
| FeedbackModal & FeedbackWidget                            | ✅ Complete | Floating persistent widget             |
| Custom icon generation                                    | ✅ Complete |                                        |
| Code style alignment (linting + formatting)               | ✅ Complete | ESLint 9 + Prettier 3                  |
| Database Layer (PostgreSQL, Drizzle ORM, withReplicas)    | ✅ Complete | Primary pool & 2 read replicas setup   |
| Google OAuth authentication via NextAuth                  | ✅ Complete | secure session and role-based callbacks|
| Cloud sync for Resume & Progress contexts via SWR         | ✅ Complete | Automated local-to-cloud data migration|
| Floating widget integrated with GitHub Issues             | ✅ Complete | Submits verified bugs & suggestions    |
| Wave-animated loader component (`Loader.tsx`)             | ✅ Complete | Unified loading states across pages    |
| Comprehensive Admin Panel and CMS managers                | ✅ Complete | Blogs, Guides, Tips, Practice, Admins  |
| Admin Panel premium light-zinc design                     | ✅ Complete | Complete theme transition for managers  |

---

## 🔮 What Is Coming Next

### Phase 3 — AI & Power Features

| Feature                             | Description                                                   |
| ----------------------------------- | ------------------------------------------------------------- |
| **AI Summary & Bullet Suggestions** | LLM-powered professional summary and bullet-point generation  |
| **Cover Letter Generator**          | Generate a tailored cover letter using resume data as context |
| **Persisted Dark Mode**             | Full Tailwind `dark:` variant support; user preference cached |
| **Multiple Saved Resumes**          | Manage multiple resumes per account (name and clone copies)   |

### Phase 4 — Social & Mobile

| Feature | Description |
|---|---|
| **ATS Score Checker**               | Keyword match scoring against a pasted job description        |
| **Resume Public Sharing**           | Share your resume via a unique public link                    |
| **React Native App** | Full mobile application sharing types and API with the web app |

---

## 📅 Development Milestones

| Milestone                   | Deliverables                                                          | Target       |
| --------------------------- | --------------------------------------------------------------------- | ------------ |
| **M1 – Foundation**         | Repo, Next.js 16, Tailwind v4, `cn()`, layout, routing                | ✅ Complete  |
| **M2 – Resume Generator**   | All form sections, live preview, templates, localStorage, PDF export  | ✅ Complete  |
| **M3 – Resource Pages**     | Tips, Resume Guide, Interview Guide                                   | ✅ Complete  |
| **M4 – Interview Practice** | Q&A browser, STAR, bookmarks, random mode, progress tracking          | ✅ Complete  |
| **M5 – Blog**               | Listing page, article page, 8 seed articles                           | ✅ Complete  |
| **M6 – Home Page**          | Full home page with all sections and Page Directory cards             | ✅ Complete  |
| **M7 – Polish & QA**        | Feedback widget, wave loaders, scroll lock, metadata optimization     | ✅ Complete  |
| **M8 – Backend Integration**| Drizzle ORM, PostgreSQL database, Google OAuth, SWR sync, Admin Panel | ✅ Complete  |

---

## 📌 Current Version

```
CareerCraft v1.3.0
Released: June 2026
```

**What's new in v1.3.0:**

- Configured PostgreSQL database connection with Drizzle ORM and 2 read replicas using replica read-splitting (`withReplicas`).
- Integrated NextAuth Google OAuth login mapping accounts, sessions, and roles to the database.
- Implemented real-time resume and progress sync to PostgreSQL via client SWR hooks with manual debouncing (1s delay).
- Added a floating persistent Feedback Widget and modal integrated with the GitHub repository API to log issues automatically.
- Replaced all inline loading animations with a unified wave-animated component (`Loader`).
- Transitioned the entire administrator panel to a premium zinc-based light theme for design consistency.
- Built a comprehensive set of admin managers for tips, guides (sort order), blog posts (markdown, image uploads), Q&A practice (STAR answers), and admin permissions.

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

_CareerCraft — © 2026. All rights reserved._

</div>
