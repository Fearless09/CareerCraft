"use client";

import { useState } from "react";
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

export default function PreviewContainer() {
  const { resumeData, setTemplate, setAccentColor } = useResume();
  const { addToast } = useUI();
  const [zoom, setZoom] = useState<number>(0.85); // Default scaled down slightly to fit on screen
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const colors = [
    { name: "Deep Navy", hex: "#1e3a8a" },
    { name: "Indigo Blue", hex: "#4f46e5" },
    { name: "Sleek Teal", hex: "#0d9488" },
    { name: "Vibrant Coral", hex: "#e94560" },
    { name: "Luxury Emerald", hex: "#059669" },
    { name: "Premium Slate", hex: "#3f3f46" },
  ];

  const templates: { id: "classic" | "modern" | "minimal"; label: string }[] = [
    { id: "classic", label: "Classic Chrono" },
    { id: "modern", label: "Modern Executive" },
    { id: "minimal", label: "Minimalist Sleek" },
  ];

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.05, 1.2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.05, 0.5));

  const handleDownload = async () => {
    setIsExporting(true);
    addToast("Preparing premium resume layout...", "info");

    try {
      // Small timeout to allow toasts and dynamic spacers to settle
      setTimeout(async () => {
        try {
          const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, "_") || "My"}_Resume.pdf`;
          await exportResumeToPDF("resume-preview-document", fileName);
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

  const activeTemplate = () => {
    switch (resumeData.meta.templateId) {
      case "classic":
        return (
          <ClassicTemplate
            data={resumeData}
            accentColor={resumeData.meta.accentColor}
          />
        );
      case "modern":
        return (
          <ModernTemplate
            data={resumeData}
            accentColor={resumeData.meta.accentColor}
          />
        );
      case "minimal":
        return (
          <MinimalTemplate
            data={resumeData}
            accentColor={resumeData.meta.accentColor}
          />
        );
      default:
        return (
          <ModernTemplate
            data={resumeData}
            accentColor={resumeData.meta.accentColor}
          />
        );
    }
  };

  return (
    <div className="flex h-full flex-col border-l border-zinc-800 bg-zinc-900 text-zinc-100 select-none">
      {/* Top Options Bar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950/80 p-4 backdrop-blur-md">
        {/* Template Selector */}
        <div className="flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4 text-zinc-400" />
          <span className="mr-1 hidden text-xs font-medium text-zinc-400 sm:inline">
            Design:
          </span>
          <div className="flex rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`cursor-pointer rounded-md px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  resumeData.meta.templateId === t.id
                    ? "bg-accent text-white shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color Palette */}
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-zinc-400" />
          <span className="mr-1 hidden text-xs font-medium text-zinc-400 sm:inline">
            Theme:
          </span>
          <div className="flex items-center gap-1.5">
            {colors.map((color) => (
              <button
                key={color.hex}
                onClick={() => setAccentColor(color.hex)}
                title={color.name}
                className="relative flex h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                style={{ backgroundColor: color.hex }}
              >
                {resumeData.meta.accentColor === color.hex && (
                  <Check className="h-3.5 w-3.5 font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom & Export Actions */}
        <div className="flex items-center gap-2">
          {/* Zoom Buttons */}
          <div className="flex items-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              title="Zoom Out"
              className="active:bg-zinc-850 hover:bg-zinc-850 cursor-pointer p-2 text-zinc-400 hover:text-zinc-200 disabled:opacity-50"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[40px] px-1 text-center font-mono text-xs font-medium text-zinc-400 select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 1.2}
              title="Zoom In"
              className="active:bg-zinc-850 hover:bg-zinc-850 cursor-pointer p-2 text-zinc-400 hover:text-zinc-200 disabled:opacity-50"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          {/* Export Action */}
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className={`from-accent flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r to-rose-600 px-4.5 py-2.5 text-xs font-medium text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 active:scale-[0.98] disabled:opacity-50`}
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? "Exporting..." : "Download PDF"}</span>
          </button>
        </div>
      </div>

      {/* Main Preview Work Surface */}
      <div className="relative flex flex-1 items-start justify-center overflow-auto bg-zinc-900 p-8">
        {/* Shadow Overlay while Exporting */}
        {isExporting && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <div className="flex max-w-[280px] flex-col items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 text-center shadow-2xl">
              <div className="border-accent h-10 w-10 animate-spin rounded-full border-3 border-t-transparent"></div>
              <div>
                <p className="text-sm font-semibold">Rendering PDF Engine</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Applying dynamic page-slicing spacer grids...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scaled Preview Canvas Wrapper */}
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
          }}
          className="shrink-0 pb-16 transition-transform duration-100 ease-out"
        >
          {/* Exact A4 Boundaries */}
          <div
            id="resume-preview-document"
            className="text-zinc-850 relative box-border min-h-[297mm] w-[210mm] border border-zinc-700/50 bg-white p-[20mm] text-left shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Visual Indicator of A4 page fold (Dashed indicator, not exported by canvas) */}
            <div className="pointer-events-none absolute top-[296.8mm] right-0 left-0 z-10 flex h-0 items-center justify-end border-t border-dashed border-zinc-300 opacity-70 select-none print:hidden">
              <span className="mr-2 flex items-center gap-1 rounded-l-md bg-zinc-200 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase shadow-sm">
                <FileText className="h-3 w-3" /> Page 1 Fold
              </span>
            </div>

            <div className="pointer-events-none absolute top-[593.8mm] right-0 left-0 z-10 flex h-0 items-center justify-end border-t border-dashed border-zinc-300 opacity-70 select-none print:hidden">
              <span className="mr-2 flex items-center gap-1 rounded-l-md bg-zinc-200 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase shadow-sm">
                <FileText className="h-3 w-3" /> Page 2 Fold
              </span>
            </div>

            {/* Template Render Inside Canvas */}
            {activeTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
}
