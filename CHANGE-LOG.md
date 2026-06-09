# CareerCraft Changelog

All notable changes to the CareerCraft project will be documented in this file.

This changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) conventions, and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned

- Dark mode toggle (Tailwind dark variant + user preference persisted in localStorage) (Phase 3)
- Multiple saved resumes per account (Phase 3)
- AI-powered professional summary and bullet-point suggestions (Phase 3)
- Cover letter generator paired with resume data context (Phase 3)
- ATS score checker with keyword match scoring against job descriptions (Phase 4)
- Resume public sharing via unique slug (Phase 4)
- Mobile application (React Native, Phase 4)

---

## [1.3.0] - 2026-06-09

### Added

- **PostgreSQL & Drizzle ORM Setup**: Configured database access using Drizzle ORM and a `node-postgres` PG connection pool. Added support for primary write database and 2 read replicas using Drizzle's `withReplicas` adapter for read-splitting.
- **NextAuth Integration**: Implemented NextAuth Google provider login using a JWT strategy and `DrizzleAdapter` for secure session storage. Custom callbacks check admin permissions against the database `admin` table.
- **Database Synchronization**: Created Next.js API endpoints `/api/resume` and `/api/progress` to fetch and sync resume data and user activity progress.
- **Client-Side SWR Sync**: Configured client contexts (`ResumeContext` and `ProgressContext`) to sync with server APIs using `useSWR` when authenticated. Updates are debounced by 1 second on write.
- **Local-to-Cloud Migration**: Added a one-time automated migration logic that transfers local draft resumes and progress logs from `localStorage` to the database on the user's first login.
- **GitHub Integrated Feedback widget**: Created a persistent floating widget and modal (`FeedbackModal`) that posts validated feedback details (bugs, features, etc.) directly to the GitHub repository issues via `/api/feedback` API route.
- **Unified Wave Loader**: Replaced inline load indicators with a unified wave loader component (`Loader.tsx`) with animated wave bars.
- **SEO & Social Sharing Metadata**: Added support for meta keywords, OpenGraph tags, and Twitter cards sharing default preview images.

### Improved

- **Admin Managers Extension**: Expanded `/admin` sub-routes to fully manage guides, tips, blogs (with Vercel Blob uploads and real-time Markdown editor word count), Q&A practice (with custom inputs for STAR method situations), and administrator registries.
- **Admin Panel Zinc Light Theme**: Completed transition of the entire admin manager portal views (dashboard card status, tables, slide-over modals) to light zinc styles for design consistency.

---

## [1.2.0] - 2026-06-02

### Added

- **Admin Q&A Practice Manager** (`/admin/practice`): Implemented a full CRUD manager for interview practice questions. Features category filtering (General, Behavioral, Situational, Strengths & Weaknesses, Remote Work), a global search bar, collapsible model-answer previews (inline STAR cards for Behavioral, general answer for all other types), and a slide-over form with context-sensitive fields — STAR fields (Situation, Task, Action, Result) for Behavioral, and a General Answer textarea for all other categories.
- **Admin Administrators Manager** (`/admin/admins`): Implemented the administrator list and permission management page. Lists all active admins in a data table with avatar, name, email, role badge, and join date. Includes a promote-by-email form (POST `/api/admin`) and a demote action with a confirmation modal. Self-revocation is blocked server-side and disabled in the UI to prevent accidental lockout.

### Improved

- **Admin Layout** (`src/app/admin/layout.tsx`): Transitioned the full sidebar, drawer navigation, session profile card, and layout frame from a dark `slate`-based palette to the project's canonical zinc/white light theme — `bg-white`, `border-zinc-200`, `text-zinc-900` accent borders.
- **Admin Overview Dashboard** (`src/app/admin/page.tsx`): Converted the overview metric cards, quick-action shortcuts, and system status panels to the light zinc palette with correct `text-zinc-900` primary text and `bg-white border-zinc-200` card surfaces.
- **Admin Tips Manager** (`src/app/admin/tips/page.tsx`): Migrated tabs, category filter pills, tip article cards, and slide-over form sheet from dark mode to light zinc styling.
- **Admin Blog Manager** (`src/app/admin/blogs/page.tsx`): Converted blog post grid cards, hover action overlays, the Vercel Blob image uploader, and the Markdown editor slide-over panel from dark to light theme.
- **Admin Resume Guide Manager** (`src/app/admin/resume-guide/page.tsx`): Transitioned guide section list, sorting buttons, and slide-over form sheet to the light zinc design system.
- **Admin Interview Guide Manager** (`src/app/admin/interview-guide/page.tsx`): Replaced all `slate` dark-mode classes with zinc light equivalents — `bg-white`, `border-zinc-200`, `text-zinc-900`, `text-zinc-500` — across the guide section listing, CRUD actions toolbar, slide-over form, and delete confirmation modal.

