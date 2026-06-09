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
  const {
    data: res,
    isLoading,
    error,
    mutate,
  } = useSWR<{ resume: ResumeData }, Error>("/api/resume", apiRequest);

  const { status } = useSession();
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResume);
  const [currentStep, setCurrentStepState] = useState<number>(1);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // 1. Hydrate states (Authenticated DB fetch or Unauthenticated localStorage)
  useEffect(() => {
    if (status === "loading" || isLoading) return;

    const hydrate = async () => {
      // Step indicator is client-only UI state, load from localStorage
      const storedStep = getStorageItem<number>(STEP_STORAGE_KEY, 1);
      setCurrentStepState(storedStep);

      const localData = getStorageItem<ResumeData>(STORAGE_KEY, emptyResume);

      if (status === "authenticated") {
        try {
          setIsHydrated(false);
          if (error) {
            const msg =
              error instanceof Error
                ? error.message
                : "Failed to fetch resume from database, falling back to local storage:";

            console.error(msg, error);
            setResumeData(localData);
          } else if (res?.resume) {
            // Found database-stored resume, use it
            setResumeData(res.resume);
          } else {
            // No DB resume found. Check if localData holds actual user input and migrate it to DB
            const isLocalModified =
              JSON.stringify(localData) !== JSON.stringify(emptyResume) &&
              JSON.stringify(localData) !== JSON.stringify(sampleResume);

            if (isLocalModified) {
              console.log("Migrating local draft resume to cloud database...");
              await apiRequest<{ success: boolean }>("/api/resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeData: localData }),
              });
              mutate({ resume: localData }, { revalidate: false });
            }
            setResumeData(localData);
          }
        } catch (error) {
          const msg =
            error instanceof Error ? error.message : "Something went wrong";
          console.error(msg, error);
          setResumeData(localData);
        } finally {
          setIsHydrated(true);
        }
      } else {
        // Unauthenticated -> Use localStorage
        setResumeData(localData);
        setIsHydrated(true);
      }
    };

    hydrate();
  }, [status, isLoading]);

  // 2. Debounced sync to database (if authenticated) and local safety net (always)
  // useEffect(() => {
  //   if (!isHydrated) return;

  //   const handler = setTimeout(async () => {
  //     // Always store locally as fallback
  //     setStorageItem(STORAGE_KEY, resumeData);

  //     if (status === "authenticated") {
  //       try {
  //         await apiRequest<{ success: boolean }>("/api/resume", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ resumeData }),
  //         });
  //         mutate({ resume: resumeData }, { revalidate: false });
  //       } catch (error) {
  //         console.error(
  //           "Failed to automatically synchronize resume with DB:",
  //           error,
  //         );
  //       }
  //     }
  //   }, 1000); // 1000ms debounce to prevent database query overhead

  //   return () => clearTimeout(handler);
  // }, [resumeData, isHydrated, status]);

  const syncResume = useCallback(
    (resume: ResumeData) => {
      if (!isHydrated) return;

      // Cancel the previous pending call ✅
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        const update: ResumeData = {
          ...resume,
          meta: { ...resume.meta, lastUpdated: new Date().toISOString() },
        };

        // Always store locally as fallback
        setStorageItem(STORAGE_KEY, update);

        if (status === "authenticated") {
          try {
            await apiRequest<{ success: boolean }>("/api/resume", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ resumeData: update }),
            });
            mutate({ resume: update }, { revalidate: false });
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

      setResumeData(updated);
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

      setResumeData(updated);
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

    setResumeData(updated);
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

      setResumeData(updated);
      setResumeData(updated);
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

      setResumeData(updated);
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

    setResumeData(updated);
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

      setResumeData(updated);
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

      setResumeData(updated);
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

      setResumeData(updated);
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

    setResumeData(updated);
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

      setResumeData(update);
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

      setResumeData(update);
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

    setResumeData(update);
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

      setResumeData(update);
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

      setResumeData(update);
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

      setResumeData(update);
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

      setResumeData(update);
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

      setResumeData(update);
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

      setResumeData(update);
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

      setResumeData(update);
      syncResume(update);
    },
    [resumeData],
  );

  const clearResume = useCallback(() => {
    setResumeData(emptyResume);
    syncResume(emptyResume);
  }, [resumeData]);

  const loadSampleData = useCallback(() => {
    setResumeData(sampleResume);
    syncResume(sampleResume);
  }, [resumeData]);

  return (
    <ResumeContext.Provider
      value={{
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
