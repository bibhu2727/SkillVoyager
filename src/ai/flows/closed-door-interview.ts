import { z } from 'zod';
import { AIInterviewer } from '@/lib/ai-interviewers';

// Input schema for the closed-door interview flow
export const ClosedDoorInterviewInputSchema = z.object({
  interviewerId: z.string().describe('The ID of the AI interviewer conducting the session'),
  candidateResponse: z.string().optional().describe('The candidate\'s response to the previous question'),
  questionIndex: z.number().describe('Current question number in the interview'),
  interviewType: z.enum(['technical', 'behavioral', 'mixed']).describe('Type of interview focus'),
  candidateProfile: z.object({
    name: z.string().optional(),
    position: z.string().describe('Position being interviewed for'),
    experience: z.string().describe('Years of experience or level'),
    skills: z.array(z.string()).describe('Key skills and technologies'),
    industry: z.string().describe('Industry or domain')
  }).describe('Candidate background information'),
  sessionContext: z.object({
    previousQuestions: z.array(z.string()).describe('Questions asked so far'),
    candidateResponses: z.array(z.string()).describe('Candidate\'s previous responses'),
    performanceMetrics: z.object({
      clarity: z.number().min(0).max(100),
      confidence: z.number().min(0).max(100),
      relevance: z.number().min(0).max(100),
      technicalAccuracy: z.number().min(0).max(100)
    }).optional().describe('Current performance metrics')
  }).describe('Interview session context')
});

// Output schema for the interview response
export const ClosedDoorInterviewOutputSchema = z.object({
  nextQuestion: z.string().describe('The next question to ask the candidate'),
  questionType: z.enum(['technical', 'behavioral', 'problem_solving', 'situational', 'follow_up']).describe('Type of the next question'),
  interviewerResponse: z.string().describe('Interviewer\'s response to the candidate\'s previous answer'),
  feedback: z.object({
    strengths: z.array(z.string()).describe('Positive aspects of the candidate\'s response'),
    improvements: z.array(z.string()).describe('Areas for improvement'),
    score: z.number().min(0).max(100).describe('Score for the response (0-100)')
  }).optional().describe('Feedback on the candidate\'s response'),
  interviewProgress: z.object({
    currentPhase: z.enum(['introduction', 'technical', 'behavioral', 'problem_solving', 'closing']).describe('Current interview phase'),
    completionPercentage: z.number().min(0).max(100).describe('Interview completion percentage'),
    estimatedTimeRemaining: z.number().describe('Estimated minutes remaining')
  }).describe('Interview progress information'),
  interviewerMood: z.enum(['encouraging', 'neutral', 'challenging', 'impressed', 'concerned']).describe('Interviewer\'s current mood/tone'),
  shouldContinue: z.boolean().describe('Whether the interview should continue or wrap up')
});

export type ClosedDoorInterviewInput = z.infer<typeof ClosedDoorInterviewInputSchema>;
export type ClosedDoorInterviewOutput = z.infer<typeof ClosedDoorInterviewOutputSchema>;

