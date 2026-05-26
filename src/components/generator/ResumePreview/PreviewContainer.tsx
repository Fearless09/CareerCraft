"use client";

import { useEffect, useRef, useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { useUI } from "@/context/UIContext";
import { exportResumeToPDF } from "@/lib/pdfExport";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import {
  ZoomIn,
  ZoomOut,
  Download,
  FileText,
  LayoutTemplate,
  Palette,
  Check,
} from "lucide-react";
import { ResumeData } from "@/types/resume";
import { cn } from "@/lib/utils";

const ZOOM_MAX = 1.2;
const ZOOM_MIN = 0.5;

export default function PreviewContainer() {
  const { resumeData, setTemplate, setAccentColor } = useResume();
  const { addToast } = useUI();
  const [zoom, setZoom] = useState<number>(0.85); // Default scaled down slightly to fit on screen
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(1);
  const previewRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;

    const updatePageCount = () => {
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      if (width > 0) {
        const pxPerMm = width / 210;
        const heightMm = height / pxPerMm;
        // Apply a small tolerance (1mm) to prevent browser subpixel layout rounding
        // discrepancies from triggering a phantom extra page.
        const pages = Math.max(1, Math.floor((heightMm - 1) / 297));
        setPageCount(pages);
      }
    };

    const observer = new ResizeObserver(() => {
      updatePageCount();
    });

    observer.observe(element);
    updatePageCount();

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.05, ZOOM_MAX));
  const handleZoomOut = () =>
    setZoom((prev) => Math.max(prev - 0.05, ZOOM_MIN));

  const handleDownload = async () => {
    setIsExporting(true);
    addToast("Preparing premium resume layout...", "info");

    try {
      // Small timeout to allow toasts and dynamic spacers to settle
      setTimeout(async () => {
        try {
          const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, "_") || "My"}_Resume.pdf`;
          if (!previewRef.current) {
            console.error("Preview Not found");
            return;
          }
          await exportResumeToPDF(previewRef.current.id, fileName);
          addToast(
            "Your premium resume has downloaded successfully!",
            "success",
          );
        } catch (err) {
          console.error(err);
          addToast("Failed to export PDF. Please try again.", "error");
        } finally {
          setIsExporting(false);
        }
      }, 500);
    } catch (error) {
      console.error(error);
      setIsExporting(false);
      addToast("Error initializing PDF exporter.", "error");
    }
  };

  return (
    <section className="flex h-full flex-col border-l border-zinc-800 bg-zinc-900 text-zinc-100 select-none">
      {/* Top Options Bar */}
      <section className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950/80 p-4 backdrop-blur-md">
        {/* Template Selector */}
        <main id="template-selector" className="flex items-center gap-2">
          <LayoutTemplate className="size-4 text-zinc-400" />
          <span className="mr-1 hidden text-xs font-medium text-zinc-400 sm:inline">
            Design:
          </span>

          <div className="flex rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  if (t.id === resumeData.meta.templateId) return;
                  setTemplate(t.id);
                }}
                className={cn(
                  "transition-300 shrink-0 cursor-pointer rounded-md px-3 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200",
                  {
                    "bg-accent text-white": resumeData.meta.templateId === t.id,
                  },
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </main>

        {/* Accent Color Palette */}
        <main id="color-palette" className="flex items-center gap-2">
          <Palette className="size-4 text-zinc-400" />
          <span className="mr-1 hidden text-xs font-medium text-zinc-400 sm:inline">
            Theme:
          </span>

          <div className="flex items-center gap-1.5">
            {COLORS.map((color) => (
              <button
                key={color.hex}
                onClick={() => {
                  if (color.hex === resumeData.meta.accentColor) return;
                  setAccentColor(color.hex);
                }}
                title={color.name}
                className="transition-300 relative flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full hover:scale-110 active:scale-95"
                style={{ backgroundColor: color.hex }}
              >
                {resumeData.meta.accentColor === color.hex && (
                  <Check className="size-3.5 stroke-3 text-white drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </main>

        {/* Zoom & Export Actions */}
        <main id="zoom_export" className="flex items-center gap-2">
          {/* Zoom Buttons */}
          <div
            id="zoom"
            className="flex items-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
          >
            <button
              onClick={handleZoomOut}
              disabled={zoom <= ZOOM_MIN}
              title="Zoom Out"
              className="transition-300 shrink-0 cursor-pointer p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 active:bg-zinc-800 disabled:pointer-events-none disabled:opacity-50"
            >
              <ZoomOut className="size-4" />
            </button>

            <span className="min-w-10 shrink-0 px-1 text-center font-mono text-xs font-medium text-zinc-400 select-none">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              disabled={zoom >= ZOOM_MAX}
              title="Zoom In"
              className="transition-300 shrink-0 cursor-pointer p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 active:bg-zinc-800 disabled:pointer-events-auto disabled:opacity-50"
            >
              <ZoomIn className="size-4" />
            </button>
          </div>

          {/* Export Action */}
          <button
            title="export button"
            onClick={handleDownload}
            disabled={isExporting}
            className={`from-accent transition-300 flex cursor-pointer items-center gap-2 rounded-lg bg-linear-to-r to-rose-600 px-4.5 py-2.5 text-xs font-medium text-white hover:brightness-115 active:scale-98 disabled:pointer-events-none disabled:opacity-50`}
          >
            <Download className="size-4" />
            <span>{isExporting ? "Exporting..." : "Download PDF"}</span>
          </button>
        </main>
      </section>

      {/* Main Preview Work Surface */}
      <section className="relative flex flex-1 items-start justify-center overflow-auto bg-zinc-900 p-8">
        {/* Shadow Overlay while Exporting */}
        {isExporting && (
          <main
            id="exporting_pdf"
            className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs"
          >
            <div className="flex max-w-70 flex-col items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/90 px-6 py-8 text-center backdrop-blur-md">
              <span className="border-accent size-11 animate-spin rounded-full border-3 border-t-transparent" />
              <div>
                <p className="text-sm font-semibold">Rendering PDF Engine</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Applying dynamic page-slicing spacer grids...
                </p>
              </div>
            </div>
          </main>
        )}

        {/* Scaled Preview Canvas Wrapper */}
        <section
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
          }}
          className="transition-300 relative shrink-0 pb-16"
        >
          {/* Exact A4 Boundaries */}
          <section
            ref={previewRef}
            id="resume-preview-document"
            className="relative box-border min-h-[297mm] w-[210mm] bg-white p-[15mm] text-left text-zinc-800"
          >
            {/* Visual Indicator of A4 page fold (Dashed indicator, not exported by canvas) */}
            {Array.from({ length: pageCount }).map((_, index) => {
              const pageNumber = index + 1;
              const topPositionMm = index * 297 + 282;
              return (
                <div
                  key={pageNumber}
                  style={{ top: `${topPositionMm}mm` }}
                  className="page-fold-indicator pointer-events-none absolute right-0 left-0 z-10 flex h-0 items-center justify-end border-t border-dashed border-zinc-300 opacity-70 select-none print:hidden"
                >
                  <span className="mr-2 flex items-center gap-1 rounded-l-md bg-zinc-200 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase shadow-sm">
                    <FileText className="size-3" /> Page {pageNumber} Fold
                  </span>
                </div>
              );
            })}

            {/* Template Render Inside Canvas */}
            {activeTemplate(resumeData)}
          </section>
        </section>
      </section>
    </section>
  );
}

const COLORS = [
  { name: "Deep Navy", hex: "#1e3a8a" },
  { name: "Indigo Blue", hex: "#4f46e5" },
  { name: "Sleek Teal", hex: "#0d9488" },
  { name: "Vibrant Coral", hex: "#e94560" },
  { name: "Luxury Emerald", hex: "#059669" },
  { name: "Premium Slate", hex: "#3f3f46" },
];

const TEMPLATES: { id: ResumeData["meta"]["templateId"]; label: string }[] = [
  { id: "classic", label: "Classic Chrono" },
  { id: "modern", label: "Modern Executive" },
  { id: "minimal", label: "Minimalist Sleek" },
];

const activeTemplate = (resumeData: ResumeData) => {
  switch (resumeData.meta.templateId) {
    case "classic":
      return <ClassicTemplate data={resumeData} />;
    case "modern":
      return <ModernTemplate data={resumeData} />;
    case "minimal":
      return <MinimalTemplate data={resumeData} />;
    default:
      return <ModernTemplate data={resumeData} />;
  }
};
