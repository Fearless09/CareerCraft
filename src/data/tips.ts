export interface Tip {
  id: string;
  category: 'ATS' | 'Formatting' | 'Wording' | 'Preparation' | 'Behavior' | 'FollowUp' | 'Negotiation';
  type: 'do' | 'dont';
  headline: string;
  explanation: string;
  example?: string;
}

export const resumeTips: Tip[] = [
  {
    id: 'res-do-1',
    category: 'ATS',
    type: 'do',
    headline: 'Use ATS-Friendly Formatting',
    explanation: 'Write in single-column layouts with standard serif or sans-serif fonts (like Arial, Calibri, or Times New Roman). Keep headers simple and standard (e.g., "Work Experience" rather than "Professional Highlights").',
    example: 'Use classic standard sections: "Summary", "Experience", "Education", "Skills", "Projects".'
  },
  {
    id: 'res-dont-1',
    category: 'Formatting',
    type: 'dont',
    headline: 'Do Not Use Graphs, Charts, or Text Boxes',
    explanation: 'Applicant Tracking Systems (ATS) scan text from top-to-bottom, left-to-right. Multi-column text boxes, progress rings for skills, and graphic charts often parse as unreadable gibberish, automatically filtering you out.',
    example: 'Avoid resume templates containing skill bar percentage grids or complex background illustrations.'
  },
  {
    id: 'res-do-2',
    category: 'Wording',
    type: 'do',
    headline: 'Quantify Achievements and Impact',
    explanation: 'Every work experience bullet should attempt to highlight numerical business impact. Explain how much money was saved, how much speed was gained, or what percentage conversions lifted.',
    example: '"Architected custom frontend design system, reducing design-to-development turnaround times by 25% across 4 teams."'
  },
  {
    id: 'res-dont-2',
    category: 'Wording',
    type: 'dont',
    headline: 'Avoid Cliché Objective Statements',
    explanation: 'Objective statements explain what *you* want. Replace them with a high-fidelity "Professional Summary" that outlines what value *you bring* to the prospective employer in 3 dense sentences.',
    example: 'Avoid: "Motivated engineer seeking an entry-level developer position to grow my programming skills."'
  },
  {
    id: 'res-do-3',
    category: 'ATS',
    type: 'do',
    headline: 'Tailor Keywords to the Job Description',
    explanation: 'Incorporate specific nouns, frameworks, and skills directly from the target job posting. Mirror the spelling and wording exactly (e.g., if they write "RESTful Web APIs", do not write "REST services").',
  },
  {
    id: 'res-dont-3',
    category: 'Formatting',
    type: 'dont',
    headline: 'Do Not Exceed Two Pages',
    explanation: 'For job seekers with under 5 years of experience, a single page is standard. For senior candidates, two pages is the absolute maximum. Condense irrelevant, outdated, or redundant experience.',
  }
];

export const interviewTips: Tip[] = [
  {
    id: 'int-do-1',
    category: 'Preparation',
    type: 'do',
    headline: 'Research Company News and Products',
    explanation: 'Spend 30 minutes researching the company\'s current news, standard press releases, core business model, and values. Referencing these details during the conversation builds high professional credibility.',
    example: '"I saw you recently announced a transition to serverless cloud environments. That aligns perfectly with my recent work..."'
  },
  {
    id: 'int-dont-1',
    category: 'Behavior',
    type: 'dont',
    headline: 'Do Not Speak Negatively of Past Employers',
    explanation: 'Even if your previous company was toxic, speaking poorly of managers or colleagues signals a lack of professional maturity. Focus instead on seeking new growth challenges.',
    example: 'Say "I am seeking a role with a stronger engineering culture" rather than "My previous boss was highly unorganized."'
  },
  {
    id: 'int-do-2',
    category: 'Behavior',
    type: 'do',
    headline: 'Structure Answers with the STAR Method',
    explanation: 'For behavioral prompts, outline a specific Situation, explain the Task, describe your concrete Action, and quantify the Result. This keeps your answers concise and impact-driven.',
  },
  {
    id: 'int-dont-2',
    category: 'Preparation',
    type: 'dont',
    headline: 'Do Not Arrive Late (or Join Late)',
    explanation: 'Punctuality is your first impression. For video calls, join the lobby exactly 2 minutes early to check camera and microphone settings. For in-person chats, arrive in the building 10 minutes early.',
  },
  {
    id: 'int-do-3',
    category: 'Negotiation',
    type: 'do',
    headline: 'Prepare 3–5 Thoughtful Questions to Ask',
    explanation: 'At the end of the interview, always ask deep questions about product challenges, team culture, or engineering workflows. This displays proactive interest and high curiosity.',
    example: '"How does the engineering team coordinate with product owners to scope technical debt vs new feature builds?"'
  },
  {
    id: 'int-dont-3',
    category: 'FollowUp',
    type: 'dont',
    headline: 'Do Not Forget to Follow Up',
    explanation: 'Failing to send a post-interview email is a missed opportunity. Send a brief, personalized thank-you message to your interviewers within 24 hours of the meeting.',
    example: '"Thank you for your time today. I particularly enjoyed our discussion regarding..."'
  }
];
