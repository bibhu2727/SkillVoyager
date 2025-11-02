export interface AIInterviewer {
  id: string;
  name: string;
  gender: 'male' | 'female';
  avatar: string;
  personality: string;
  interviewStyle: string;
  voiceId: string;
  specialties: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  background: string;
  questionTypes: string[];
}

export const AI_INTERVIEWERS: AIInterviewer[] = [
  {
    id: 'sarah_chen',
    name: 'Sarah Chen',
    gender: 'female',
    avatar: '/avatars/sarah-chen.svg',
    personality: 'Analytical and detail-oriented with a warm approach. She focuses on problem-solving skills and technical depth while maintaining an encouraging atmosphere.',
    interviewStyle: 'Structured and methodical, asks follow-up questions to dive deep into technical concepts',
    voiceId: 'female_professional_1',
    specialties: ['Software Engineering', 'Data Science', 'System Design', 'Problem Solving'],
    difficulty: 'medium',
    background: 'Senior Software Engineer at Google with 8 years of experience in full-stack development and machine learning',
    questionTypes: ['technical', 'problem_solving', 'system_design', 'coding_challenges']
  },
  {
    id: 'marcus_rodriguez',
    name: 'Marcus Rodriguez',
    gender: 'male',
    avatar: '/avatars/marcus-rodriguez.svg',
    personality: 'Direct and challenging but fair. He pushes candidates to their limits to see how they handle pressure and complex scenarios.',
    interviewStyle: 'High-pressure, rapid-fire questions with scenario-based challenges',
    voiceId: 'male_authoritative_1',
    specialties: ['Leadership', 'Product Management', 'Strategic Thinking', 'Business Analysis'],
    difficulty: 'hard',
    background: 'VP of Engineering at Meta with 12 years of experience leading large-scale product teams',
    questionTypes: ['behavioral', 'leadership', 'strategic', 'pressure_scenarios']
  },
  {
    id: 'elena_vasquez',
    name: 'Elena Vasquez',
    gender: 'female',
    avatar: '/avatars/elena-vasquez.svg',
    personality: 'Empathetic and insightful, focuses on cultural fit and emotional intelligence while assessing technical skills through real-world scenarios.',
    interviewStyle: 'Conversational and scenario-based, emphasizes collaboration and communication skills',
    voiceId: 'female_warm_1',
    specialties: ['UX Design', 'Product Strategy', 'Team Collaboration', 'Communication'],
    difficulty: 'easy',
    background: 'Head of Design at Airbnb with 10 years of experience in user experience and product design',
    questionTypes: ['behavioral', 'design_thinking', 'collaboration', 'communication']
  },
  {
    id: 'david_kim',
    name: 'David Kim',
    gender: 'male',
    avatar: '/avatars/david-kim.svg',
    personality: 'Innovative and forward-thinking, focuses on creativity, adaptability, and cutting-edge technology trends.',
    interviewStyle: 'Creative problem-solving with emphasis on innovation and future-oriented thinking',
    voiceId: 'male_innovative_1',
    specialties: ['AI/ML', 'Blockchain', 'Cloud Architecture', 'Innovation'],
    difficulty: 'medium',
    background: 'CTO at a successful fintech startup with expertise in emerging technologies and scalable systems',
    questionTypes: ['technical', 'innovation', 'future_trends', 'creative_problem_solving']
  }
];

export function getRandomInterviewer(): AIInterviewer {
  const randomIndex = Math.floor(Math.random() * AI_INTERVIEWERS.length);
  return AI_INTERVIEWERS[randomIndex];
}

export function getInterviewerById(id: string): AIInterviewer | undefined {
  return AI_INTERVIEWERS.find(interviewer => interviewer.id === id);
}

export function getInterviewersByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): AIInterviewer[] {
  return AI_INTERVIEWERS.filter(interviewer => interviewer.difficulty === difficulty);
}

export function getInterviewersBySpecialty(specialty: string): AIInterviewer[] {
  return AI_INTERVIEWERS.filter(interviewer => 
    interviewer.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
  );
}

export function getRandomInterviewerPanel(): AIInterviewer[] {
  // Ensure we always have at least 1 female interviewer
  const femaleInterviewers = AI_INTERVIEWERS.filter(i => i.gender === 'female');
  const maleInterviewers = AI_INTERVIEWERS.filter(i => i.gender === 'male');
  
  // Always include at least 1 female interviewer
  const selectedInterviewers: AIInterviewer[] = [];
  
  // Add 1 random female interviewer
  const randomFemale = femaleInterviewers[Math.floor(Math.random() * femaleInterviewers.length)];
  selectedInterviewers.push(randomFemale);
  
  // Add 2 more interviewers from remaining pool (excluding the selected female)
  const remainingInterviewers = AI_INTERVIEWERS.filter(i => i.id !== randomFemale.id);
  const shuffledRemaining = [...remainingInterviewers].sort(() => Math.random() - 0.5);
  selectedInterviewers.push(...shuffledRemaining.slice(0, 2));
  
  return selectedInterviewers;
}

export interface InterviewerPanel {
  interviewers: AIInterviewer[];
  currentSpeaker: number;
  questionCount: number;
}

export function createInterviewerPanel(): InterviewerPanel {
  return {
    interviewers: getRandomInterviewerPanel(),
    currentSpeaker: 0,
    questionCount: 0
  };
}