"use client";

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
import { cn } from "@/lib/utils";
import { Loader } from "@/components/shared/Loader";

export default function GeneratorPage() {
  const {
    currentStep,
    setCurrentStep,
    clearResume,
    loadSampleData,
    isFetchingResume,
  } = useResume();
  const { mobilePreviewActive, setMobilePreviewActive, addToast } = useUI();

  if (isFetchingResume) {
    return (
      <section
        id="intializing"
        className="flex min-h-120 flex-1 flex-col items-center justify-center gap-3 bg-zinc-950 text-zinc-400"
      >
        <Loader length={12} />
        <p className="text-xs font-semibold tracking-widest uppercase">
          Initializing CareerCraft Workspace...
        </p>
      </section>
    );
  }

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

  const progressPercent = (currentStep / 8) * 100;

  return (
    <section className="flex flex-1 flex-col bg-zinc-950">
      {/* Mobile Sticky Tab Control Header */}
      <header
        id="mobile-tabs"
        className="sticky top-15 z-10 grid grid-cols-2 border-b border-zinc-900 bg-zinc-950 md:hidden"
      >
        {tabs.map((t) => (
          <button
            key={t.name}
            onClick={() => {
              if (t.preview === mobilePreviewActive) return;
              setMobilePreviewActive(t.preview);
            }}
            className={cn(
              `transition-300 flex cursor-pointer items-center justify-center gap-1.5 border-b-2 border-transparent py-4 text-xs font-semibold tracking-wider text-zinc-400 uppercase`,
              {
                "border-accent bg-zinc-900/50 text-zinc-100":
                  t.preview === mobilePreviewActive,
              },
            )}
          >
            <t.icon className="size-3.5" />
            <span>{t.name}</span>
          </button>
        ))}
      </header>

      {/* Main Builder Container Workspace */}
      <section className="grid flex-1 grid-cols-1 overflow-clip md:h-[calc(100dvh-76px)] md:flex-none md:grid-cols-[45%_55%]">
        {/* Left Side Editor Form Console */}
        <main
          className={cn(`flex flex-col overflow-y-auto bg-zinc-950`, {
            "hidden md:flex": mobilePreviewActive,
          })}
        >
          {/* Step Track Indicator */}
          <main
            id="steps-indicator"
            className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950 p-5 pb-4 md:pt-10"
          >
            <div className="mb-3 flex items-center justify-between text-zinc-400">
              <div className="flex items-center gap-1">
                <Sparkles className="text-accent size-4 animate-pulse" />
                <span className="text-[11px] font-bold tracking-widest uppercase">
                  Step {currentStep} of {steps.length}
                </span>
              </div>

              <span className="font-mono text-[11px] font-medium text-zinc-500">
                {Math.round(progressPercent)}% Compiled
              </span>
            </div>

            {/* Horizontal Step Slider Icons */}
            <div
              id="steps"
              className="mb-4 flex scrollbar-none items-center justify-around gap-1 py-1"
            >
              {steps.map((s) => {
                const Icon = s.icon;
                const isCompleted = currentStep > s.id;
                const isActive = currentStep === s.id;

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (s.id === currentStep) return;
                      setCurrentStep(s.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    title={s.label}
                    className={cn(
                      `transition-300 flex size-7.5 shrink-0 cursor-pointer items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-600 hover:text-zinc-400`,
                      {
                        "bg-accent shadow-accent/20 scale-110 text-white shadow-lg hover:text-white":
                          isActive,
                        "border border-emerald-800/75 bg-emerald-900/75 text-emerald-400 hover:text-emerald-400":
                          isCompleted,
                      },
                    )}
                  >
                    <Icon className="size-4" />
                  </button>
                );
              })}
            </div>

            {/* Stepper Progress Bar */}
            <div
              id="progress-bar"
              className="h-1 w-full overflow-hidden rounded-full bg-zinc-900"
            >
              <div
                className="from-accent transition-300 h-full max-w-full bg-linear-to-r to-rose-600"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </main>

          {/* Form Content Wrapper */}
          <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6 md:mt-3">
            {renderActiveStepForm(currentStep)}
          </main>

          {/* Stepper Footer Console Bar */}
          <main
            id="form-action-btns"
            className="sticky bottom-0 z-10 flex items-center justify-between border-t border-zinc-800 bg-zinc-950 px-5 py-4"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearDraft}
                title="Reset Form"
                className="transition-300 shrink-0 cursor-pointer rounded-xl p-2.5 text-zinc-500 hover:bg-zinc-900 hover:text-red-400"
              >
                <RotateCcw className="size-4" />
              </button>

              <button
                onClick={handleLoadSample}
                title="Preseed Sample Draft"
                className="transition-300 flex cursor-pointer items-center gap-1.5 rounded-xl border border-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-500 hover:border-zinc-700 hover:text-zinc-200"
              >
                <RefreshCw className="size-3.5" />
                <span className="hidden sm:inline">Preseed Sample</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="transition-30 flex cursor-pointer items-center gap-1.5 rounded-xl border border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:border-zinc-700 disabled:pointer-events-none disabled:opacity-50"
              >
                <ArrowLeft className="size-3.5" />
                <span>Prev</span>
              </button>

              {currentStep < steps.length ? (
                <button
                  onClick={handleNextStep}
                  className="transition-300 flex cursor-pointer items-center gap-1.5 rounded-xl bg-zinc-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-700"
                >
                  <span>Next</span>
                  <ArrowRight className="size-3.5" />
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
                  className="from-accent hover:shadow-accent/10 transition-300 flex cursor-pointer items-center gap-1.5 rounded-xl bg-linear-to-r to-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-120 active:scale-95"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Finalize & Preview</span>
                </button>
              )}
            </div>
          </main>
        </main>

        {/* Right Side Sticky Preview Screen Pane */}
        <main
          id="resume-preview"
          className={cn(`hidden overflow-y-auto md:block`, {
            block: mobilePreviewActive,
          })}
        >
          <PreviewContainer />
        </main>
      </section>
    </section>
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

const tabs = [
  {
    preview: false,
    icon: Edit3,
    name: "Editor Forms",
  },
  { preview: true, icon: Eye, name: "Live Preview" },
];

const renderActiveStepForm = (currentStep: number) => {
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