// Interview question banks by type and difficulty
export const QUESTION_BANKS = {
  technical: {
    easy: [
      "Can you explain the difference between let, const, and var in JavaScript?",
      "What is the purpose of version control systems like Git?",
      "How would you explain object-oriented programming to someone new to coding?",
      "What are the basic principles of responsive web design?",
      "Can you describe what an API is and how it works?"
    ],
    medium: [
      "How would you optimize a slow-performing database query?",
      "Explain the concept of microservices and their advantages over monolithic architecture.",
      "What are the key differences between SQL and NoSQL databases?",
      "How do you handle state management in a React application?",
      "Describe the process of implementing authentication and authorization in a web application."
    ],
    hard: [
      "Design a system that can handle 1 million concurrent users. What are your considerations?",
      "How would you implement a distributed caching system?",
      "Explain the CAP theorem and its implications for distributed systems.",
      "Design a real-time chat application architecture that scales globally.",
      "How would you approach debugging a memory leak in a production application?"
    ]
  },
  behavioral: {
    easy: [
      "Tell me about yourself and why you're interested in this role.",
      "What motivates you in your work?",
      "Describe a project you're particularly proud of.",
      "How do you stay updated with new technologies?",
      "What are your career goals for the next few years?"
    ],
    medium: [
      "Tell me about a time when you had to learn a new technology quickly.",
      "Describe a situation where you had to work with a difficult team member.",
      "How do you handle tight deadlines and pressure?",
      "Tell me about a time when you made a mistake. How did you handle it?",
      "Describe a situation where you had to convince others to adopt your idea."
    ],
    hard: [
      "Tell me about a time when you had to make a difficult decision with limited information.",
      "Describe a situation where you had to lead a team through a major crisis or setback.",
      "How do you handle conflicts between team members with different technical opinions?",
      "Tell me about a time when you had to deliver bad news to stakeholders.",
      "Describe a situation where you had to challenge your manager's decision."
    ]
  },
  problem_solving: [
    "How would you design a parking lot system?",
    "If you could improve one thing about our product, what would it be and how?",
    "How would you estimate the number of piano tuners in a city?",
    "Design a recommendation system for an e-commerce platform.",
    "How would you approach testing a new feature before releasing it to users?"
  ]
};

// Follow-up question generators
export const FOLLOW_UP_GENERATORS = {
  technical: [
    "Can you walk me through your thought process on that?",
    "What would happen if we scaled that solution to handle 10x more data?",
    "How would you test that implementation?",
    "What are the potential security concerns with that approach?",
    "How would you monitor and maintain that system in production?"
  ],
  behavioral: [
    "What was the outcome of that situation?",
    "How did that experience change your approach to similar situations?",
    "What would you do differently if you faced that situation again?",
    "How did your team members react to your approach?",
    "What did you learn from that experience?"
  ],
  clarification: [
    "Could you elaborate on that point?",
    "Can you give me a specific example?",
    "What do you mean by that exactly?",
    "How did you measure the success of that approach?",
    "What challenges did you face during that process?"
  ]
};

// Interviewer personality-based response generators
export function generateInterviewerResponse(
  interviewer: AIInterviewer,
  candidateResponse: string,
  questionType: string
): string {
  const responses = {
    sarah_chen: {
      positive: [
        "That's a thoughtful approach. I appreciate how you broke down the problem systematically.",
        "Excellent! Your technical understanding really shows through in that explanation.",
        "I like how you considered multiple perspectives in your answer."
      ],
      neutral: [
        "I see. Let me dig a bit deeper into that concept.",
        "That's an interesting point. Can you elaborate on the implementation details?",
        "Okay, I understand your reasoning. Let's explore this further."
      ],
      challenging: [
        "I'm not entirely convinced by that approach. What about edge cases?",
        "That solution might work for small scale, but what about enterprise-level requirements?",
        "Have you considered the performance implications of that design?"
      ]
    },
    marcus_rodriguez: {
      positive: [
        "Now that's what I'm talking about! You clearly know your stuff.",
        "Impressive. You've obviously dealt with real-world scenarios like this.",
        "Good. You're thinking like a senior engineer should."
      ],
      neutral: [
        "Alright, let's see how you handle this next challenge.",
        "Fair enough. But let's push this a bit further.",
        "I hear you. Now let's test that knowledge under pressure."
      ],
      challenging: [
        "That's a textbook answer, but real life is messier. What then?",
        "I've seen that approach fail spectacularly in production. Defend your choice.",
        "You're missing something critical here. Think harder."
      ]
    },
    elena_vasquez: {
      positive: [
        "I love how you approached that from a user-centered perspective.",
        "That shows great emotional intelligence and team awareness.",
        "Your collaborative mindset really comes through in that answer."
      ],
      neutral: [
        "That's a good start. How would you ensure everyone on the team is aligned?",
        "I appreciate that perspective. Let's talk about the human side of this.",
        "Interesting. How do you think users would react to that solution?"
      ],
      challenging: [
        "But how do you balance user needs with business constraints?",
        "That sounds ideal, but what if stakeholders push back?",
        "I'm concerned about the accessibility implications of that approach."
      ]
    },
    david_kim: {
      positive: [
        "Fascinating! I love how you're thinking outside the box here.",
        "That's exactly the kind of innovative thinking we need.",
        "You're clearly staying ahead of the technology curve."
      ],
      neutral: [
        "Intriguing approach. How do you see this evolving with emerging technologies?",
        "That's solid. But what if we could leverage AI/ML to enhance it?",
        "Good foundation. Now let's think about the future implications."
      ],
      challenging: [
        "That's very traditional thinking. How can we disrupt this space?",
        "But what about the ethical implications of that technology choice?",
        "I'm not seeing the innovation factor here. Where's the breakthrough?"
      ]
    }
  };

  const interviewerResponses = responses[interviewer.id as keyof typeof responses];
  if (!interviewerResponses) {
    return "That's an interesting perspective. Let me ask you this...";
  }

  // Determine response tone based on candidate response quality (simplified)
  const responseLength = candidateResponse.length;
  const hasKeywords = candidateResponse.toLowerCase().includes('because') || 
                     candidateResponse.toLowerCase().includes('however') ||
                     candidateResponse.toLowerCase().includes('therefore');

  let tone: 'positive' | 'neutral' | 'challenging';
  
  if (responseLength > 200 && hasKeywords) {
    tone = 'positive';
  } else if (responseLength > 100) {
    tone = 'neutral';
  } else {
    tone = 'challenging';
  }

  const responseOptions = interviewerResponses[tone];
  return responseOptions[Math.floor(Math.random() * responseOptions.length)];
}

