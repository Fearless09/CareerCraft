export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  website?: string;
  photoUrl?: string; // base64 encoded photo
}

export interface ExperienceEntry {
  id: string;
  company: string;
  jobTitle: string;
  location?: string;
  startDate: string; // e.g., "Jan 2024"
  endDate: string;   // e.g., "Present" or "Mar 2026"
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string; // string is more flexible for custom text
  endYear: string;
  gpa?: string;
  honours?: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface AdditionalSection {
  id: string;
  title: string;
  items: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  additionalSections: AdditionalSection[];
  meta: {
    templateId: 'classic' | 'modern' | 'minimal';
    accentColor: string; // hex color or standard class
    lastUpdated: string; // ISO date string
  };
}

export interface UserProgress {
  resumeCompletedSections: string[];    // e.g. ["personalInfo", "summary", "experience", "education", "skills"]
  practiceQuestionsAnswered: string[];  // Question IDs practiced
  bookmarkedQuestions: string[];        // Bookmarked Question IDs
  blogArticlesRead: string[];           // Blog article slugs read
  lastVisited: string;                  // ISO string
}
