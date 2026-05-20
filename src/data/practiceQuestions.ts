export interface PracticeQuestion {
  id: string;
  category: 'General' | 'Behavioral' | 'Situational' | 'Strengths & Weaknesses' | 'Remote Work';
  question: string;
  tip: string;
  modelAnswer: {
    overview: string;
    situation?: string;
    task?: string;
    action?: string;
    result?: string;
    generalAnswer?: string; // For non-behavioral prompts
  };
}

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 'q-1',
    category: 'General',
    question: 'Tell me about yourself.',
    tip: 'Use the "Present-Past-Future" formula. Spend 30% on your current high-impact role, 50% on key past accomplishments, and 20% on why you are excited about this specific opportunity.',
    modelAnswer: {
      overview: 'A premium summary balancing technical stack expertise, metrics, and future career focus.',
      generalAnswer: "I am a Senior Frontend Engineer with over six years of experience specializing in building highly performant web applications using React and Next.js. Currently, at TechCraft Solutions, I lead the core UI engineering team where I architected our responsive design system, which reduced dev turnaround times by 25% across 4 product teams. Before this, I worked at Innovate Labs, where I built real-time WebSocket dashboard widgets that increased user engagement by 30%. I've spent my career focusing on clean typescript architectures and web performance, and I'm excited about this opportunity because your team is solving complex serverless frontend scaling challenges, which aligns perfectly with my recent work."
    }
  },
  {
    id: 'q-2',
    category: 'Behavioral',
    question: 'Describe a time you handled a difficult conflict with a colleague or manager.',
    tip: 'Focus on empathy, objective listening, and collaborative problem-solving. Show how you separated personal emotions from business objectives to reach a productive outcome.',
    modelAnswer: {
      overview: 'STAR model resolving structural engineering conflicts regarding framework migrations.',
      situation: 'During our payment checkout gateway refactoring, the lead QA engineer and I disagreed strongly. They wanted to enforce heavy manual approval steps for every deployment, while I wanted to set up a CI/CD automation pipeline with comprehensive unit test coverage.',
      task: 'We had to ship the payment refactoring within 3 weeks without introducing regression bugs or creating deployment bottlenecks.',
      action: 'I invited the QA engineer to a coffee chat to understand their concerns. They explained that past automated pipelines missed edge cases, leading to major production bugs. I proposed a hybrid solution: we would co-write comprehensive end-to-end integration tests in Cypress, and include a manual QA checklist in the deployment stage for high-risk changes, while automating the rest.',
      result: 'The cypress suite caught 4 critical bugs before release. We shipped the refactored gateway on time with zero production downtime, and our new deployment pipeline cut release cycles from 5 days to 2 hours.'
    }
  },
  {
    id: 'q-3',
    category: 'Situational',
    question: 'What would you do if a manager assigned you a high-priority task when you were already fully loaded?',
    tip: 'Demonstrate proactive prioritization, transparent communication, and data-driven alignment. Do not say "I would work all night to finish it." That signals burnout.',
    modelAnswer: {
      overview: 'Handling workload constraints with structured, collaborative prioritization.',
      generalAnswer: "First, I would document all my active deliverables, complete with estimated hours, current deadlines, and business impacts. Then, I would schedule a brief, 10-minute touchpoint with my manager. I would lay out my current list transparently and say: 'I want to ensure this new high-priority project gets the dedication it deserves. Here is my current schedule. If we prioritize this new task, which of these active deliverables can we delay or delegate?' This helps align on business priorities collaboratively, sets realistic expectations, and ensures overall quality remains high."
    }
  },
  {
    id: 'q-4',
    category: 'Strengths & Weaknesses',
    question: 'What is your greatest professional weakness?',
    tip: 'Choose a real, non-essential technical or professional weakness, and immediately explain the active steps you are taking to improve or mitigate it.',
    modelAnswer: {
      overview: 'Honest self-assessment coupled with active professional development.',
      generalAnswer: "In the past, I sometimes struggled to delegate tasks because I felt that doing it myself was faster. However, as I transitioned into more senior engineering roles, I realized that taking everything on restricted team growth and created bottle-necks. To overcome this, I actively started coaching junior developers on my teams. I set up structured weekly pair-programming slots and created detailed technical scoping templates so I could confidently delegate components. This has not only freed up my time for architectural planning but also accelerated the growth of my peers."
    }
  },
  {
    id: 'q-5',
    category: 'Remote Work',
    question: 'How do you maintain high communication quality and productivity in a remote team?',
    tip: 'Discuss asynchronous communication protocols, structured task trackers, documentation-first principles, and intentional collaboration rituals.',
    modelAnswer: {
      overview: 'Strategies for maximizing collaboration in distributed teams.',
      generalAnswer: "Productive remote work relies on clear, asynchronous communication and extreme documentation hygiene. I ensure that every design decisions, bug thread, or meeting takeaway is documented immediately in Confluence or shared tickets rather than kept in isolated messages. I also utilize Slack statuses and block calendar time to preserve periods of deep focus. To maintain team alignment, I participate actively in daily standups and use Loom recordings to explain code walkthroughs, which saves meeting overhead and keeps our workflow fluid across different time zones."
    }
  },
  {
    id: 'q-6',
    category: 'Behavioral',
    question: 'Tell me about a time you made a major mistake at work and how you handled it.',
    tip: 'Take full ownership immediately. Explain how you communicated transparently, mitigated the negative business impact, and implemented a permanent system safeguard.',
    modelAnswer: {
      overview: 'STAR model recovering from a database configuration deployment error.',
      situation: 'During a Friday afternoon database migration, I accidentally deployed a misconfigured script that locked out 15% of our active client dashboard accounts for about 20 minutes.',
      task: 'I had to restore service immediately, communicate transparently with our support teams, and identify why our pre-deployment staging environment failed to catch the error.',
      action: 'I immediately rolled back the database configuration to the stable checkpoint. Once active, I wrote a post-mortem Slack update to our customer support lead explaining the root cause so they could update impacted clients. Over the weekend, I audited our staging pipelines and discovered that staging didn\'t replicate our production cluster load.',
      result: 'Service was fully restored within 25 minutes. On Monday, I rebuilt our staging sandbox configuration to exactly match production scales, and added a strict mandatory pull-request checklist that blocked any migrations without peer DBA approval. We never had a similar lockout incident again.'
    }
  }
];
