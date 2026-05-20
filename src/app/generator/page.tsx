"use client";

import { useState, useEffect } from "react";
import { useUI } from "@/context/UIContext";
import PreviewContainer from "@/components/generator/ResumePreview/PreviewContainer";
import PersonalInfoSection from "@/components/generator/ResumeForm/PersonalInfoSection";
import SummarySection from "@/components/generator/ResumeForm/SummarySection";
import ExperienceSection from "@/components/generator/ResumeForm/ExperienceSection";
import EducationSection from "@/components/generator/ResumeForm/EducationSection";
import SkillsSection from "@/components/generator/ResumeForm/SkillsSection";
import ProjectsSection from "@/components/generator/ResumeForm/ProjectsSection";
import CertificationsSection from "@/components/generator/ResumeForm/CertificationsSection";
import AdditionalSections from "@/components/generator/ResumeForm/AdditionalSections";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Edit3,
  Sparkles,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Cpu,
  FolderGit2,
  Award,
  FilePlus2,
} from "lucide-react";
import { useResume } from "@/context";

export default function GeneratorPage() {
  const { currentStep, setCurrentStep, clearResume, loadSampleData, isDirty } =
    useResume();

  const { mobilePreviewActive, setMobilePreviewActive, addToast } = useUI();

  const [mounted, setMounted] = useState(false);

  // Mount check for safe hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="border-accent h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
          <p className="text-xs font-semibold tracking-widest uppercase">
            Initializing CareerCraft Workspace...
          </p>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, label: "Profile", icon: User },
    { id: 2, label: "Summary", icon: FileText },
    { id: 3, label: "Experience", icon: Briefcase },
    { id: 4, label: "Education", icon: GraduationCap },
    { id: 5, label: "Skills", icon: Cpu },
    { id: 6, label: "Projects", icon: FolderGit2 },
    { id: 7, label: "Certificates", icon: Award },
    { id: 8, label: "Custom", icon: FilePlus2 },
  ];

  const handleNextStep = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClearDraft = () => {
    if (
      window.confirm(
        "Are you sure you want to clear your current resume data? This action cannot be undone.",
      )
    ) {
      clearResume();
      addToast("Resume draft cleared.", "info");
    }
  };

  const handleLoadSample = () => {
    loadSampleData();
    addToast("Professional sample resume preseeded successfully!", "success");
  };

  const renderActiveStepForm = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoSection />;
      case 2:
        return <SummarySection />;
      case 3:
        return <ExperienceSection />;
      case 4:
        return <EducationSection />;
      case 5:
        return <SkillsSection />;
      case 6:
        return <ProjectsSection />;
      case 7:
        return <CertificationsSection />;
      case 8:
        return <AdditionalSections />;
      default:
        return <PersonalInfoSection />;
    }
  };

  const progressPercent = (currentStep / 8) * 100;

  return (
    <div className="flex flex-1 flex-col bg-zinc-950">
      {/* Mobile Sticky Tab Control Header */}
      <div className="sticky top-[60px] z-10 flex border-b border-zinc-900 bg-zinc-950 md:hidden">
        <button
          onClick={() => setMobilePreviewActive(false)}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 border-b-2 py-3 text-xs font-semibold tracking-wider uppercase transition ${
            !mobilePreviewActive
              ? "border-accent bg-zinc-900/50 text-zinc-100"
              : "border-transparent text-zinc-500"
          }`}
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Editor Forms</span>
        </button>
        <button
          onClick={() => setMobilePreviewActive(true)}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 border-b-2 py-3 text-xs font-semibold tracking-wider uppercase transition ${
            mobilePreviewActive
              ? "border-accent bg-zinc-900/50 text-zinc-100"
              : "border-transparent text-zinc-500"
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Live Preview</span>
        </button>
      </div>

      {/* Main Builder Container Workspace */}
      <div className="grid min-h-[calc(100vh-130px)] flex-1 grid-cols-1 md:grid-cols-[45%_55%]">
        {/* Left Side Editor Form Console */}
        <div
          className={`flex flex-col overflow-y-auto bg-zinc-950 ${mobilePreviewActive ? "hidden md:flex" : "flex"}`}
        >
          {/* Step Track Indicator */}
          <div className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950 px-6 pt-5 pb-4 md:top-[76px]">
            <div className="mb-3 flex items-center justify-between text-zinc-400">
              <div className="flex items-center gap-1">
                <Sparkles className="text-accent h-4 w-4 animate-pulse" />
                <span className="text-[11px] font-bold tracking-widest uppercase">
                  Step {currentStep} of 8
                </span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">
                {Math.round(progressPercent)}% Compiled
              </span>
            </div>

            {/* Horizontal Step Slider Icons */}
            <div className="mb-4 flex scrollbar-none items-center justify-between gap-1 overflow-x-auto py-1">
              {steps.map((s) => {
                const Icon = s.icon;
                const isCompleted = currentStep > s.id;
                const isActive = currentStep === s.id;

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentStep(s.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    title={s.label}
                    className={`flex h-7.5 w-7.5 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all ${
                      isActive
                        ? "bg-accent shadow-accent/20 scale-110 text-white shadow-lg"
                        : isCompleted
                          ? "border border-zinc-700 bg-zinc-800 text-emerald-400"
                          : "border-zinc-850 text-zinc-650 hover:text-zinc-450 border bg-zinc-900"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                );
              })}
            </div>

            {/* Stepper Progress Bar */}
            <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-900">
              <div
                className="from-accent h-full bg-gradient-to-r to-rose-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Form Content Wrapper */}
          <div className="mx-auto w-full max-w-2xl flex-1 p-6">
            {renderActiveStepForm()}
          </div>

          {/* Stepper Footer Console Bar */}
          <div className="sticky bottom-0 z-10 flex items-center justify-between border-t border-zinc-900 bg-zinc-950 p-6">
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearDraft}
                title="Reset Form"
                className="cursor-pointer rounded-xl p-2.5 text-zinc-500 transition hover:bg-zinc-900 hover:text-red-400"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={handleLoadSample}
                title="Preseed Sample Draft"
                className="text-zinc-450 border-zinc-850 flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition hover:border-zinc-700 hover:text-zinc-200"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Preseed Sample</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>

              {currentStep < 8 ? (
                <button
                  onClick={handleNextStep}
                  className="hover:bg-zinc-750 flex cursor-pointer items-center gap-1.5 rounded-xl bg-zinc-800 px-5 py-2.5 text-xs font-semibold text-white transition"
                >
                  <span>Next</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobilePreviewActive(true);
                    addToast(
                      'All steps finalized! Click "Download PDF" to export.',
                      "success",
                    );
                  }}
                  className="from-accent hover:shadow-accent/10 flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r to-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg transition hover:brightness-110 active:scale-95"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Finalize & Preview</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Sticky Preview Screen Pane */}
        <div
          className={`overflow-y-auto ${!mobilePreviewActive ? "hidden md:block" : "block"}`}
        >
          <PreviewContainer />
        </div>
      </div>
    </div>
  );
}