// Generate next question based on context
export function generateNextQuestion(
  interviewer: AIInterviewer,
  questionIndex: number,
  previousQuestions: string[],
  candidateResponse?: string,
  interviewType: string = 'mixed'
): { question: string; type: string } {
  // Determine interview phase
  let phase: string;
  if (questionIndex === 0) {
    phase = 'introduction';
  } else if (questionIndex < 3) {
    phase = 'behavioral';
  } else if (questionIndex < 7) {
    phase = 'technical';
  } else if (questionIndex < 9) {
    phase = 'problem_solving';
  } else {
    phase = 'closing';
  }

  // Generate follow-up if appropriate
  if (candidateResponse && questionIndex > 0 && Math.random() < 0.3) {
    const followUps = FOLLOW_UP_GENERATORS.technical;
    return {
      question: followUps[Math.floor(Math.random() * followUps.length)],
      type: 'follow_up'
    };
  }

  // Select question based on phase and interviewer difficulty
  let questionBank: string[];
  let questionType: string;

  switch (phase) {
    case 'introduction':
      questionBank = QUESTION_BANKS.behavioral.easy;
      questionType = 'behavioral';
      break;
    case 'behavioral':
      questionBank = QUESTION_BANKS.behavioral[interviewer.difficulty];
      questionType = 'behavioral';
      break;
    case 'technical':
      questionBank = QUESTION_BANKS.technical[interviewer.difficulty];
      questionType = 'technical';
      break;
    case 'problem_solving':
      questionBank = QUESTION_BANKS.problem_solving;
      questionType = 'problem_solving';
      break;
    case 'closing':
      questionBank = [
        "Do you have any questions about the role or our company?",
        "What excites you most about this opportunity?",
        "Is there anything else you'd like me to know about your background?"
      ];
      questionType = 'behavioral';
      break;
    default:
      questionBank = QUESTION_BANKS.behavioral.medium;
      questionType = 'behavioral';
  }

  // Filter out already asked questions
  const availableQuestions = questionBank.filter(q => !previousQuestions.includes(q));
  
  if (availableQuestions.length === 0) {
    // Fallback to follow-up questions
    const followUps = FOLLOW_UP_GENERATORS.clarification;
    return {
      question: followUps[Math.floor(Math.random() * followUps.length)],
      type: 'follow_up'
    };
  }

  const selectedQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  
  return {
    question: selectedQuestion,
    type: questionType
  };
}

