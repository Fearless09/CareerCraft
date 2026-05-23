# CareerCraft Changelog

All notable changes to the CareerCraft project will be documented in this file.

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
