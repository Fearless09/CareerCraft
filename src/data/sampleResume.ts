import { ResumeData } from "@/types/resume";

export const emptyResume: ResumeData = {
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

const sampleResume1: ResumeData = {
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

const sampleResume2: ResumeData = {
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
    {
      id: "exp-3",
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
    {
      id: "exp-4",
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
    {
      id: "exp-5",
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
    {
      id: "exp-6",
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
    {
      id: "exp-7",
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
    {
      id: "exp-8",
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
    {
      id: "edu-2",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startYear: "2016",
      endYear: "2020",
      gpa: "3.8/4.0",
      honours: "Magna Cum Laude",
    },
    {
      id: "edu-3",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startYear: "2016",
      endYear: "2020",
      gpa: "3.8/4.0",
      honours: "Magna Cum Laude",
    },
    {
      id: "edu-4",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startYear: "2016",
      endYear: "2020",
      gpa: "3.8/4.0",
      honours: "Magna Cum Laude",
    },
    {
      id: "edu-5",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startYear: "2016",
      endYear: "2020",
      gpa: "3.8/4.0",
      honours: "Magna Cum Laude",
    },
    {
      id: "edu-6",
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
    {
      id: "proj-2",
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
    {
      id: "proj-3",
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
    {
      id: "proj-4",
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
    {
      id: "proj-5",
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
    {
      id: "proj-6",
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
    {
      id: "cert-2",
      name: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services (AWS)",
      year: "2025",
    },
    {
      id: "cert-3",
      name: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services (AWS)",
      year: "2025",
    },
    {
      id: "cert-4",
      name: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services (AWS)",
      year: "2025",
    },
    {
      id: "cert-5",
      name: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services (AWS)",
      year: "2025",
    },
    {
      id: "cert-6",
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
    {
      id: "add-2",
      title: "Volunteering",
      items: [
        "Volunteer Coding Instructor at local community centers, tutoring 30+ underprivileged high school students in basic HTML, CSS, and JS.",
      ],
    },
    {
      id: "add-3",
      title: "Volunteering",
      items: [
        "Volunteer Coding Instructor at local community centers, tutoring 30+ underprivileged high school students in basic HTML, CSS, and JS.",
      ],
    },
    {
      id: "add-4",
      title: "Volunteering",
      items: [
        "Volunteer Coding Instructor at local community centers, tutoring 30+ underprivileged high school students in basic HTML, CSS, and JS.",
      ],
    },
    {
      id: "add-5",
      title: "Volunteering",
      items: [
        "Volunteer Coding Instructor at local community centers, tutoring 30+ underprivileged high school students in basic HTML, CSS, and JS.",
      ],
    },
    {
      id: "add-6",
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

export const sampleResume = sampleResume1;
