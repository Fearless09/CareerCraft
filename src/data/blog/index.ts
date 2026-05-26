export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "Resume" | "Interview" | "Career" | "Job Search" | "Negotiation";
  publishDate: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image?: string;
  content: string; // Markdown formatted content
}

export const getPostCatColor = (
  cat: "Resume" | "Interview" | "Career" | "Job Search" | "Negotiation",
) => {
  switch (cat) {
    case "Career":
      return "border-accent/15 bg-accent/10 text-accent";
    case "Interview":
      return "border-rose-100 bg-rose-50 text-rose-700";
    case "Job Search":
      return "border-sky-100 bg-sky-50 text-sky-700";
    case "Negotiation":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    case "Resume":
      return "border-indigo-100 bg-indigo-50 text-indigo-700";
    default:
      return "border-primary/15 bg-primary/10 text-primary";
  }
};

// Good, help me generate another professional blog post image (something good for opengraph and seo) for: Salary Negotiation: What to Say (and What Not to Say), Negotiating an offer starts during the first call. Learn standard scripts, market research strategies, and how to evaluate comprehensive packages.

export const blogPosts: BlogPost[] = [
  {
    image: "/blog/resume-mistakes-2026.png",
    slug: "resume-mistakes-2026",
    title: "10 Resume Mistakes That Are Costing You Interviews in 2026",
    excerpt:
      "The hiring landscape has shifted dramatically. Learn why progress bar grids, text boxes, and legacy objectives are filtering you out of major opportunities.",
    category: "Resume",
    publishDate: "May 10, 2026",
    readTime: "6 min read",
    author: {
      name: "Sarah Jenkins",
      role: "Lead Tech Recruiter",
      avatar: "/placeholder.png",
    },
    content: `
# 10 Resume Mistakes That Are Costing You Interviews in 2026

The corporate hiring landscape has undergone major structural shifts. As companies adopt advanced, AI-driven Applicant Tracking Systems (ATS) and focus strictly on verified metrics, legacy resume layouts are failing. 

If you are sending out hundreds of applications and receiving nothing but automated rejections, you are likely falling victim to one of these common pitfalls.

## 1. Graphic Skill Ratings and Progress Bars
Putting charts, circular sliders, or rating bars (e.g., "React: 4/5 stars") looks trendy but is highly counterproductive. ATS scanners cannot parse these graphics. They see empty space or garbled data, meaning your resume gets indexed as having **zero** React experience.

## 2. Text Boxes and Frames
Many modern Canva templates lock contact details or summaries inside separate text box layers. Stacking multiple layers blocks the top-to-bottom reading path of parsing machines. 

## 3. The Obsolete Objective Statement
Recruiters do not care about what the job does for your personal career growth. Replace objective statements with a high-impact **Professional Summary** describing exactly what you bring to the company.

## 4. Lack of Quantified Accomplishments
Never write: *"Responsible for managing the frontend and fixing bugs."*
Instead, write: *"Architected modular components in Next.js, improving Largest Contentful Paint by 40%."*

## 5. Going Beyond Two Pages
Keep your resume tight. For candidates with under 5 years of experience, a single page is standard. For senior candidates, two pages is the absolute limit.
    `,
  },
  {
    image: "/blog/mastering-star-method.png",
    slug: "mastering-star-method",
    title: "The STAR Method: Answering Behavioral Questions Like a Pro",
    excerpt:
      "A comprehensive guide to structuring behavioral interview answers with the STAR framework. Convert vague experiences into impact-driven stories.",
    category: "Interview",
    publishDate: "May 12, 2026",
    readTime: "5 min read",
    author: {
      name: "Marcus Chen",
      role: "Engineering Manager",
      avatar: "/placeholder.png",
    },
    content: `
# The STAR Method: Answering Behavioral Questions Like a Pro

"Tell me about a time you had to deal with a difficult client."
"Describe a project that failed and what you did."

Behavioral prompts can be intimidating. However, they are also your best opportunity to showcase real-world execution. The **STAR** method is a structural framework designed to help you tell clear, concise, and impact-driven stories.

## S - Situation (20% of your answer)
Set the scene. Provide the context. What company were you at? What was the immediate project?
*Example: "At TechCraft, our core payment processor was dropping 3% of transactions during peak traffic hours..."*

## T - Task (10% of your answer)
Explain the specific challenge or task assigned to you in that scenario. What was your personal responsibility?
*Example: "I was assigned to refactor the gateway API endpoints and eliminate database bottlenecks..."*

## A - Action (50% of your answer)
This is the meat of your response. Explain the exact steps *you* took to solve the challenge. Use "I", not "we". Outline your technical design decisions.
*Example: "I profiled SQL queries, refactored database constraints, and set up Redis caching layers..."*

## R - Result (20% of your answer)
Conclude with a quantitative business outcome. Never end a story without a metric!
*Example: "Dropped transactions plummeted to 0.1% and user checkout completion rates climbed by 12% in Q3."*
    `,
  },
  {
    image: "/blog/ats-in-2026-whats-changed.png",
    slug: "ats-in-2026-whats-changed",
    title: "ATS in 2026: What's Changed and How to Beat It",
    excerpt:
      "AI screening engines have become smarter and more prominent. Discover the latest indexing algorithms and how keyword mirroring secures manual reviews.",
    category: "Job Search",
    publishDate: "May 15, 2026",
    readTime: "7 min read",
    author: {
      name: "Elena Rostova",
      role: "HR Systems Architect",
      avatar: "/placeholder.png",
    },
    content: `
# ATS in 2026: What's Changed and How to Beat It

Applicant Tracking Systems (ATS) are no longer simple keyword matching databases. Modern screening systems utilize sophisticated semantic models and machine-learning embeddings to match resume syntax to job profiles.

Here is what has changed in 2026 and how you can optimize your resume to pass these gates.

## 1. Semantic Concept Matching
Older ATS required exact keyword matches (e.g. if the job said "TypeScript", and you wrote "TS", it might fail). 2026 systems understand synonyms, but **mirroring** remains the safest approach. If a job posting lists "RESTful Web APIs", do not write "REST services".

## 2. Contextual Skill Weighting
AI screeners now weigh skills based on how close they are to your latest work experience. Listing "React" under a project from 2018 carries less weight than listing it as a core tech stack in your current 2026 role.

## 3. Plain PDF is Standard
Avoid complex layouts, tables, and images. Modern parsers prefer standard, simple, single-column document hierarchies. Save your document as a clean, text-based PDF or a standard Word Document (.docx).
    `,
  },
  {
    image: "/blog/salary-negotiation-strategies.png",
    slug: "salary-negotiation-strategies",
    title: "Salary Negotiation: What to Say (and What Not to Say)",
    excerpt:
      "Negotiating an offer starts during the first call. Learn standard scripts, market research strategies, and how to evaluate comprehensive packages.",
    category: "Negotiation",
    publishDate: "May 18, 2026",
    readTime: "8 min read",
    author: {
      name: "Sarah Jenkins",
      role: "Lead Tech Recruiter",
      avatar: "/placeholder.png",
    },
    content: `
# Salary Negotiation: What to Say (and What Not to Say)

Receiving a job offer is exciting, but signing the contract without negotiating is a major missed opportunity. Studies show that over 60% of candidates accept the initial figure, leaving thousands of dollars on the table.

## 1. Never Give a Hard Number First
During your first screening call, the recruiter will likely ask: *"What are your salary expectations?"*
Giving a hard number immediately anchors you. If your number is too low, you lose leverage. If it is too high, you might get filtered out.

**What to Say instead:**

> *"I am highly open to a competitive package. Could you share the budgeted salary range for this role?"*

## 2. Anchor on Value, Not Personal Needs
When negotiating, never say: *"I need an extra $10,000 because my rent went up."* Employers do not care about your expenses. Frame your request around market data and the unique technical value you bring.

## 3. Evaluate the Entire Package
Base salary is only one part of compensation. Consider signing bonuses, stock options, health coverage premium matching, and retirement contributions.
    `,
  },
];
