"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
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
  const [resumeData, setResumeData] = useState<ResumeData>(sampleResume); // default to beautiful preseeded sample data
  const [currentStep, setCurrentStepState] = useState<number>(1);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Hydrate states from localStorage on mount
  useEffect(() => {
    const storedData = getStorageItem<ResumeData>(STORAGE_KEY, sampleResume);
    const storedStep = getStorageItem<number>(STEP_STORAGE_KEY, 1);
    setResumeData(storedData);
    setCurrentStepState(storedStep);
    setIsHydrated(true);
  }, []);

  // Sync back to localStorage with simple write debounce
  useEffect(() => {
    if (isHydrated) {
      const handler = setTimeout(() => {
        setStorageItem(STORAGE_KEY, resumeData);
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [resumeData, isHydrated]);

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
