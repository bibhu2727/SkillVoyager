// Interview Simulator Types and Interfaces

export type JobRole = 
  | 'Software Engineer'
  | 'Data Scientist'
  | 'Product Manager'
  | 'UX Designer'
  | 'Marketing Manager'
  | 'Sales Representative'
  | 'Business Analyst'
  | 'Project Manager'
  | 'DevOps Engineer'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Developer'
  | 'HR Specialist';

export type DifficultyLevel = 'entry' | 'mid' | 'senior';

export type QuestionCategory = 
  | 'technical-deep-dive'
  | 'behavioral-stories'
  | 'problem-solving'
  | 'situational-judgment'
  | 'leadership-influence'
  | 'communication'
  | 'innovation-creativity'
  | 'performance-metrics'
  | 'industry-specific'
  | 'culture-fit';

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  expectedKeywords: string[];
  followUpQuestions?: string[];
  timeLimit: number; // in seconds
  difficulty: DifficultyLevel;
  tips?: string;
  questionType?: 'open-ended' | 'scenario-based' | 'experience-based' | 'hypothetical';
  complexity?: 'quick-response' | 'detailed-analysis' | 'deep-dive';
  evaluationCriteria?: string[];
  commonMistakes?: string[];
  // Additional property for compatibility
  text?: string;
}

export interface SpeechAnalysis {
  wordsPerMinute: number;
  pauseFrequency: number;
  fillerWords: number;
  clarity: number; // 0-100
  volume: number; // 0-100
  tone: 'confident' | 'nervous' | 'monotone' | 'enthusiastic';
}

export interface AIAnalysis {
  speechPattern: string;
  confidence: number; // 0-100
  keywordUsage: string[];
  improvementAreas: string[];
  strengths: string[];
  overallScore: number; // 0-100
  detailedFeedback: {
    technical: number;
    communication: number;
    problemSolving: number;
    leadership: number;
  };
  // Additional properties for compatibility
  feedback?: string;
  keyStrengths?: string[];
  contentScore?: number;
  technicalScore?: number;
}

export interface InterviewResponse {
  questionId: string;
  response: string;
  duration: number; // in seconds
  speechAnalysis: SpeechAnalysis;
  timestamp: Date;
  timeSpent?: number;
  aiAnalysis?: AIAnalysis;
}

export interface InterviewSession {
  id: string;
  userId: string;
  jobRole: JobRole;
  difficulty: DifficultyLevel;
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
  aiAnalysis: AIAnalysis;
  startTime: Date;
  endTime?: Date;
  status: 'in-progress' | 'completed' | 'paused';
  totalScore: number;
  overallScore?: number;
  completedAt?: Date;
  duration?: number;
}

export interface InterviewSimulator {
  jobRole: JobRole;
  difficulty: DifficultyLevel;
  questions: InterviewQuestion[];
  aiAnalysis: AIAnalysis;
}

export interface InterviewPreparation {
  jobRole: JobRole;
  difficulty: DifficultyLevel;
  estimatedDuration: number;
  questionCount: number;
  categories: QuestionCategory[];
  tips: string[];
}

