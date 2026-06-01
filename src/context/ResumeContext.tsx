"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
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
import { sampleResume } from "@/data/sampleResume";
import { apiRequest } from "@/lib/utils";
import useSWR from "swr";

interface ResumeContextType {
  resumeData: ResumeData;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isDirty: boolean;
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

const emptyResume: ResumeData = {
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    website: "",
    photoUrl: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
  },
  projects: [],
  certifications: [],
  additionalSections: [],
  meta: {
    templateId: "classic",
    accentColor: "#1e3a8a", // Default dark navy
    lastUpdated: new Date().toISOString(),
  },
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const {
    data: res,
    isLoading,
    error,
    mutate,
  } = useSWR<{ resume: ResumeData }, Error>("/api/resume", apiRequest);

  const { status } = useSession();
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResume);
  const [currentStep, setCurrentStepState] = useState<number>(1);
  const [isDirty, setIsDirty] = useState<boolean>(false);
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
  useEffect(() => {
    if (!isHydrated) return;

    const handler = setTimeout(async () => {
      // Always store locally as fallback
      setStorageItem(STORAGE_KEY, resumeData);

      if (status === "authenticated") {
        try {
          await apiRequest<{ success: boolean }>("/api/resume", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resumeData }),
          });
          mutate({ resume: resumeData }, { revalidate: false });
        } catch (error) {
          console.error(
            "Failed to automatically synchronize resume with DB:",
            error,
          );
        }
      }
    }, 1000); // 1000ms debounce to prevent database query overhead

    return () => clearTimeout(handler);
  }, [resumeData, isHydrated, status]);

  const setCurrentStep = useCallback((step: number) => {
    setCurrentStepState(step);
    setStorageItem(STEP_STORAGE_KEY, step);
  }, []);

  const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
      meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
    }));
    setIsDirty(true);
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setResumeData((prev) => ({
      ...prev,
      summary,
      meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
    }));
    setIsDirty(true);
  }, []);

  // repeatable Experience handlers
  const addExperience = useCallback(() => {
    setResumeData((prev) => {
      const newEntry: ExperienceEntry = {
        id: `exp-${Math.random().toString(36).substring(2, 9)}`,
        company: "",
        jobTitle: "",
        location: "",
        startDate: "",
        endDate: "",
        bullets: [""],
      };
      return {
        ...prev,
        experience: [...prev.experience, newEntry],
        meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
      };
    });
    setIsDirty(true);
  }, []);

  const updateExperience = useCallback(
    (id: string, data: Partial<ExperienceEntry>) => {
      setResumeData((prev) => ({
        ...prev,
        experience: prev.experience.map((item) =>
          item.id === id ? { ...item, ...data } : item,
        ),
        meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
      }));
      setIsDirty(true);
    },
    [],
  );

  const removeExperience = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
      meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
    }));
    setIsDirty(true);
  }, []);

  // repeatable Education handlers
  const addEducation = useCallback(() => {
    setResumeData((prev) => {
      const newEntry: EducationEntry = {
        id: `edu-${Math.random().toString(36).substring(2, 9)}`,
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
      };
      return {
        ...prev,
        education: [...prev.education, newEntry],
        meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
      };
    });
    setIsDirty(true);
  }, []);

  const updateEducation = useCallback(
    (id: string, data: Partial<EducationEntry>) => {
      setResumeData((prev) => ({
        ...prev,
        education: prev.education.map((item) =>
          item.id === id ? { ...item, ...data } : item,
        ),
        meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
      }));
      setIsDirty(true);
    },
    [],
  );

  const removeEducation = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
      meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
    }));
    setIsDirty(true);
  }, []);

  // tag-based skills handler
  const updateSkills = useCallback(
    (category: keyof ResumeData["skills"], tags: string[]) => {
      setResumeData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: tags,
        },
        meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
      }));
      setIsDirty(true);
    },
    [],
  );

  // repeatable Projects handlers
  const addProject = useCallback(() => {
    setResumeData((prev) => {
      const newEntry: ProjectEntry = {
        id: `proj-${Math.random().toString(36).substring(2, 9)}`,
        name: "",
        description: "",
        techStack: [],
      };
      return {
        ...prev,
        projects: [...prev.projects, newEntry],
        meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
      };
    });
    setIsDirty(true);
  }, []);

  const updateProject = useCallback(
    (id: string, data: Partial<ProjectEntry>) => {
      setResumeData((prev) => ({
        ...prev,
        projects: prev.projects.map((item) =>
          item.id === id ? { ...item, ...data } : item,
        ),
        meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
      }));
      setIsDirty(true);
    },
    [],
  );

  const removeProject = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
      meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
    }));
    setIsDirty(true);
  }, []);

  // repeatable Certifications handlers
  const addCertification = useCallback(() => {
    setResumeData((prev) => {
      const newEntry: CertificationEntry = {
        id: `cert-${Math.random().toString(36).substring(2, 9)}`,
        name: "",
        issuer: "",
        year: "",
      };
      return {
        ...prev,
        certifications: [...prev.certifications, newEntry],
        meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
      };
    });
    setIsDirty(true);
  }, []);

  const updateCertification = useCallback(
    (id: string, data: Partial<CertificationEntry>) => {
      setResumeData((prev) => ({
        ...prev,
        certifications: prev.certifications.map((item) =>
          item.id === id ? { ...item, ...data } : item,
        ),
        meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
      }));
      setIsDirty(true);
    },
    [],
  );

  const removeCertification = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((item) => item.id !== id),
      meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
    }));
    setIsDirty(true);
  }, []);

  // Additional sections
  const addAdditionalSection = useCallback((title: string) => {
    setResumeData((prev) => {
      const newSection: AdditionalSection = {
        id: `add-${Math.random().toString(36).substring(2, 9)}`,
        title,
        items: [""],
      };
      return {
        ...prev,
        additionalSections: [...prev.additionalSections, newSection],
        meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
      };
    });
    setIsDirty(true);
  }, []);

  const updateAdditionalSection = useCallback((id: string, items: string[]) => {
    setResumeData((prev) => ({
      ...prev,
      additionalSections: prev.additionalSections.map((sect) =>
        sect.id === id ? { ...sect, items } : sect,
      ),
      meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
    }));
    setIsDirty(true);
  }, []);

  const removeAdditionalSection = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      additionalSections: prev.additionalSections.filter(
        (sect) => sect.id !== id,
      ),
      meta: { ...prev.meta, lastUpdated: new Date().toISOString() },
    }));
    setIsDirty(true);
  }, []);

  const setTemplate = useCallback(
    (templateId: "classic" | "modern" | "minimal") => {
      setResumeData((prev) => ({
        ...prev,
        meta: { ...prev.meta, templateId },
      }));
      setIsDirty(true);
    },
    [],
  );

  const setAccentColor = useCallback((accentColor: string) => {
    setResumeData((prev) => ({
      ...prev,
      meta: { ...prev.meta, accentColor },
    }));
    setIsDirty(true);
  }, []);

  const clearResume = useCallback(() => {
    setResumeData(emptyResume);
    setIsDirty(true);
  }, []);

  const loadSampleData = useCallback(() => {
    setResumeData(sampleResume);
    setIsDirty(true);
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        currentStep,
        setCurrentStep,
        isDirty,
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
