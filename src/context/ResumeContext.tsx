"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { useSession } from "next-auth/react";
import {
  ResumeData,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
  CertificationEntry,
  AdditionalSection,
  PersonalInfo,
} from "../types/resume";
import { getStorageItem, setStorageItem } from "../lib/localStorage";
import { emptyResume, sampleResume } from "@/data/sampleResume";
import { apiRequest } from "@/lib/utils";
import useSWR from "swr";

interface ResumeContextType {
  isFetchingResume: boolean;
  resumeData: ResumeData;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<ExperienceEntry>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<EducationEntry>) => void;
  removeEducation: (id: string) => void;
  updateSkills: (
    category: "technical" | "soft" | "languages",
    tags: string[],
  ) => void;
  addProject: () => void;
  updateProject: (id: string, data: Partial<ProjectEntry>) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<CertificationEntry>) => void;
  removeCertification: (id: string) => void;
  addAdditionalSection: (title: string) => void;
  updateAdditionalSection: (id: string, items: string[]) => void;
  removeAdditionalSection: (id: string) => void;
  setTemplate: (templateId: "classic" | "modern" | "minimal") => void;
  setAccentColor: (color: string) => void;
  clearResume: () => void;
  loadSampleData: () => void;
}

const STORAGE_KEY = "cc_resume_data";
const STEP_STORAGE_KEY = "cc_last_step";

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { status } = useSession();
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const {
    data: res,
    isLoading,
    mutate,
  } = useSWR<{ resume: ResumeData | null }, Error>("/api/resume", apiRequest, {
    onSuccess: (data) => {
      if (data.resume) {
        setIsHydrated(true);
        return;
      }

      // No DB resume found. Check if localData holds actual user input and migrate it to DB
      const localData = getStorageItem<ResumeData>(STORAGE_KEY, emptyResume);
      mutate({ resume: localData }, { revalidate: false });
      setIsHydrated(true);

      const isLocalModified =
        JSON.stringify(localData) !== JSON.stringify(emptyResume) &&
        JSON.stringify(localData) !== JSON.stringify(sampleResume);

      if (isLocalModified) {
        console.log("Migrating local draft resume to cloud database...");
        apiRequest<{ success: boolean }>("/api/resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeData: localData }),
        }).catch((err) => {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to migrate resume to cloud database";
          console.error(msg, err);
        });
      }
    },
    onError: (error) => {
      const msg =
        error instanceof Error
          ? error.message
          : "Failed to fetch resume from database, falling back to local storage:";
      console.error(msg, error);

      const localData = getStorageItem<ResumeData>(STORAGE_KEY, emptyResume);
      mutate({ resume: localData }, { revalidate: false });
      setIsHydrated(true);
    },
  });

  const resumeData: ResumeData = res?.resume || emptyResume;
  const [currentStep, setCurrentStepState] = useState<number>(1);

  // 1. Hydrate states (Authenticated DB fetch or Unauthenticated localStorage)
  useEffect(() => {
    if (!isHydrated) return;

    // Step indicator is client-only UI state, load from localStorage
    const storedStep = getStorageItem<number>(STEP_STORAGE_KEY, 1);
    setCurrentStepState(storedStep);
  }, [isHydrated]);

  // 2. Debounced sync to database (if authenticated) and local safety net (always)
  const syncResume = useCallback(
    (resume: ResumeData) => {
      if (!isHydrated) return;

      // Cancel the previous pending call ✅
      if (debounceRef.current) clearTimeout(debounceRef.current);
      const update: ResumeData = {
        ...resume,
        meta: { ...resume.meta, lastUpdated: new Date().toISOString() },
      };
      mutate({ resume: update }, { revalidate: false });

      debounceRef.current = setTimeout(async () => {
        // Always store locally as fallback
        setStorageItem(STORAGE_KEY, update);

        if (status === "authenticated") {
          try {
            await apiRequest<{ success: boolean }>("/api/resume", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ resumeData: update }),
            });
          } catch (error) {
            console.error(
              "Failed to automatically synchronize resume with DB:",
              error,
            );
          }
        }
      }, 1000);
    },
    [isHydrated, status],
  );

  const setCurrentStep = useCallback((step: number) => {
    setCurrentStepState(step);
    setStorageItem(STEP_STORAGE_KEY, step);
  }, []);

  const updatePersonalInfo = useCallback(
    (info: Partial<PersonalInfo>) => {
      const updated: ResumeData = {
        ...resumeData,
        personalInfo: { ...resumeData.personalInfo, ...info },
      };
      syncResume(updated);
    },
    [resumeData],
  );

  const updateSummary = useCallback(
    (summary: string) => {
      if (summary === resumeData.summary) return;
      const updated: ResumeData = {
        ...resumeData,
        summary,
      };
      syncResume(updated);
    },
    [resumeData],
  );

  // repeatable Experience handlers
  const addExperience = useCallback(() => {
    const newEntry: ExperienceEntry = {
      id: `exp-${Math.random().toString(36).substring(2, 9)}`,
      company: "",
      jobTitle: "",
      location: "",
      startDate: "",
      endDate: "",
      bullets: [""],
    };
    const updated: ResumeData = {
      ...resumeData,
      experience: [...resumeData.experience, newEntry],
    };
    syncResume(updated);
  }, [resumeData]);

  const updateExperience = useCallback(
    (id: string, data: Partial<ExperienceEntry>) => {
      const updated: ResumeData = {
        ...resumeData,
        experience: resumeData.experience.map((item) =>
          item.id === id ? { ...item, ...data } : item,
        ),
      };
      syncResume(updated);
    },
    [resumeData],
  );

  const removeExperience = useCallback(
    (id: string) => {
      const findExperience = resumeData.experience.find((e) => e.id === id);
      if (!findExperience) return;

      const updated: ResumeData = {
        ...resumeData,
        experience: resumeData.experience.filter((item) => item.id !== id),
      };
      syncResume(updated);
    },
    [resumeData],
  );

  // repeatable Education handlers
  const addEducation = useCallback(() => {
    const newEntry: EducationEntry = {
      id: `edu-${Math.random().toString(36).substring(2, 9)}`,
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startYear: "",
      endYear: "",
    };
    const updated: ResumeData = {
      ...resumeData,
      education: [...resumeData.education, newEntry],
    };
    syncResume(updated);
  }, [resumeData]);

  const updateEducation = useCallback(
    (id: string, data: Partial<EducationEntry>) => {
      const findEductaion = resumeData.education.find((e) => e.id === id);
      if (!findEductaion) return;

      const updated: ResumeData = {
        ...resumeData,
        education: resumeData.education.map((item) =>
          item.id === id ? { ...item, ...data } : item,
        ),
      };
      syncResume(updated);
    },
    [resumeData],
  );

  const removeEducation = useCallback(
    (id: string) => {
      const findEductaion = resumeData.education.find((e) => e.id === id);
      if (!findEductaion) return;

      const updated: ResumeData = {
        ...resumeData,
        education: resumeData.education.filter((item) => item.id !== id),
      };
      syncResume(updated);
    },
    [resumeData],
  );

  // tag-based skills handler
  const updateSkills = useCallback(
    (category: keyof ResumeData["skills"], tags: string[]) => {
      const isSameArr =
        resumeData.skills[category].length === tags.length &&
        resumeData.skills[category].every((val, idx) => val === tags[idx]);
      if (isSameArr) return;

      const updated: ResumeData = {
        ...resumeData,
        skills: { ...resumeData.skills, [category]: tags },
      };
      syncResume(updated);
    },
    [resumeData],
  );

  // repeatable Projects handlers
  const addProject = useCallback(() => {
    const newEntry: ProjectEntry = {
      id: `proj-${Math.random().toString(36).substring(2, 9)}`,
      name: "",
      description: "",
      techStack: [],
    };
    const updated: ResumeData = {
      ...resumeData,
      projects: [...resumeData.projects, newEntry],
    };
    syncResume(updated);
  }, [resumeData]);

  const updateProject = useCallback(
    (id: string, data: Partial<ProjectEntry>) => {
      const findProject = resumeData.projects.find((p) => p.id === id);
      if (!findProject) return;

      const update: ResumeData = {
        ...resumeData,
        projects: resumeData.projects.map((p) =>
          p.id === id ? { ...p, ...data } : p,
        ),
      };
      syncResume(update);
    },
    [resumeData],
  );

  const removeProject = useCallback(
    (id: string) => {
      const findProject = resumeData.projects.find((p) => p.id === id);
      if (!findProject) return;

      const update: ResumeData = {
        ...resumeData,
        projects: resumeData.projects.filter((p) => p.id !== id),
      };
      syncResume(update);
    },
    [resumeData],
  );

  // repeatable Certifications handlers
  const addCertification = useCallback(() => {
    const newEntry: CertificationEntry = {
      id: `cert-${Math.random().toString(36).substring(2, 9)}`,
      name: "",
      issuer: "",
      year: "",
    };
    const update: ResumeData = {
      ...resumeData,
      certifications: [...resumeData.certifications, newEntry],
    };
    syncResume(update);
  }, [resumeData]);

  const updateCertification = useCallback(
    (id: string, data: Partial<CertificationEntry>) => {
      const findCert = resumeData.certifications.find((c) => c.id === id);
      if (!findCert) return;

      const update: ResumeData = {
        ...resumeData,
        certifications: resumeData.certifications.map((c) =>
          c.id === id ? { ...c, ...data } : c,
        ),
      };
      syncResume(update);
    },
    [resumeData],
  );

  const removeCertification = useCallback(
    (id: string) => {
      const findCert = resumeData.certifications.find((c) => c.id === id);
      if (!findCert) return;

      const update: ResumeData = {
        ...resumeData,
        certifications: resumeData.certifications.filter((c) => c.id !== id),
      };
      syncResume(update);
    },
    [resumeData],
  );

  // Additional sections
  const addAdditionalSection = useCallback(
    (title: string) => {
      const newSection: AdditionalSection = {
        id: `add-${Math.random().toString(36).substring(2, 9)}`,
        title,
        items: [""],
      };
      const update: ResumeData = {
        ...resumeData,
        additionalSections: [...resumeData.additionalSections, newSection],
      };
      syncResume(update);
    },
    [resumeData],
  );

  const updateAdditionalSection = useCallback(
    (id: string, items: string[]) => {
      const findAddSect = resumeData.additionalSections.find(
        (a) => a.id === id,
      );
      if (!findAddSect) return;

      const update: ResumeData = {
        ...resumeData,
        additionalSections: resumeData.additionalSections.map((a) =>
          a.id === id ? { ...a, items } : a,
        ),
      };
      syncResume(update);
    },
    [resumeData],
  );

  const removeAdditionalSection = useCallback(
    (id: string) => {
      const findAddSect = resumeData.additionalSections.find(
        (a) => a.id === id,
      );
      if (!findAddSect) return;

      const update: ResumeData = {
        ...resumeData,
        additionalSections: resumeData.additionalSections.filter(
          (a) => a.id !== id,
        ),
      };
      syncResume(update);
    },
    [resumeData],
  );

  const setTemplate = useCallback(
    (templateId: ResumeData["meta"]["templateId"]) => {
      if (resumeData.meta.templateId === templateId) return;

      const update: ResumeData = {
        ...resumeData,
        meta: { ...resumeData.meta, templateId },
      };
      syncResume(update);
    },
    [resumeData],
  );

  const setAccentColor = useCallback(
    (accentColor: string) => {
      if (resumeData.meta.accentColor === accentColor) return;

      const update: ResumeData = {
        ...resumeData,
        meta: { ...resumeData.meta, accentColor },
      };
      syncResume(update);
    },
    [resumeData],
  );

  const clearResume = useCallback(() => {
    syncResume(emptyResume);
  }, [resumeData]);

  const loadSampleData = useCallback(() => {
    syncResume(sampleResume);
  }, [resumeData]);

  return (
    <ResumeContext.Provider
      value={{
        isFetchingResume: isLoading,
        resumeData,
        currentStep,
        setCurrentStep,
        updatePersonalInfo,
        updateSummary,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        updateSkills,
        addProject,
        updateProject,
        removeProject,
        addCertification,
        updateCertification,
        removeCertification,
        addAdditionalSection,
        updateAdditionalSection,
        removeAdditionalSection,
        setTemplate,
        setAccentColor,
        clearResume,
        loadSampleData,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