// Mock interview questions database
export const INTERVIEW_QUESTIONS: Record<JobRole, Record<DifficultyLevel, InterviewQuestion[]>> = {
  'Software Engineer': {
    entry: [
      // Technical Deep Dive Questions
      {
        id: 'se_entry_001',
        category: 'technical-deep-dive',
        question: 'What is the difference between let, const, and var in JavaScript?',
        expectedKeywords: ['scope', 'hoisting', 'block scope', 'function scope', 'temporal dead zone'],
        timeLimit: 180,
        difficulty: 'entry'
      },
      {
        id: 'se_entry_002',
        category: 'technical-deep-dive',
        question: 'Explain the difference between == and === in JavaScript.',
        expectedKeywords: ['type coercion', 'strict equality', 'loose equality', 'type conversion'],
        timeLimit: 120,
        difficulty: 'entry'
      },
      {
        id: 'se_entry_003',
        category: 'technical-deep-dive',
        question: 'What are the different data types in JavaScript?',
        expectedKeywords: ['primitive', 'object', 'string', 'number', 'boolean', 'undefined', 'null', 'symbol'],
        timeLimit: 150,
        difficulty: 'entry'
      },
      {
        id: 'se_entry_004',
        category: 'technical-deep-dive',
        question: 'How does event bubbling work in the DOM?',
        expectedKeywords: ['event propagation', 'bubbling', 'capturing', 'target', 'preventDefault'],
        timeLimit: 200,
        difficulty: 'entry'
      },
      {
        id: 'se_entry_005',
        category: 'technical-deep-dive',
        question: 'What is the purpose of the async/await syntax?',
        expectedKeywords: ['asynchronous', 'promises', 'non-blocking', 'error handling', 'try-catch'],
        timeLimit: 180,
        difficulty: 'entry'
      },
      // Problem Solving Questions
      {
        id: 'se_entry_006',
        category: 'problem-solving',
        question: 'How would you reverse a string in JavaScript?',
        expectedKeywords: ['split', 'reverse', 'join', 'loop', 'recursion'],
        timeLimit: 120,
        difficulty: 'entry'
      },
      {
        id: 'se_entry_007',
        category: 'problem-solving',
        question: 'Write a function to find the largest number in an array.',
        expectedKeywords: ['Math.max', 'loop', 'comparison', 'reduce', 'sort'],
        timeLimit: 150,
        difficulty: 'entry'
      },
      {
        id: 'se_entry_008',
        category: 'problem-solving',
        question: 'How would you remove duplicates from an array?',
        expectedKeywords: ['Set', 'filter', 'indexOf', 'includes', 'unique'],
        timeLimit: 180,
        difficulty: 'entry'
      },
      {
        id: 'se_entry_009',
        category: 'problem-solving',
        question: 'Implement a simple calculator function.',
        expectedKeywords: ['operations', 'switch', 'validation', 'error handling', 'parameters'],
        timeLimit: 240,
        difficulty: 'entry'
      },
      // Situational Judgment Questions
      {
        id: 'se_entry_010',
        category: 'situational-judgment',
        question: 'How would you handle a situation where your code is not working as expected?',
        expectedKeywords: ['debugging', 'console.log', 'testing', 'documentation', 'help'],
        timeLimit: 180,
        difficulty: 'entry'
      },
      {
        id: 'se_entry_011',
        category: 'situational-judgment',
        question: 'What would you do if you encountered a technology you\'ve never used before?',
        expectedKeywords: ['learning', 'documentation', 'tutorials', 'practice', 'community'],
        timeLimit: 150,
        difficulty: 'entry'
      },
      // Behavioral Stories Questions
      {
        id: 'se_entry_012',
        category: 'behavioral-stories',
        question: 'Tell me about a challenging coding problem you solved.',
        expectedKeywords: ['problem description', 'approach', 'solution', 'learning', 'outcome'],
        timeLimit: 300,
        difficulty: 'entry'
      },
      {
        id: 'se_entry_013',
        category: 'behavioral-stories',
        question: 'Describe a time when you had to learn something new quickly.',
        expectedKeywords: ['urgency', 'resources', 'strategy', 'application', 'results'],
        timeLimit: 240,
        difficulty: 'entry'
      },
      // Communication Questions
      {
        id: 'se_entry_014',
        category: 'communication',
        question: 'How would you explain a complex technical concept to a non-technical person?',
        expectedKeywords: ['simplification', 'analogies', 'examples', 'patience', 'verification'],
        timeLimit: 200,
        difficulty: 'entry'
      },
      {
        id: 'se_entry_015',
        category: 'communication',
        question: 'How do you handle feedback on your code?',
        expectedKeywords: ['openness', 'learning', 'improvement', 'discussion', 'implementation'],
        timeLimit: 180,
        difficulty: 'entry'
      }
    ],
    mid: [
      // Technical Deep Dive Questions
      {
        id: 'se_mid_001',
        category: 'technical-deep-dive',
        question: 'Explain the concept of closures in JavaScript and provide an example.',
        expectedKeywords: ['lexical scope', 'inner function', 'outer function', 'variable access', 'memory'],
        timeLimit: 240,
        difficulty: 'mid'
      },
      {
        id: 'se_mid_002',
        category: 'technical-deep-dive',
        question: 'What are the different ways to handle asynchronous operations in JavaScript?',
        expectedKeywords: ['callbacks', 'promises', 'async/await', 'event loop', 'non-blocking'],
        timeLimit: 300,
        difficulty: 'mid'
      },
      {
        id: 'se_mid_003',
        category: 'technical-deep-dive',
        question: 'Explain the concept of prototypal inheritance in JavaScript.',
        expectedKeywords: ['prototype chain', 'Object.create', 'constructor', 'inheritance', '__proto__'],
        timeLimit: 280,
        difficulty: 'mid'
      },
      {
        id: 'se_mid_004',
        category: 'technical-deep-dive',
        question: 'What are the differences between SQL and NoSQL databases?',
        expectedKeywords: ['relational', 'ACID', 'schema', 'scalability', 'consistency', 'flexibility'],
        timeLimit: 250,
        difficulty: 'mid'
      },
      {
        id: 'se_mid_005',
        category: 'technical-deep-dive',
        question: 'Explain RESTful API design principles.',
        expectedKeywords: ['HTTP methods', 'stateless', 'resources', 'status codes', 'uniform interface'],
        timeLimit: 300,
        difficulty: 'mid'
      },
      // Problem Solving Questions
      {
        id: 'se_mid_006',
        category: 'problem-solving',
        question: 'Design a simple caching mechanism for API responses.',
        expectedKeywords: ['cache', 'expiration', 'storage', 'performance', 'invalidation'],
        timeLimit: 300,
        difficulty: 'mid'
      },
      {
        id: 'se_mid_007',
        category: 'problem-solving',
        question: 'How would you optimize a slow-performing web application?',
        expectedKeywords: ['profiling', 'bottlenecks', 'caching', 'minification', 'lazy loading'],
        timeLimit: 350,
        difficulty: 'mid'
      },
      {
        id: 'se_mid_008',
        category: 'problem-solving',
        question: 'Design a rate limiting system for an API.',
        expectedKeywords: ['throttling', 'sliding window', 'token bucket', 'distributed', 'Redis'],
        timeLimit: 400,
        difficulty: 'mid'
      },
      {
        id: 'se_mid_009',
        category: 'problem-solving',
        question: 'How would you implement real-time notifications in a web application?',
        expectedKeywords: ['WebSockets', 'Server-Sent Events', 'polling', 'push notifications', 'scalability'],
        timeLimit: 320,
        difficulty: 'mid'
      },
      // Situational Judgment Questions
      {
        id: 'se_mid_010',
        category: 'situational-judgment',
        question: 'How would you handle a disagreement with a team member about technical approach?',
        expectedKeywords: ['discussion', 'pros and cons', 'compromise', 'data-driven', 'team harmony'],
        timeLimit: 250,
        difficulty: 'mid'
      },
      {
        id: 'se_mid_011',
        category: 'situational-judgment',
        question: 'What would you do if you discovered a security vulnerability in production?',
        expectedKeywords: ['immediate action', 'assessment', 'patching', 'communication', 'prevention'],
        timeLimit: 280,
        difficulty: 'mid'
      },
      // Behavioral Stories Questions
      {
        id: 'se_mid_012',
        category: 'behavioral-stories',
        question: 'Tell me about a time when you had to refactor legacy code.',
        expectedKeywords: ['analysis', 'planning', 'incremental', 'testing', 'improvement'],
        timeLimit: 350,
        difficulty: 'mid'
      },
      {
        id: 'se_mid_013',
        category: 'behavioral-stories',
        question: 'Describe a project where you had to work with multiple stakeholders.',
        expectedKeywords: ['coordination', 'requirements', 'communication', 'compromise', 'delivery'],
        timeLimit: 300,
        difficulty: 'mid'
      },
      // Leadership Influence Questions
      {
        id: 'se_mid_014',
        category: 'leadership-influence',
        question: 'How would you mentor a junior developer?',
        expectedKeywords: ['guidance', 'code review', 'patience', 'growth', 'knowledge sharing'],
        timeLimit: 250,
        difficulty: 'mid'
      },
      {
        id: 'se_mid_015',
        category: 'leadership-influence',
        question: 'How do you ensure code quality in a team environment?',
        expectedKeywords: ['code review', 'standards', 'testing', 'documentation', 'best practices'],
        timeLimit: 280,
        difficulty: 'mid'
      },
      // Communication Questions
      {
        id: 'se_mid_016',
        category: 'communication',
        question: 'How do you handle technical debt discussions with management?',
        expectedKeywords: ['business impact', 'risk assessment', 'prioritization', 'timeline', 'ROI'],
        timeLimit: 300,
        difficulty: 'mid'
      },
      {
        id: 'se_mid_017',
        category: 'communication',
        question: 'Describe how you would present a technical solution to stakeholders.',
        expectedKeywords: ['audience awareness', 'benefits', 'risks', 'timeline', 'visual aids'],
        timeLimit: 250,
        difficulty: 'mid'
      },
      // Innovation Creativity Questions
      {
        id: 'se_mid_018',
        category: 'innovation-creativity',
        question: 'How do you stay updated with new technologies and trends?',
        expectedKeywords: ['continuous learning', 'experimentation', 'community', 'evaluation', 'adoption'],
        timeLimit: 200,
        difficulty: 'mid'
      },
      {
        id: 'se_mid_019',
        category: 'innovation-creativity',
        question: 'Describe a creative solution you implemented to solve a technical problem.',
        expectedKeywords: ['innovation', 'thinking outside box', 'implementation', 'results', 'learning'],
        timeLimit: 320,
        difficulty: 'mid'
      }
    ],
    senior: [
      // Technical Deep Dive Questions
      {
        id: 'se_senior_001',
        category: 'technical-deep-dive',
        question: 'Explain different design patterns and when to use them.',
        expectedKeywords: ['singleton', 'factory', 'observer', 'strategy', 'dependency injection'],
        timeLimit: 350,
        difficulty: 'senior'
      },
      {
        id: 'se_senior_002',
        category: 'technical-deep-dive',
        question: 'How would you design a distributed system for high availability?',
        expectedKeywords: ['redundancy', 'load balancing', 'failover', 'monitoring', 'disaster recovery'],
        timeLimit: 450,
        difficulty: 'senior'
      },
      {
        id: 'se_senior_003',
        category: 'technical-deep-dive',
        question: 'Explain the CAP theorem and its implications for distributed systems.',
        expectedKeywords: ['consistency', 'availability', 'partition tolerance', 'trade-offs', 'eventual consistency'],
        timeLimit: 400,
        difficulty: 'senior'
      },
      {
        id: 'se_senior_004',
        category: 'technical-deep-dive',
        question: 'How do you approach system performance optimization at scale?',
        expectedKeywords: ['profiling', 'bottlenecks', 'caching strategies', 'database optimization', 'monitoring'],
        timeLimit: 420,
        difficulty: 'senior'
      },
      // Problem Solving Questions
      {
        id: 'se_senior_005',
        category: 'problem-solving',
        question: 'Design a URL shortening service like bit.ly.',
        expectedKeywords: ['hashing', 'database design', 'scalability', 'caching', 'analytics'],
        timeLimit: 500,
        difficulty: 'senior'
      },
      {
        id: 'se_senior_006',
        category: 'problem-solving',
        question: 'How would you design a chat application for millions of users?',
        expectedKeywords: ['WebSockets', 'message queues', 'sharding', 'real-time', 'scalability'],
        timeLimit: 480,
        difficulty: 'senior'
      },
      // Leadership Influence Questions
      {
        id: 'se_senior_007',
        category: 'leadership-influence',
        question: 'How would you architect a microservices system for a large e-commerce platform?',
        expectedKeywords: ['microservices', 'scalability', 'database', 'communication', 'deployment'],
        timeLimit: 400,
        difficulty: 'senior'
      },
      {
        id: 'se_senior_008',
        category: 'leadership-influence',
        question: 'How do you build and lead a high-performing engineering team?',
        expectedKeywords: ['hiring', 'culture', 'mentoring', 'processes', 'growth'],
        timeLimit: 350,
        difficulty: 'senior'
      },
      {
        id: 'se_senior_009',
        category: 'leadership-influence',
        question: 'How do you drive technical decision-making across multiple teams?',
        expectedKeywords: ['consensus building', 'technical vision', 'stakeholder management', 'documentation', 'standards'],
        timeLimit: 380,
        difficulty: 'senior'
      },
      // Situational Judgment Questions
      {
        id: 'se_senior_010',
        category: 'situational-judgment',
        question: 'How would you handle a major system outage affecting customers?',
        expectedKeywords: ['incident response', 'communication', 'prioritization', 'post-mortem', 'prevention'],
        timeLimit: 300,
        difficulty: 'senior'
      },
      {
        id: 'se_senior_011',
        category: 'situational-judgment',
        question: 'How do you balance technical debt with feature development?',
        expectedKeywords: ['prioritization', 'business impact', 'risk assessment', 'planning', 'communication'],
        timeLimit: 320,
        difficulty: 'senior'
      },
      // Behavioral Stories Questions
      {
        id: 'se_senior_012',
        category: 'behavioral-stories',
        question: 'Tell me about a time you led a major technical transformation.',
        expectedKeywords: ['vision', 'planning', 'change management', 'execution', 'results'],
        timeLimit: 400,
        difficulty: 'senior'
      },
      {
        id: 'se_senior_013',
        category: 'behavioral-stories',
        question: 'Describe a situation where you had to make a difficult technical decision.',
        expectedKeywords: ['analysis', 'trade-offs', 'stakeholders', 'decision process', 'outcome'],
        timeLimit: 350,
        difficulty: 'senior'
      },
      // Communication Questions
      {
        id: 'se_senior_014',
        category: 'communication',
        question: 'How do you communicate technical strategy to executive leadership?',
        expectedKeywords: ['business alignment', 'ROI', 'risk mitigation', 'roadmap', 'metrics'],
        timeLimit: 300,
        difficulty: 'senior'
      },
      {
        id: 'se_senior_015',
        category: 'communication',
        question: 'How do you facilitate technical discussions between conflicting viewpoints?',
        expectedKeywords: ['mediation', 'objective analysis', 'consensus building', 'documentation', 'decision framework'],
        timeLimit: 280,
        difficulty: 'senior'
      },
      // Innovation Creativity Questions
      {
        id: 'se_senior_016',
        category: 'innovation-creativity',
        question: 'How do you foster innovation within your engineering organization?',
        expectedKeywords: ['experimentation', 'hackathons', 'learning culture', 'risk tolerance', 'resource allocation'],
        timeLimit: 320,
        difficulty: 'senior'
      },
      {
        id: 'se_senior_017',
        category: 'innovation-creativity',
        question: 'Describe how you evaluate and adopt new technologies.',
        expectedKeywords: ['evaluation criteria', 'proof of concept', 'risk assessment', 'migration strategy', 'team training'],
        timeLimit: 350,
        difficulty: 'senior'
      }
    ]
  },
  'Data Scientist': {
    entry: [
      {
        id: 'ds_entry_001',
        category: 'technical-deep-dive',
        question: 'Explain the difference between supervised and unsupervised learning.',
        expectedKeywords: ['labeled data', 'classification', 'regression', 'clustering', 'dimensionality reduction'],
        timeLimit: 180,
        difficulty: 'entry'
      }
    ],
    mid: [
      {
        id: 'ds_mid_001',
        category: 'technical-deep-dive',
        question: 'How would you handle missing data in a dataset?',
        expectedKeywords: ['imputation', 'deletion', 'MCAR', 'MAR', 'MNAR', 'bias'],
        timeLimit: 300,
        difficulty: 'mid'
      }
    ],
    senior: [
      {
        id: 'ds_senior_001',
        category: 'leadership-influence',
        question: 'How do you communicate complex ML model results to non-technical stakeholders?',
        expectedKeywords: ['visualization', 'business impact', 'simplification', 'storytelling'],
        timeLimit: 400,
        difficulty: 'senior'
      }
    ]
  },
  'Product Manager': {
    entry: [
      {
        id: 'pm_entry_001',
        category: 'behavioral-stories',
        question: 'How do you prioritize features when you have limited resources?',
        expectedKeywords: ['user impact', 'business value', 'effort estimation', 'stakeholder alignment'],
        timeLimit: 240,
        difficulty: 'entry'
      }
    ],
    mid: [
      {
        id: 'pm_mid_001',
        category: 'situational-judgment',
        question: 'A key feature launch failed. How do you handle the situation?',
        expectedKeywords: ['root cause analysis', 'communication', 'recovery plan', 'learning'],
        timeLimit: 300,
        difficulty: 'mid'
      }
    ],
    senior: [
      {
        id: 'pm_senior_001',
        category: 'leadership-influence',
        question: 'How do you build and maintain a product roadmap for a complex product?',
        expectedKeywords: ['strategic vision', 'stakeholder management', 'market research', 'agile methodology'],
        timeLimit: 400,
        difficulty: 'senior'
      }
    ]
  },
  // Add more job roles with similar structure
  'UX Designer': {
    entry: [{
      id: 'ux_entry_001',
      category: 'technical-deep-dive',
      question: 'What is your design process from research to final design?',
      expectedKeywords: ['user research', 'wireframes', 'prototyping', 'testing', 'iteration'],
      timeLimit: 240,
      difficulty: 'entry'
    }],
    mid: [{
      id: 'ux_mid_001',
      category: 'problem-solving',
      question: 'How would you improve the user experience of a poorly performing mobile app?',
      expectedKeywords: ['user research', 'analytics', 'usability testing', 'information architecture'],
      timeLimit: 300,
      difficulty: 'mid'
    }],
    senior: [{
      id: 'ux_senior_001',
      category: 'leadership-influence',
      question: 'How do you establish and maintain design systems across multiple teams?',
      expectedKeywords: ['design system', 'component library', 'governance', 'adoption strategy'],
      timeLimit: 400,
      difficulty: 'senior'
    }]
  },
  'Marketing Manager': {
    entry: [{
      id: 'mm_entry_001',
      category: 'behavioral-stories',
      question: 'Describe a successful marketing campaign you worked on.',
      expectedKeywords: ['target audience', 'metrics', 'channels', 'ROI', 'results'],
      timeLimit: 240,
      difficulty: 'entry'
    }],
    mid: [{
      id: 'mm_mid_001',
      category: 'problem-solving',
      question: 'How would you launch a product in a competitive market?',
      expectedKeywords: ['market analysis', 'positioning', 'differentiation', 'go-to-market strategy'],
      timeLimit: 300,
      difficulty: 'mid'
    }],
    senior: [{
      id: 'mm_senior_001',
      category: 'leadership-influence',
      question: 'How do you align marketing strategy with overall business objectives?',
      expectedKeywords: ['strategic alignment', 'KPIs', 'cross-functional collaboration', 'measurement'],
      timeLimit: 400,
      difficulty: 'senior'
    }]
  },
  'Sales Representative': {
    entry: [{
      id: 'sr_entry_001',
      category: 'behavioral-stories',
      question: 'How do you handle rejection from potential customers?',
      expectedKeywords: ['resilience', 'learning', 'persistence', 'relationship building'],
      timeLimit: 180,
      difficulty: 'entry'
    }],
    mid: [{
      id: 'sr_mid_001',
      category: 'situational-judgment',
      question: 'A client is unhappy with your product. How do you turn this around?',
      expectedKeywords: ['active listening', 'problem solving', 'value proposition', 'relationship repair'],
      timeLimit: 300,
      difficulty: 'mid'
    }],
    senior: [{
      id: 'sr_senior_001',
      category: 'leadership-influence',
      question: 'How do you build and manage a high-performing sales team?',
      expectedKeywords: ['team building', 'coaching', 'performance management', 'motivation'],
      timeLimit: 400,
      difficulty: 'senior'
    }]
  },
  'Business Analyst': {
    entry: [{
      id: 'ba_entry_001',
      category: 'technical-deep-dive',
      question: 'How do you gather and document business requirements?',
      expectedKeywords: ['stakeholder interviews', 'documentation', 'requirements analysis', 'validation'],
      timeLimit: 240,
      difficulty: 'entry'
    }],
    mid: [{
      id: 'ba_mid_001',
      category: 'problem-solving',
      question: 'How would you analyze and improve a business process?',
      expectedKeywords: ['process mapping', 'gap analysis', 'optimization', 'metrics'],
      timeLimit: 300,
      difficulty: 'mid'
    }],
    senior: [{
      id: 'ba_senior_001',
      category: 'leadership-influence',
      question: 'How do you manage conflicting requirements from different stakeholders?',
      expectedKeywords: ['stakeholder management', 'negotiation', 'prioritization', 'communication'],
      timeLimit: 400,
      difficulty: 'senior'
    }]
  },
  'Project Manager': {
    entry: [{
      id: 'pjm_entry_001',
      category: 'behavioral-stories',
      question: 'How do you ensure a project stays on track and within budget?',
      expectedKeywords: ['planning', 'monitoring', 'risk management', 'communication'],
      timeLimit: 240,
      difficulty: 'entry'
    }],
    mid: [{
      id: 'pjm_mid_001',
      category: 'situational-judgment',
      question: 'Your project is behind schedule. How do you get it back on track?',
      expectedKeywords: ['root cause analysis', 'resource reallocation', 'scope adjustment', 'stakeholder communication'],
      timeLimit: 300,
      difficulty: 'mid'
    }],
    senior: [{
      id: 'pjm_senior_001',
      category: 'leadership-influence',
      question: 'How do you manage a portfolio of projects with competing priorities?',
      expectedKeywords: ['portfolio management', 'resource optimization', 'strategic alignment', 'risk assessment'],
      timeLimit: 400,
      difficulty: 'senior'
    }]
  },
  'DevOps Engineer': {
    entry: [{
      id: 'do_entry_001',
      category: 'technical-deep-dive',
      question: 'Explain the concept of CI/CD and its benefits.',
      expectedKeywords: ['continuous integration', 'continuous deployment', 'automation', 'testing', 'reliability'],
      timeLimit: 240,
      difficulty: 'entry'
    }],
    mid: [{
      id: 'do_mid_001',
      category: 'problem-solving',
      question: 'How would you handle a production outage?',
      expectedKeywords: ['incident response', 'monitoring', 'rollback', 'post-mortem', 'prevention'],
      timeLimit: 300,
      difficulty: 'mid'
    }],
    senior: [{
      id: 'do_senior_001',
      category: 'leadership-influence',
      question: 'How do you implement DevOps culture in a traditional organization?',
      expectedKeywords: ['cultural change', 'collaboration', 'automation', 'measurement', 'continuous improvement'],
      timeLimit: 400,
      difficulty: 'senior'
    }]
  },
  'Frontend Developer': {
    entry: [{
      id: 'fe_entry_001',
      category: 'technical-deep-dive',
      question: 'What are the key principles of responsive web design?',
      expectedKeywords: ['mobile-first', 'flexible grids', 'media queries', 'flexible images', 'breakpoints'],
      timeLimit: 180,
      difficulty: 'entry'
    }],
    mid: [{
      id: 'fe_mid_001',
      category: 'technical-deep-dive',
      question: 'How do you optimize web application performance?',
      expectedKeywords: ['code splitting', 'lazy loading', 'caching', 'minification', 'CDN'],
      timeLimit: 300,
      difficulty: 'mid'
    }],
    senior: [{
      id: 'fe_senior_001',
      category: 'leadership-influence',
      question: 'How do you establish frontend architecture standards for a team?',
      expectedKeywords: ['architecture patterns', 'code standards', 'tooling', 'documentation', 'mentoring'],
      timeLimit: 400,
      difficulty: 'senior'
    }]
  },
  'Backend Developer': {
    entry: [{
      id: 'be_entry_001',
      category: 'technical-deep-dive',
      question: 'Explain the difference between SQL and NoSQL databases.',
      expectedKeywords: ['relational', 'ACID', 'schema', 'scalability', 'consistency'],
      timeLimit: 180,
      difficulty: 'entry'
    }],
    mid: [{
      id: 'be_mid_001',
      category: 'technical-deep-dive',
      question: 'How do you design a scalable API architecture?',
      expectedKeywords: ['microservices', 'load balancing', 'caching', 'rate limiting', 'versioning'],
      timeLimit: 300,
      difficulty: 'mid'
    }],
    senior: [{
      id: 'be_senior_001',
      category: 'leadership-influence',
      question: 'How do you ensure code quality and maintainability in a large codebase?',
      expectedKeywords: ['code review', 'testing strategy', 'documentation', 'refactoring', 'architecture'],
      timeLimit: 400,
      difficulty: 'senior'
    }]
  },
  'Full Stack Developer': {
    entry: [{
      id: 'fs_entry_001',
      category: 'technical-deep-dive',
      question: 'How do you handle state management in a full-stack application?',
      expectedKeywords: ['client state', 'server state', 'synchronization', 'caching', 'consistency'],
      timeLimit: 240,
      difficulty: 'entry'
    }],
    mid: [{
      id: 'fs_mid_001',
      category: 'problem-solving',
      question: 'Design a complete user authentication system.',
      expectedKeywords: ['security', 'JWT', 'session management', 'password hashing', 'authorization'],
      timeLimit: 400,
      difficulty: 'mid'
    }],
    senior: [{
      id: 'fs_senior_001',
      category: 'leadership-influence',
      question: 'How do you architect a full-stack application for scalability?',
      expectedKeywords: ['system design', 'microservices', 'database design', 'performance', 'monitoring'],
      timeLimit: 500,
      difficulty: 'senior'
    }]
  },
  'HR Specialist': {
    entry: [{
      id: 'hr_entry_001',
      category: 'behavioral-stories',
      question: 'How do you handle employee conflicts in the workplace?',
      expectedKeywords: ['mediation', 'communication', 'conflict resolution', 'documentation', 'policy'],
      timeLimit: 240,
      difficulty: 'entry'
    }],
    mid: [{
      id: 'hr_mid_001',
      category: 'situational-judgment',
      question: 'How would you design an effective recruitment process?',
      expectedKeywords: ['job analysis', 'sourcing', 'screening', 'interviewing', 'assessment'],
      timeLimit: 300,
      difficulty: 'mid'
    }],
    senior: [{
      id: 'hr_senior_001',
      category: 'leadership-influence',
      question: 'How do you develop and implement HR strategies aligned with business goals?',
      expectedKeywords: ['strategic planning', 'organizational development', 'talent management', 'metrics', 'change management'],
      timeLimit: 400,
      difficulty: 'senior'
    }]
  }
};