// Calculate interview progress
export function calculateInterviewProgress(questionIndex: number, totalQuestions: number = 10) {
  const completionPercentage = Math.min(100, (questionIndex / totalQuestions) * 100);
  
  let currentPhase: 'introduction' | 'technical' | 'behavioral' | 'problem_solving' | 'closing';
  
  if (questionIndex === 0) {
    currentPhase = 'introduction';
  } else if (questionIndex < 3) {
    currentPhase = 'behavioral';
  } else if (questionIndex < 7) {
    currentPhase = 'technical';
  } else if (questionIndex < 9) {
    currentPhase = 'problem_solving';
  } else {
    currentPhase = 'closing';
  }

  const estimatedTimeRemaining = Math.max(0, (totalQuestions - questionIndex) * 3); // 3 minutes per question

  return {
    currentPhase,
    completionPercentage,
    estimatedTimeRemaining
  };
}

// Determine interviewer mood based on candidate performance
export function determineInterviewerMood(
  interviewer: AIInterviewer,
  performanceMetrics?: {
    clarity: number;
    confidence: number;
    relevance: number;
    technicalAccuracy: number;
  }
): 'encouraging' | 'neutral' | 'challenging' | 'impressed' | 'concerned' {
  if (!performanceMetrics) return 'neutral';

  const averageScore = (
    performanceMetrics.clarity +
    performanceMetrics.confidence +
    performanceMetrics.relevance +
    performanceMetrics.technicalAccuracy
  ) / 4;

  // Adjust mood based on interviewer personality
  const personalityModifier = {
    'easy': 10,    // More encouraging
    'medium': 0,   // Neutral
    'hard': -10    // More challenging
  }[interviewer.difficulty] || 0;

  const adjustedScore = averageScore + personalityModifier;

  if (adjustedScore >= 85) return 'impressed';
  if (adjustedScore >= 70) return 'encouraging';
  if (adjustedScore >= 50) return 'neutral';
  if (adjustedScore >= 30) return 'challenging';
  return 'concerned';
}

// Main AI flow prompt for closed-door interview
export const CLOSED_DOOR_INTERVIEW_PROMPT = `
You are an AI-powered interview simulator that conducts realistic, closed-door interviews. Your role is to:

1. **Embody the assigned interviewer personality** - Each AI interviewer has unique traits, interview styles, and specialties. Maintain consistency with their character throughout the session.

2. **Generate contextually appropriate questions** - Based on the interview phase, candidate background, and previous responses, ask relevant questions that progressively assess the candidate's skills.

3. **Provide realistic interviewer responses** - React to candidate answers as a real interviewer would, showing engagement, asking follow-ups, and providing feedback through your tone and next questions.

4. **Adapt difficulty dynamically** - Adjust question complexity based on candidate performance and interviewer personality (easy/medium/hard).

5. **Maintain interview flow** - Progress through logical phases: introduction → behavioral → technical → problem-solving → closing.

**Key Guidelines:**
- Stay in character as the assigned interviewer
- Ask one question at a time
- Provide brief, realistic responses to candidate answers
- Use follow-up questions to dig deeper into interesting responses
- Maintain appropriate pacing (don't rush or drag)
- Show personality through your responses and question style
- Consider the candidate's background when selecting questions
- Provide constructive feedback when appropriate

**Interview Phases:**
1. **Introduction** (1-2 questions): Warm-up, background, motivation
2. **Behavioral** (2-3 questions): Past experiences, soft skills, cultural fit
3. **Technical** (3-4 questions): Role-specific technical knowledge and skills
4. **Problem-Solving** (1-2 questions): Analytical thinking, approach to challenges
5. **Closing** (1-2 questions): Questions for interviewer, final thoughts

Remember: You're simulating a real interview experience. Be professional but show personality, ask meaningful questions, and help the candidate demonstrate their best self while maintaining appropriate challenge levels.
`;

export default {
  inputSchema: ClosedDoorInterviewInputSchema,
  outputSchema: ClosedDoorInterviewOutputSchema,
  prompt: CLOSED_DOOR_INTERVIEW_PROMPT
};