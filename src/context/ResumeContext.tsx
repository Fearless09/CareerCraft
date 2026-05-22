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

const sampleResume: ResumeData = {
  personalInfo: {
    fullName: "Jane Doe",
    jobTitle: "Senior Frontend Engineer",
    email: "jane.doe@example.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    linkedIn: "linkedin.com/in/janedoe",
    website: "janedoe.dev",
    photoUrl: "",
  },
  summary:
    "Passionate Senior Frontend Engineer with 6+ years of experience designing and developing responsive, high-performance web applications. Expertise in React, Next.js, and design systems. Dedicated to delivering premium user experiences and robust, modular UI architecture.",
  experience: [
    {
      id: "exp-1",
      company: "TechCraft Solutions",
      jobTitle: "Senior Frontend Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2023",
      endDate: "Present",
      bullets: [
        "Led migration of core product from legacy framework to Next.js 16, resulting in a 40% improvement in Largest Contentful Paint (LCP) and a 20% lift in core user registration conversion.",
        "Architected a custom responsive React design system utilized by 15+ cross-functional developers, reducing time-to-market for new features by 25%.",
        "Mentored 4 junior and mid-level engineers, fostering best practices in TypeScript, clean code, and accessibility (WCAG 2.1 AA).",
      ],
    },
    {
      id: "exp-2",
      company: "Innovate Labs",
      jobTitle: "Software Engineer II",
      location: "Boston, MA",
      startDate: "Sep 2020",
      endDate: "Dec 2022",
      bullets: [
        "Designed and shipped interactive dashboard modules drawing high-frequency real-time web socket data feeds, boosting client product usage by 30%.",
        "Implemented strict static code analysis and ESLint pipelines, reducing post-deployment frontend regressions by 18%.",
        "Coordinated closely with UI/UX designers to create sleek glassmorphic micro-interaction widgets in React.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startYear: "2016",
      endYear: "2020",
      gpa: "3.8/4.0",
      honours: "Magna Cum Laude",
    },
  ],
  skills: {
    technical: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "HTML5 & CSS3",
      "Git",
      "Webpack",
      "Node.js",
    ],
    soft: [
      "Technical Leadership",
      "Collaboration",
      "Mentorship",
      "Agile Delivery",
      "Problem Solving",
    ],
    languages: ["English (Native)", "Spanish (Conversational)"],
  },
  projects: [
    {
      id: "proj-1",
      name: "CareerCraft App",
      description:
        "Stunning career launchpad featuring an interactive split-screen resume builder, PDF generator, and flashcard practice suite.",
      techStack: [
        "Next.js",
        "React",
        "Tailwind CSS v4",
        "LocalStorage",
        "html2canvas",
      ],
      liveUrl: "careercraft.example.com",
      githubUrl: "github.com/janedoe/careercraft",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services (AWS)",
      year: "2025",
    },
  ],
  additionalSections: [
    {
      id: "add-1",
      title: "Volunteering",
      items: [
        "Volunteer Coding Instructor at local community centers, tutoring 30+ underprivileged high school students in basic HTML, CSS, and JS.",
      ],
    },
  ],
  meta: {
    templateId: "modern",
    accentColor: "#4f46e5", // Indigo
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