### Documentation

- **README.md**: Updated version badge to `v1.2.0`, added v1.2.0 current-version release notes, and updated the Pages & Routes table to include all admin sub-routes.
- **CHANGE-LOG.md**: Added this v1.2.0 entry capturing all admin UI improvements and new page additions.
- **package.json**: Bumped `version` field to `1.2.0`.

---

## [1.1.2] - 2026-05-24

### Added

- **FeedbackModal Component**: Implemented a full-featured `FeedbackModal.tsx` shared component that allows users to submit structured feedback directly from any page. The modal includes category selection, star rating, and a text area for free-form comments.
- **FeedbackWidget Component**: Added a lightweight `FeedbackWidget.tsx` trigger button that floats persistently on the UI, giving users a consistent entry point to submit feedback without disrupting their workflow.
- **Svgs Shared Utility**: Created `Svgs.tsx` in `components/shared/` to centralise reusable SVG icon definitions and keep inline SVG usage consistent across the application.

### Improved

- **Navbar Enhancements**: Continued iterative refinements to `Navbar.tsx`, including active state styling, improved accessibility attributes, and sticky positioning across all viewport sizes.

---

## [1.1.1] - 2026-05-23 15:32:00

### Added

- **Intermediate Page-Block Padding**: Implemented a padding-aware block splitting engine in the PDF exporter (`pdfExport.ts`) that enforces `20mm` top and bottom margins on intermediate pages. It dynamically detects if blocks start in a page's top padding zone or end in the bottom padding zone, inserting transparent spacers to push elements to the usable content start of the next page.

---

## [1.1.0] - 2026-05-23 14:32:00

### Added

- **Dynamic Page Numbering and Fold Lines**: Configured a `ResizeObserver` in `PreviewContainer.tsx` to automatically track the height of `#resume-preview-document`, calculate page count dynamically, and render dashed fold/page indicator lines positioned at `288mm` relative to the top of each A4 page.

### Fixed

- **Subpixel Calculation Mismatch**: Fixed a bug causing a phantom "Page 2 Fold" indicator to render on single-page resumes. Added a `1mm` tolerance to the height-to-page calculation to absorb browser subpixel rendering discrepancies.
- **PDF Export Sanitation**: Updated the PDF clone rendering in `pdfExport.ts` to query and strip out all `.page-fold-indicator` elements before generating the PDF canvas.

---

## [1.0.7] - 2026-05-22 23:26:17

### Added

- **Custom Icon Generation**: Integrated custom icon generation assets and script.
- **Changelog Initialization**: Seeded the `CHANGE-LOG.md` history.

### Removed

- **Boilerplate Assets**: Cleaned up default public assets left over from create-next-app bootstrap.

---

## [1.0.6] - 2026-05-22 23:12:28

### Refactored

- **Code Style Alignment**: Formatted and unified Tailwind CSS classes and JS/TS coding style across the generator form sections, preview canvas wrappers, and templates (Classic, Modern, Minimal).

---

## [1.0.5] - 2026-05-20 19:10:12

### Refactored

- **Blog UI Modernization**: Redesigned the `BlogContent` page for a premium, clean visual layout.
- **Navbar Styling**: Upgraded the standard layout navbar to a sleek, semi-transparent sticky layout with container highlights.
- **Project Structure**: Automated linting and formatting across major project source files.

---

## [1.0.4] - 2026-05-20 16:35:31

### Refactored

- **Guide Layouts**: Updated UI layout styling for the Resume Writing Guide (`/resume-guide`) and Interview Preparation Guide (`/interview-guide`) to improve readability and visual hierarchy.

---

## [1.0.3] - 2026-05-20 15:36:31

### Refactored

- **Tips Page Update**: Simplified structural elements and interaction logic inside the Resume & Interview Tips tabs using modern semantic HTML elements.

---

## [1.0.2] - 2026-05-20 14:54:58

### Refactored

- **Home Page Redesign**: Complete visual overhaul of the landing page, directories, grid elements, and typography layout.

---

## [1.0.1] - 2026-05-20 11:46:32

### Release

- **Version 1.0.0**: Initial release of the CareerCraft career toolkit workspace, featuring the resume builder, practice browser, guides, and tips sections.

---

## [1.0.0] - 2026-05-20 07:32:42

### Added

- **Project Initialization**: Bootstrapped Next.js 16 app framework using create-next-app package.
