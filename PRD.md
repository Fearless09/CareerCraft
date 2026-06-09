# CareerCraft — Product Requirements Document (PRD)

**Project Name:** CareerCraft
**Version:** 1.3.0
**Last Updated:** June 2026
**Status:** Completed (Phase 2 Backend Integration & Admin Portal)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Tech Stack](#3-tech-stack)
4. [Architecture Overview](#4-architecture-overview)
5. [Project Structure](#5-project-structure)
6. [Pages & Features](#6-pages--features)
   - 6.1 [Home Page](#61-home-page)
   - 6.2 [Resume Generator Page](#62-resume-generator-page)
   - 6.3 [Tips Page](#63-tips-page)
   - 6.4 [Blog Page](#64-blog-page)
   - 6.5 [Resume Guide Page](#65-resume-guide-page)
   - 6.6 [Interview Guide Page](#66-interview-guide-page)
   - 6.7 [Interview Practice Page](#67-interview-practice-page)
7. [Data Models](#7-data-models)
8. [State & Storage Management](#8-state--storage-management)
9. [UI/UX Design Specifications](#9-uiux-design-specifications)
10. [Component Breakdown](#10-component-breakdown)
11. [Routing](#11-routing)
12. [Future Enhancements](#12-future-enhancements)
13. [Development Milestones](#13-development-milestones)

---

## 1. Project Overview

**CareerCraft** is your all-in-one career launchpad — a multi-page web application that empowers job seekers to build professional resumes with real-time preview, and grow their career confidence through curated resources: resume and interview tips, in-depth guides, interactive interview practice, and a career-focused blog.

The name *CareerCraft* reflects the deliberate, hands-on nature of career building — every section of the app is a tool that helps users craft the career they want.

### Core Value Proposition

- **Live resume preview** — See your resume update in real time as you fill the form; no toggling back and forth.
- **All-in-one career toolkit** — Resume builder, tips, step-by-step guides, interview practice, and a blog — all in one place.
- **Zero sign-up friction** — User progress is persisted locally via `localStorage` (no account required for MVP).
- **2026-ready content** — All guides, tips, and blog articles are written with the current job market landscape in mind.

---

## 2. Goals & Success Metrics

| Goal | KPI / Metric |
|---|---|
| Users can generate a complete resume | Resume completion rate ≥ 60% |
| Real-time preview works without lag | Preview update latency < 150ms |
| Users engage with resource pages | Avg. session pages > 2 |
| Users return to continue their resume | localStorage resume recovery rate |
| Blog drives organic traffic | Time-on-page > 2 min (Phase 2) |

---

## 3. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router) | SSR/SSG for content pages; CSR/SSR for admin & generator |
| Language | **TypeScript 5** | Strict mode enabled |
| Styling | **Tailwind CSS v4** | Utility-first; custom design tokens via `@theme` |
| Conditional Classes | **clsx + tailwind-merge** (`cn()` utility) | All dynamic/conditional `className` expressions use `cn()` |
| State Management | **React Context API + SWR** | Client-side contexts hydrated and synchronized with SWR queries |
| Authentication | **NextAuth** (next-auth v4) | Google OAuth provider; custom JWT-to-session admin checks |
| Database & ORM | **Drizzle ORM + PostgreSQL** | Managed via `node-postgres` PG connection pool with primary & 2 read replicas using `withReplicas` adapter |
| Storage (Local) | **localStorage** | Local backup safety net; fallback for unauthenticated sessions |
| PDF Export | **html2canvas-pro + jsPDF** | Client-side PDF generation with padding-aware page block engine |
| Image Hosting | **Vercel Blob Storage** | Used for blog cover images via `@vercel/blob` upload API |
| Icons | **Lucide React** | Consistent icon set |
| Animations | **CSS / Tailwind CSS v4 only** | Tailwind transition/animate utilities + custom `@keyframes` in global CSS; no Framer Motion or JS animation libraries |
| Validation | **Zod** | Schema validation for forms, APIs, and data models |
| Linting & Format | **ESLint 9 + Prettier 3** | Enforced code quality and style alignment |

### `cn()` Utility Setup

All conditional or dynamic `className` values must use the shared `cn()` helper, which combines `clsx` and `tailwind-merge` to handle class conflicts correctly:

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage example:**
```tsx
<button
  className={cn(
    'rounded-lg px-4 py-2 font-medium transition-colors duration-200',
    isActive && 'bg-primary text-white',
    isDisabled && 'cursor-not-allowed opacity-50',
    variant === 'outline' && 'border border-primary bg-transparent text-primary'
  )}
>
  Click me
</button>
```

---

## 4. Architecture Overview

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

---

## 5. Project Structure

```
career_craft/
├── src/
│   ├── app/                              # Next.js 16 App Router
│   │   ├── layout.tsx                    # Root layout (Navbar, Footer, Providers)
│   │   ├── page.tsx                      # Home page
│   │   ├── globals.css                   # Theme tokens, keyframes, base styles
│   │   ├── loading.tsx                   # Page loading indicator
│   │   ├── icon.tsx                      # App icon generator
│   │   ├── generator/
│   │   │   └── page.tsx                  # Resume Generator (CSR)
│   │   ├── tips/
│   │   │   └── page.tsx                  # Tips (Resume + Interview)
│   │   ├── resume-guide/
│   │   │   └── page.tsx                  # Resume Writing Guide
│   │   ├── interview-guide/
│   │   │   └── page.tsx                  # Interview Preparation Guide
│   │   ├── interview-practice/
│   │   │   └── page.tsx                  # Practice Q&A (CSR)
│   │   ├── blog/
│   │   │   ├── page.tsx                  # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # Blog article page
│   │   ├── admin/                        # Admin Portal Managers (Phase 2 CMS)
│   │   │   ├── layout.tsx                # Admin layout wrapper
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
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── admin/
│   │   │   └── AdminLayout.tsx           # Sidebar, drawer navigation & profile
│   │   ├── generator/
│   │   │   ├── ResumeForm/               # Multi-step resume details input
│   │   │   │   ├── PersonalInfoSection.tsx
│   │   │   │   ├── ExperienceSection.tsx
│   │   │   │   ├── EducationSection.tsx
│   │   │   │   ├── SkillsSection.tsx
│   │   │   │   ├── ProjectsSection.tsx
│   │   │   │   ├── CertificationsSection.tsx
│   │   │   │   ├── AdditionalSections.tsx
│   │   │   │   └── SummarySection.tsx
│   │   │   └── ResumePreview/            # Split-screen live preview canvas
│   │   │       ├── PreviewContainer.tsx  # Dynamic page fold observer
│   │   │       └── templates/
│   │   │           ├── ClassicTemplate.tsx
│   │   │           ├── ModernTemplate.tsx
│   │   │           └── MinimalTemplate.tsx
│   │   ├── blog/
│   │   │   └── BlogContent.tsx
│   │   └── shared/
│   │       ├── FeedbackModal.tsx         # Scroll-locked submission modal
│   │       ├── FeedbackWidget.tsx        # Floating trigger widget
│   │       ├── Loader.tsx                # Unified wave-animated loading spinner
│   │       ├── ToastNotification.tsx     # Session restore toasts
│   │       ├── DeletModal.tsx            # Admin resource delete modal
│   │       ├── AddnUpdateModalWrapper.tsx # Admin CRUD slide-over drawer
│   │       └── Svgs.tsx                  # Reusable SVGs catalog
│   │
│   ├── context/
│   │   ├── ResumeContext.tsx             # State sync, db fetch & local backup
│   │   ├── ProgressContext.tsx           # Practice/bookmarks progress synchronization
│   │   ├── UIContext.tsx                 # Toast notifications and sidebar state
│   │   └── index.tsx                    # Composition layer for providers
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
│   ├── data/                             # Sample/Local static seed data
│   │   └── sampleResume.ts
│   │
│   ├── types/
│   │   ├── resume.ts                     # Main TS interfaces
│   │   ├── drizzle.d.ts                  # Schema inferences helper
│   │   └── nextauth.d.ts                 # NextAuth Session typings override
│   │
│   ├── hooks/
│   │   └── useCopy.tsx                   # Text clipboard copying helper
│   │
│   ├── lib/
│   │   ├── utils.ts                      # cn() class merge helper & apiRequest
│   │   ├── pdfExport.ts                  # A4 spacing block splitter engine
│   │   └── localStorage.ts               # Offline persistence helpers
│   │
│   └── proxy.ts                          # Next.js dev server proxy rules
│
├── public/                               # Public folder
│   └── assets/
```

---

## 6. Pages & Features

### 6.1 Home Page

**Route:** `/`
**Purpose:** The front door of CareerCraft — introduces all features of the application, clearly explains what each page does, and drives users into the tool.

#### Sections

| Section | Description |
|---|---|
| **Hero** | Headline: *"Craft Your Career. Land the Job."* Subheadline explaining the app as an all-in-one career toolkit for 2026 job seekers. Primary CTA → `/generator`; Secondary CTA → `/resume-guide` |
| **What is CareerCraft?** | Brief paragraph introducing the full scope of the application — not just the resume builder, but tips, guides, practice, and blog |
| **How It Works** | 3-step visual: (1) Fill your details in the form → (2) Watch your resume build live → (3) Download & apply |
| **Page Directory — What You Can Do Here** | A dedicated section with one card per app page, each explaining its purpose (see detail below) |
| **Resume Templates Preview** | Visual thumbnail row of the 3 available resume templates (Classic, Modern, Minimal) with a "Start with this template" button |
| **Tips Snapshot** | 2–3 quick-hit resume/interview tips with a "See all tips →" link to `/tips` |
| **Blog Highlights** | 3 featured blog article cards linking to `/blog` |
| **Interview Practice CTA** | Standalone section: *"Ready to practise your answers?"* with a CTA button to `/interview-practice` |
| **2026 Job Market Note** | Short callout: why a strong resume and interview prep matter more than ever in 2026 |
| **Footer CTA** | "Start Building Your Resume — It's Free" button |

#### Page Directory Cards (Home Page Section)

Each card links to its respective page and explains what it offers:

| Card | Page Link | Description Shown on Card |
|---|---|---|
| **Resume Generator** | `/generator` | Build your resume in minutes with our live split-screen editor. Fill in your details and watch your professional resume appear instantly. Download as PDF when ready. |
| **Resume Tips** | `/tips` | Get the insider do's and don'ts for writing a resume that stands out in 2026 — formatting, wording, length, ATS keywords, and common pitfalls to avoid. |
| **Interview Tips** | `/tips#interview` | Nail your next interview with proven do's and don'ts — from preparation and attire to body language, salary talk, and the follow-up email. |
| **Resume Guide** | `/resume-guide` | A step-by-step deep-dive into crafting every section of your resume: from your professional summary to skills, experience, and education. |
| **Interview Guide** | `/interview-guide` | Everything you need to prepare for any interview format — research, STAR method, common questions, dress code, and post-interview follow-up. |
| **Interview Practice** | `/interview-practice` | Practise real interview questions with model answers. Filter by category, reveal answers at your pace, and track which questions you've covered. |
| **Blog** | `/blog` | Read career articles written for 2026 job seekers — ATS tips, resume examples, interview strategies, job search advice, and more. |

#### UI Notes
- Sticky navigation bar with links to all pages
- CSS fade-in on scroll for section reveals (`@keyframes fadeInUp` triggered via Tailwind's `animate-` utility or a CSS class applied on intersection)
- No heavy JS animation; transitions use Tailwind `transition-opacity duration-300` and `transition-transform duration-300`

---

### 6.2 Resume Generator Page

**Route:** `/generator`
**Purpose:** The core feature — a split-screen interface for building and previewing a resume in real time.

#### Layout

```
┌──────────────────────┬──────────────────────┐
│     FORM PANEL       │    PREVIEW PANEL     │
│   (left, scrollable) │  (right, sticky)     │
│                      │                      │
│  [Step Indicator]    │  [Resume Template]   │
│  [Form Section]      │  [Live Updates]      │
│                      │                      │
│  [Save Draft]        │  [Template Picker]   │
│  [Download PDF]      │  [Zoom Controls]     │
└──────────────────────┴──────────────────────┘
```

On mobile (`< 768px`): tabs toggle between Form and Preview panels.

#### Form Sections (multi-step)

1. **Personal Information**
   - Full Name, Job Title/Headline
   - Email, Phone, Location (City, Country)
   - LinkedIn URL, Portfolio/Website URL
   - Profile Photo (optional)

2. **Professional Summary**
   - Textarea (max 300 characters with live counter)
   - Inline tip: *"Tailor this to each job you apply for"*

3. **Work Experience** *(repeatable)*
   - Company Name, Job Title
   - Start Date (Month/Year), End Date or "Present" toggle
   - Location
   - Responsibilities / Achievements (bullet list input)
   - Add / Remove entry buttons

4. **Education** *(repeatable)*
   - Institution, Degree, Field of Study
   - Start Year, End Year (e.g. 2024–2026)
   - GPA (optional), Honours (optional)

5. **Skills**
   - Tag-based input (type and press Enter to add, click × to remove)
   - Categories: Technical Skills, Soft Skills, Languages
   - Proficiency level indicator (optional)

6. **Projects** *(optional, repeatable)*
   - Project Name, Description, Tech Stack tags
   - Live URL, GitHub URL

7. **Certifications** *(optional, repeatable)*
   - Certificate Name, Issuing Organisation, Year (2020–2026 range)

8. **Additional Sections** *(optional)*
   - Volunteer Work, Awards, Publications, Hobbies

#### Resume Preview Panel

- **Live sync** — Updates on every keystroke (debounced 150ms via `useCallback`)
- **Template switcher** — Classic, Modern, Minimal
- **Colour theme picker** — 5 preset accent colours
- **Zoom controls** — Fit-to-panel / 100%
- **Download PDF button** — Client-side export using `html2canvas + jsPDF`

#### Progress & Persistence

- Step progress bar at top of form panel
- Context state auto-saves to `localStorage` on every change (debounced 500ms)
- "Resume restored from your last session" toast on returning visits
- "Clear & Start Over" with confirmation dialog

---

### 6.3 Tips Page

**Route:** `/tips`
**Purpose:** Scannable, categorised do's and don'ts for resumes and interviews.

#### Sub-sections (tab navigation)

| Tab | Content |
|---|---|
| **Resume Tips** | Do's and Don'ts for writing a strong resume in 2026 — formatting, wording, ATS optimisation, length, common mistakes |
| **Interview Tips** | Do's and Don'ts for interview performance — preparation, attire, body language, handling tough questions, follow-up |

#### Tip Card Structure

Each card contains:
- Category badge (e.g. "Formatting", "First Impression", "ATS")
- Type indicator: ✅ **Do** or ❌ **Don't**
- Short bold headline
- 2–3 sentence explanation
- Optional real-world example

#### Content Examples

**Resume Do's (2026):**
- Use ATS-friendly formatting — plain fonts, standard section headings, no tables or graphics in the main body
- Quantify every achievement possible ("Reduced onboarding time by 40% in Q1 2026")
- Tailor your resume to each job description using mirrored keywords
- Keep it to one page if under 5 years experience; two pages maximum

**Resume Don'ts:**
- Don't use a photo, date of birth, or marital status (unless regional norms require it)
- Don't write in first person ("I led a team…")
- Don't use a generic objective statement
- Don't list outdated or irrelevant experience

**Interview Do's (2026):**
- Research the company's recent news, products, and values before any interview
- Use the STAR method for behavioural questions (Situation, Task, Action, Result)
- Prepare 3–5 thoughtful questions to ask at the end
- Send a personalised thank-you email within 24 hours

**Interview Don'ts:**
- Don't arrive late — aim for 10 minutes early (or join the video call 2 minutes early)
- Don't speak negatively about previous employers or colleagues
- Don't give vague answers — specificity builds credibility
- Don't forget to follow up after the interview

---

### 6.4 Blog Page

**Route:** `/blog`
**Purpose:** Career-focused articles written for 2026 job seekers; builds trust and drives organic traffic.

#### Blog Listing Page (`/blog`)

- 3-column card grid (desktop), 1-column (mobile)
- Each card: cover image, category badge, title, excerpt, author, publish date, read time
- Filter tabs: All, Resume, Interview, Career, Job Search
- Search bar (client-side filter on static data for MVP)

#### Blog Article Page (`/blog/[slug]`)

- Full long-form article layout
- Estimated read time displayed below title
- Author profile widget (name, role, avatar)
- Sticky table of contents sidebar (desktop)
- Related articles section (3 cards)
- "Copy link" share button
- "← Back to Blog" navigation

#### Seed Article Ideas (2026 focused)

1. *"10 Resume Mistakes That Are Costing You Interviews in 2026"*
2. *"How to Write a Professional Summary That Gets Noticed"*
3. *"The STAR Method: Answering Behavioural Questions Like a Pro"*
4. *"ATS in 2026: What's Changed and How to Beat It"*
5. *"Entry-Level Resume Guide: Standing Out With No Experience"*
6. *"Top 20 Interview Questions and How to Answer Them (2026 Edition)"*
7. *"Remote Job Interviews: How to Prepare for Video Calls"*
8. *"Salary Negotiation: What to Say (and What Not to Say)"*

---

### 6.5 Resume Guide Page

**Route:** `/resume-guide`
**Purpose:** A comprehensive step-by-step written guide on crafting a professional resume.

#### Sections

1. What Is a Resume and Why It Matters in 2026
2. Resume Formats — Chronological, Functional, Combination
3. Choosing the Right Format for Your Situation
4. Section-by-Section Breakdown
5. Writing a Strong Professional Summary
6. Describing Work Experience Effectively
7. Listing Education Correctly
8. Skills — What to Include and How
9. Optional Sections and When to Add Them
10. ATS Optimisation Checklist for 2026
11. Final Review Checklist Before Submitting

#### UI
- Long-form article layout with generous typography
- Sticky table of contents (left sidebar on desktop; collapsible on mobile)
- Reading progress bar at top of viewport (CSS `position: fixed`, width driven by scroll percentage via a lightweight JS listener)
- Inline CTA banners: *"Apply this section to your resume now →"* linking to `/generator`

---

### 6.6 Interview Guide Page

**Route:** `/interview-guide`
**Purpose:** A comprehensive guide on preparing for and succeeding in job interviews in 2026.

#### Sections

1. Types of Interviews in 2026 (Phone, Video, In-Person, Panel, Technical, AI-screened)
2. Researching the Company Thoroughly
3. Understanding the Job Description
4. Preparing Your Answers — STAR Method Deep Dive
5. Common Interview Formats (Behavioural, Situational, Competency-based, Case)
6. What to Wear in 2026 (In-Person vs Video)
7. Day-of Checklist
8. Body Language & Presence (including video-call-specific tips)
9. Questions to Ask the Interviewer
10. After the Interview — Follow-Up Best Practices

---

### 6.7 Interview Practice Page

**Route:** `/interview-practice`
**Purpose:** An interactive Q&A tool for drilling common interview questions with model answers.

#### Features

| Feature | Description |
|---|---|
| **Question Browser** | Browse questions by category with a filter tab bar |
| **Reveal Answer** | User reads the question first; clicks a button to reveal the model answer |
| **STAR Breakdown** | Model answers are annotated with **S** / **T** / **A** / **R** labels |
| **Bookmark Questions** | Star/save questions to a personal practice list (stored in `ProgressContext` → `localStorage`) |
| **Progress Tracking** | "X of Y practised" counter per category, persisted in localStorage |
| **Random Mode** | Flashcard-style random question drill — shows one question at a time, reveal, then next |
| **Reset Progress** | Clear progress for a category or all categories |

#### Question Categories

- **General / Opener** — "Tell me about yourself", "Why do you want this job?"
- **Behavioural** — "Describe a time you handled conflict at work"
- **Situational** — "What would you do if you disagreed with your manager?"
- **Strengths & Weaknesses**
- **Career Goals** — "Where do you see yourself in 5 years?" (contextualised for 2026)
- **Remote & Hybrid Work** — New category relevant to 2026 hiring trends
- **Industry/Role-specific** *(starter set, expandable)*

### 6.8 Admin Panel & CMS Pages

**Route:** `/admin` (and nested sub-routes: `/admin/tips`, `/admin/resume-guide`, `/admin/interview-guide`, `/admin/blogs`, `/admin/practice`, `/admin/admins`)  
**Purpose:** A comprehensive, authenticated management dashboard that allows authorized administrators to perform CRUD operations on the platform's content.

#### Sub-pages and Functionality
- **Overview Dashboard (`/admin`):** Shows system status metrics, total active administrators, quick-action shortcuts to individual managers, and general system health indicators.
- **Manage Tips (`/admin/tips`):** Full list and CRUD forms for resume and interview tips. Admins can toggle tip types (✅ Do vs. ❌ Don't), specify categories, and write headlines, detailed explanations, and example cases.
- **Guide Managers (`/admin/resume-guide` and `/admin/interview-guide`):** Lists all chapters and sub-sections of writing and preparation guides. Supports sorting and reordering via simple controls, and editing chapter titles, subtitles, Markdown text, and custom CTA anchors.
- **Manage Blogs (`/admin/blogs`):** Grid card listing of all career articles. Features a sliding panel containing a Markdown text editor with real-time word counting, category pickers, and cover image uploading integrated directly with **Vercel Blob Storage** (`@vercel/blob`).
- **Q&A Practice Manager (`/admin/practice`):** Category-filtered table of practice questions. Supports a slide-over panel that alters its input fields based on question type: behavioral prompts render four custom textareas mapping to the **STAR method** (Situation, Task, Action, Result), whereas other categories render a unified general answer text area.
- **Manage Admins (`/admin/admins`):** Lists all active platform administrators in a data table showing user profiles (avatars, names, emails, role badges, join dates). Includes a promote-by-email form. A delete button allows demotion of admin users with built-in safety controls blocking self-revocation to prevent administrator lockout.

---

### 6.9 Feedback Mechanism

**Components:** `<FeedbackWidget />`, `<FeedbackModal />`  
**Purpose:** Collect user feedback, bug reports, and feature requests directly from any view, delivering them as categorized repository issues to the development team.

#### Features
- **Floating Trigger Button:** A persistent, clean icon badge anchored to the bottom corner of all pages.
- **Scroll-locked Modal:** Displays category selection (bug, feature request, general feedback, improvement, UI/UX, documentation), star rating, and detailed textareas.
- **GitHub Integration:** Sends validated requests to the Next.js API endpoint `/api/feedback`. The server formats the payload and uses a GitHub integration token to create a new issue under the target repository with automated labels.

---

## 7. Data Models

### Resume Data

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
    lastUpdated: string; // ISO date string, e.g. "2026-05-19"
  };
}

interface ExperienceEntry {
  id: string;
  company: string;
  jobTitle: string;
  location?: string;
  startDate: string;           // e.g. "Jan 2024"
  endDate: string | 'Present'; // e.g. "Mar 2026" or "Present"
  bullets: string[];
}

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;           // e.g. 2022
  endYear: number | 'Present'; // e.g. 2026
  gpa?: string;
  honours?: string;
}

interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  year: number; // range: 2020–2026
}

interface AdditionalSection {
  id: string;
  title: string;
  items: string[];
}
```

### User Progress Data

```typescript
interface UserProgress {
  resumeCompletedSections: string[];    // Section IDs completed in the generator
  practiceQuestionsAnswered: string[];  // Question IDs practised
  bookmarkedQuestions: string[];        // Bookmarked question IDs
  blogArticlesRead: string[];           // Article slugs read
  lastVisited: string;                  // ISO date, e.g. "2026-06-09"
}
```

### Database Schemas (Drizzle ORM & PostgreSQL)

The backend database layer utilizes Drizzle ORM to define table schemas and relationships.

#### Users Table (`user`)
Stores user profiles registered via NextAuth.
- `id` (text, Primary Key)
- `name` (text, Nullable)
- `email` (text, Unique)
- `emailVerified` (timestamp, Nullable)
- `image` (text, Nullable)
- `createdAt` (timestamp, default `now()`)

#### Accounts Table (`account`)
Maps OAuth provider accounts (Google Provider) to internal users.
- `userId` (text, Foreign Key referencing `user.id`, cascade delete)
- `type` (text)
- `provider` (text)
- `providerAccountId` (text)
- `refresh_token`, `access_token` (text, Nullable)
- `expires_at` (integer, Nullable)
- `token_type`, `scope`, `id_token`, `session_state` (text, Nullable)
- Compound Primary Key: `[provider, providerAccountId]`

#### Admin Table (`admin`)
Maps users with admin permissions.
- `id` (text, Primary Key)
- `userId` (text, Foreign Key referencing `user.id`, cascade delete)
- `isSuperAdmin` (boolean, default `false`)
- `createdAt` (timestamp, default `now()`)

#### Resume Table (`resume`)
Stores resume JSON documents.
- `id` (uuid, Primary Key, default `uuid_generate_v4()`)
- `userId` (text, Foreign Key referencing `user.id`, cascade delete)
- `title` (text, default "Untitled Resume")
- `data` (jsonb mapping to `ResumeData` interface)
- `createdAt`, `updatedAt` (timestamp, default `now()`)

#### User Progress Table (`user_progress`)
Tracks learning, practice, and bookmark states.
- `userId` (text, Primary Key, Foreign Key referencing `user.id`, cascade delete)
- `data` (jsonb mapping to `UserProgress` interface)
- `updatedAt` (timestamp, default `now()`)

#### Tip Table (`tip`)
- `id` (text, Primary Key)
- `category` (enum: ATS, Formatting, Wording, Preparation, Behavior, Follow Up, Negotiation)
- `type` (enum: do, dont)
- `headline` (text)
- `explanation` (text)
- `example` (text, Nullable)
- `resourceType` (enum: Resume, Interview)
- `createdAt` (timestamp, default `now()`)

#### Guide Table (`guide`)
- `id` (text, Primary Key)
- `type` (enum: Resume, Interview)
- `title` (text)
- `subtitle` (text, Nullable)
- `content` (text, Markdown/HTML)
- `bullets` (jsonb string array, Nullable)
- `ctaText`, `ctaLink` (text, Nullable)
- `sortOrder` (integer, default `0`)
- `createdAt` (timestamp, default `now()`)

#### Practice Question Table (`practice_question`)
- `id` (text, Primary Key)
- `category` (enum: General, Behavioral, Situational, Strengths & Weaknesses, Remote Work)
- `question` (text)
- `tip` (text)
- `modelAnswer` (jsonb mapping to `ModelAnswer` structure: `overview`, `situation`, `task`, `action`, `result`, `generalAnswer`)
- `createdAt` (timestamp, default `now()`)

#### Blog Table (`blog`)
- `id` (text, Primary Key)
- `slug` (text, unique)
- `title` (text)
- `excerpt` (text)
- `category` (enum: Resume, Interview, Career, Job Search, Negotiation)
- `publishDate` (text)
- `readTime` (text)
- `image` (text, Vercel Blob URL, Nullable)
- `content` (text, Markdown)
- `authorId` (text, Foreign Key referencing `user.id`, cascade delete)
- `createdAt` (timestamp, default `now()`)

---

## 8. State & Storage Management

### Context Structure

State is managed with React Context API, integrated with **NextAuth SessionProvider** and **SWR** caching for server-side persistence.

```
app/layout.tsx
  └── <SessionProvider>     ← NextAuth authentication state wrapper
        └── <AppProvider>    ← Combined AppProvider
              ├── <ResumeProvider>   ← Resume form state & sync API
              ├── <ProgressProvider> ← Learning progress state & sync API
              └── <UIProvider>       ← Toast alerts & global menu toggle
```

### ResumeContext & ProgressContext Sync Strategy

The contexts utilize client-side React state synchronized with PostgreSQL database tables via Next.js REST API routes and `useSWR` hooks.

#### 1. Session Hydration
- Upon initial mount:
  - If the user session is **unauthenticated**, the providers read cached configurations from `localStorage` (`cc_resume_data` and `cc_user_progress`) and hydrate the state.
  - If the user session is **authenticated**, SWR fetches user-specific resume data (`/api/resume`) and learning progress (`/api/progress`) directly from PostgreSQL.
  - If no database data exists but the local storage holds active user input, the application automatically performs a **one-time local-to-cloud migration**, POSTing the local draft to the server database and calling `mutate()` to revalidate SWR cache.

#### 2. Debounced Database Synchronization
- On every keystroke/change in the generator or progress tracker:
  - The local React state is updated immediately for lag-free preview rendering (latency < 150ms).
  - A manual debounce timer (1000ms delay) is initiated.
  - When the timer fires, the updated document is written to `localStorage` as a fallback safety net and, if authenticated, is sent via a POST request to `/api/resume` or `/api/progress` to synchronize the cloud database without causing excessive write overhead.

### localStorage Keys

| Key | Value | Description |
|---|---|---|
| `cc_resume_data` | `ResumeData` (JSON) | Active resume fallback backup |
| `cc_user_progress` | `UserProgress` (JSON) | Practice question logs & bookmarks backup |
| `cc_last_step` | `number` | Client-side UI state tracking current generator form step |

---

## 9. UI/UX Design Specifications

### Design Language

| Attribute | Value |
|---|---|
| **Theme** | Light default (zinc-based light layout for admin panels; dark mode planned for Phase 3) |
| **Primary Font** | Display: *Playfair Display*; Body: *DM Sans* |
| **Primary Color** | `#1A1A2E` (deep navy) |
| **Accent Color** | `#E94560` (vibrant red-coral) |
| **Surface** | `#F9F9FB` (off-white) |
| **Border Radius** | `8px` base; `16px` for cards |
| **Shadows** | Subtle, layered: `0 2px 8px rgba(0,0,0,0.08)` |

### Tailwind CSS v4 `@theme` Tokens

```css
/* styles/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #1a1a2e;
  --color-accent: #e94560;
  --color-surface: #f9f9fb;
  --color-muted: #6b7280;
  --font-display: 'Playfair Display', serif;
  --font-body: 'DM Sans', sans-serif;
  --radius-card: 16px;
  --radius-base: 8px;
}
```

### Animation Approach

All animations use **CSS only** — either Tailwind utility classes or custom `@keyframes` in `globals.css`. No Framer Motion or JS animation libraries.

```css
/* globals.css — custom animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

Used via Tailwind's `animate-` utilities or applied as CSS classes:

```tsx
<div className="animate-[fadeInUp_0.4s_ease_forwards]">...</div>
```

Transitions for interactive elements use Tailwind utilities only:
```tsx
<button className="transition-colors duration-200 hover:bg-accent/90 active:scale-95">
```

### Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| Mobile (`< 768px`) | Form and preview stacked; tab toggle between them |
| Tablet (`768px–1024px`) | Side-by-side, 50/50 split |
| Desktop (`> 1024px`) | 45% form / 55% preview |

### Accessibility

- All interactive elements keyboard-navigable (tab order, Enter/Space activation)
- `aria-label` on all form inputs and icon-only buttons
- Colour contrast ratio ≥ 4.5:1 across all text/background combinations
- `focus-visible` ring styles on all interactive elements
- Live region (`aria-live="polite"`) for toast notifications

---

## 10. Component Breakdown

### Shared Components

| Component | Key Props | Description |
|---|---|---|
| `<Navbar />` | `activePage` | Top navigation linking to all pages; highlights current page |
| `<Footer />` | — | Site footer with page links, branding, copyright 2026 |
| `<ProgressBar />` | `steps, currentStep` | Multi-step form progress indicator |
| `<Badge />` | `label, variant` | Category/status label chips |
| `<SectionHeader />` | `title, subtitle` | Consistent section headings |
| `<ToastNotification />` | `message, type` | Auto-dismissing alerts (CSS fade-out animation) |
| `<PageDirectoryCard />` | `title, description, href, icon` | Used on the Home page to explain each app section |

### Generator Components

| Component | Description |
|---|---|
| `<SplitLayout />` | Manages left (form) / right (preview) panel layout |
| `<FormPanel />` | Scrollable left panel container |
| `<PreviewPanel />` | Sticky right panel container |
| `<StepNav />` | Previous/Next buttons between form steps |
| `<RepeaterField />` | Generic add/remove field group (experience, education, etc.) |
| `<SkillTagInput />` | Tag-style input for skills |
| `<ClassicTemplate />` | Classic resume layout |
| `<ModernTemplate />` | Modern resume layout |
| `<MinimalTemplate />` | Minimal resume layout |
| `<TemplateSelector />` | Template thumbnail picker |
| `<ColorPicker />` | Accent colour selector (5 presets) |
| `<ExportButton />` | Triggers `html2canvas + jsPDF` PDF download |

### `cn()` Usage Rule

Every component that applies conditional or dynamic classes **must** use the `cn()` helper from `lib/utils.ts`. Direct template literal class strings are not permitted for conditional logic.

---

## 11. Routing

### Front-End Web Routes

| Route | Page | Rendering Strategy |
|---|---|---|
| `/` | Home | SSG |
| `/generator` | Resume Generator | CSR (`'use client'`) |
| `/tips` | Tips | SSG |
| `/resume-guide` | Resume Guide | SSG |
| `/interview-guide` | Interview Guide | SSG |
| `/interview-practice` | Interview Practice | CSR (`'use client'`) |
| `/blog` | Blog Listing | SSG + ISR |
| `/blog/[slug]` | Blog Article | SSG + ISR |
| `/admin` | Admin Dashboard Overview | SSG + Session Guards |
| `/admin/tips` | Admin Tips Manager | CSR + Session Guards |
| `/admin/resume-guide` | Admin Resume Guide Manager | CSR + Session Guards |
| `/admin/interview-guide` | Admin Interview Guide Manager | CSR + Session Guards |
| `/admin/blogs` | Admin Blogs Manager | CSR + Session Guards |
| `/admin/practice` | Admin Q&A Practice Manager | CSR + Session Guards |
| `/admin/admins` | Admin Administrators Manager | CSR + Session Guards |
| `*` | 404 Page | Static |

### Back-End API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/auth/[...nextauth]` | GET, POST | OAuth authentication and session handlers |
| `/api/resume` | GET, POST | Fetch active user resume / update database resume data |
| `/api/progress` | GET, POST | Fetch user progress tracker / update progress metadata |
| `/api/feedback` | POST | Zod validation & remote issue submission to GitHub repo |
| `/api/admin` | GET, POST | Fetch administrator registry / promote users by email |
| `/api/admin/check` | GET | Verify whether active session corresponds to an admin role |
| `/api/admin/blogs` | GET, POST, PUT, DELETE | CRUD operations on the database Blog table |
| `/api/admin/guides` | GET, POST, PUT, DELETE | CRUD operations on the database Guide table |
| `/api/admin/tips` | GET, POST, PUT, DELETE | CRUD operations on the database Tip table |
| `/api/admin/practice` | GET, POST, PUT, DELETE | CRUD operations on the database Practice Question table |
| `/api/admin/upload` | POST | Cover image upload proxy to Vercel Blob storage |

---

## 12. Future Enhancements

All completed Phase 2 features (NextAuth Google authentication, cloud storage synchronization, feedback forms, and Admin CMS panel) are powered directly by Next.js API Routes connecting to PostgreSQL via Drizzle ORM.

| Feature | Phase | Notes |
|---|---|---|
| Multiple saved resumes per account | Phase 3 | Allow naming and cloning of saved resumes |
| Email newsletter signup | Phase 3 | Subscribe API + third-party email provider webhook |
| AI-powered summary & bullet suggestions | Phase 3 | LLM endpoint proxying for content suggestion |
| Cover letter generator | Phase 3 | Paired with active resume data context |
| ATS score checker | Phase 4 | Match-scoring engine comparing resume to job descriptions |
| Resume sharing via public link | Phase 4 | Unique public access URL stored in DB |
| Dark mode | Phase 3 | Tailwind dark variant support; persisted preference |
| Mobile app (React Native) | Phase 4 | Shared typescript schemas + Next.js API endpoints |

---

## 13. Development Milestones

| Milestone | Deliverables | Status |
|---|---|---|
| **M1 – Foundation** | Repo setup, Next.js 16 config, Tailwind v4 `@theme`, `cn()` utility, layout components, routing skeleton | ✅ Complete (Jan 2026) |
| **M2 – Resume Generator** | All 8 form sections, live preview, 3 templates, Context state, localStorage sync, PDF export | ✅ Complete (Feb–Mar 2026) |
| **M3 – Resource Pages** | Tips page (both tabs), Resume Guide, Interview Guide — content + UI | ✅ Complete (Mar–Apr 2026) |
| **M4 – Interview Practice** | Q&A browser, STAR breakdowns, bookmarks, random mode, progress tracking | ✅ Complete (Apr 2026) |
| **M5 – Blog** | Blog listing, article page, 8 seed articles | ✅ Complete (May 2026) |
| **M6 – Home Page** | Full home page with all sections including Page Directory cards | ✅ Complete (May 2026) |
| **M7 – Polish & QA** | Feedback widget, wave loaders, scroll lock, accessibility, SEO metadata optimization | ✅ Complete (May 2026) |
| **M8 – Backend Integration** | Drizzle ORM, PostgreSQL database, replica read splitting, NextAuth Google OAuth login, SWR state synchronization, and the Admin CMS Portal | ✅ Complete (Jun 2026) |

---

*Document maintained by the core development team. Last updated May 2026. Update this file as requirements evolve.*