export interface InterviewResult {
  session: InterviewSession;
  score: number;
  feedback: string;
  recommendations: string[];
}

// Utility functions
export function getQuestionsForRole(jobRole: JobRole, difficulty: DifficultyLevel): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS[jobRole]?.[difficulty] || [];
}

export function generateInterviewSession(
  userId: string,
  jobRole: JobRole,
  difficulty: DifficultyLevel,
  questionCount: number = 5
): InterviewSession {
  const availableQuestions = getQuestionsForRole(jobRole, difficulty);
  const selectedQuestions = availableQuestions.slice(0, questionCount);
  
  return {
    id: `interview_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    userId,
    jobRole,
    difficulty,
    questions: selectedQuestions,
    responses: [],
    aiAnalysis: {
      speechPattern: '',
      confidence: 0,
      keywordUsage: [],
      improvementAreas: [],
      strengths: [],
      overallScore: 0,
      detailedFeedback: {
        technical: 0,
        communication: 0,
        problemSolving: 0,
        leadership: 0
      }
    },
    startTime: new Date(),
    status: 'in-progress',
    totalScore: 0
  };
}

export function calculateInterviewScore(session: InterviewSession): number {
  if (session.responses.length === 0) return 0;
  
  const avgConfidence = session.responses.reduce((sum, response) => 
    sum + (response.speechAnalysis.clarity || 0), 0) / session.responses.length;
  
  const keywordScore = session.aiAnalysis.keywordUsage.length * 10;
  const timeScore = session.responses.reduce((sum, response, index) => {
    const question = session.questions[index];
    const timeRatio = Math.min(response.duration / question.timeLimit, 1);
    return sum + (timeRatio * 20);
  }, 0) / session.responses.length;
  
  return Math.min(Math.round(avgConfidence * 0.4 + keywordScore * 0.3 + timeScore * 0.3), 100);
}

// Generate question sets based on interview duration
export function generateQuestionsByDuration(
  jobRole: JobRole,
  difficulty: DifficultyLevel,
  durationMinutes: 15 | 30 | 45
): InterviewQuestion[] {
  const allQuestions = getQuestionsForRole(jobRole, difficulty);
  
  // Define question counts based on duration
  const questionCounts = {
    15: { min: 3, max: 4 },
    30: { min: 5, max: 10 },
    45: { min: 10, max: 20 }
  };
  
  const { min, max } = questionCounts[durationMinutes];
  const targetCount = Math.min(max, Math.max(min, allQuestions.length));
  
  // Prioritize question categories in order: technical -> case scenarios -> critical thinking
  const categoryPriority = [
    'technical-deep-dive',
    'problem-solving',
    'situational-judgment',
    'behavioral-stories',
    'leadership-influence',
    'communication',
    'innovation-creativity'
  ];
  
  const selectedQuestions: InterviewQuestion[] = [];
  
  // Select questions following the priority order
  for (const category of categoryPriority) {
    if (selectedQuestions.length >= targetCount) break;
    
    const categoryQuestions = allQuestions.filter(q => q.category === category);
    const remainingSlots = targetCount - selectedQuestions.length;
    const questionsToAdd = Math.min(categoryQuestions.length, remainingSlots);
    
    selectedQuestions.push(...categoryQuestions.slice(0, questionsToAdd));
  }
  
  // If we still need more questions, add remaining ones
  if (selectedQuestions.length < targetCount) {
    const usedIds = new Set(selectedQuestions.map(q => q.id));
    const remainingQuestions = allQuestions.filter(q => !usedIds.has(q.id));
    const needed = targetCount - selectedQuestions.length;
    selectedQuestions.push(...remainingQuestions.slice(0, needed));
  }
  
  return selectedQuestions;
}

export function getInterviewPreparation(jobRole: JobRole, difficulty: DifficultyLevel): InterviewPreparation {
  const questions = getQuestionsForRole(jobRole, difficulty);
  const categories = [...new Set(questions.map(q => q.category))];
  const estimatedDuration = questions.reduce((sum, q) => sum + q.timeLimit, 0);
  
  const tips = {
    entry: [
      'Focus on demonstrating your foundational knowledge',
      'Use specific examples from your experience',
      'Ask clarifying questions when needed',
      'Show enthusiasm for learning and growth'
    ],
    mid: [
      'Demonstrate problem-solving methodology',
      'Show leadership potential and collaboration skills',
      'Discuss trade-offs and decision-making processes',
      'Highlight your impact on previous projects'
    ],
    senior: [
      'Focus on strategic thinking and vision',
      'Demonstrate mentoring and team building experience',
      'Discuss complex technical and business challenges',
      'Show how you drive organizational change'
    ]
  };
  
  return {
    jobRole,
    difficulty,
    estimatedDuration,
    questionCount: questions.length,
    categories,
    tips: tips[difficulty]
  };
}