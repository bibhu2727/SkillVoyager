'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Square, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  SkipForward, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Clock,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SpeechAnalyzer } from '@/lib/speech-analysis';
import type { 
  InterviewSession, 
  InterviewQuestion, 
  SpeechAnalysis, 
  JobRole, 
  DifficultyLevel 
} from '@/lib/interview-simulator';
import { generateInterviewSession, generateQuestionsByDuration } from '@/lib/interview-simulator';
import { generateInterviewQuestionsAction, analyzeInterviewResponseAction } from '@/lib/actions';

// Helper functions for dynamic question generation
const getSkillsForRole = (jobRole: JobRole): string[] => {
  const skillsMap: Record<JobRole, string[]> = {
    'Software Engineer': ['algorithms', 'data structures', 'system design', 'debugging', 'code review', 'testing'],
    'Data Scientist': ['machine learning', 'statistics', 'data visualization', 'Python/R', 'SQL', 'model evaluation'],
    'Product Manager': ['product strategy', 'user research', 'roadmap planning', 'stakeholder management', 'metrics analysis'],
    'UX Designer': ['user research', 'prototyping', 'design systems', 'usability testing', 'accessibility', 'design thinking'],
    'DevOps Engineer': ['CI/CD', 'containerization', 'cloud platforms', 'monitoring', 'infrastructure as code', 'security'],
    'Marketing Manager': ['campaign management', 'analytics', 'content strategy', 'brand management', 'customer segmentation'],
    'Sales Representative': ['lead generation', 'relationship building', 'negotiation', 'CRM systems', 'market analysis'],
    'Business Analyst': ['requirements gathering', 'process mapping', 'data analysis', 'stakeholder communication', 'documentation'],
    'Project Manager': ['project planning', 'risk management', 'team coordination', 'budget management', 'agile methodologies'],
    'HR Specialist': ['talent acquisition', 'employee relations', 'performance management', 'compliance', 'organizational development']
  };
  return skillsMap[jobRole] || ['communication', 'problem-solving', 'teamwork', 'adaptability'];
};

const getIndustryContext = (jobRole: JobRole): string => {
  const contextMap: Record<JobRole, string> = {
    'Software Engineer': 'Technology/Software Development',
    'Data Scientist': 'Technology/Analytics',
    'Product Manager': 'Technology/Product Development',
    'UX Designer': 'Technology/Design',
    'DevOps Engineer': 'Technology/Infrastructure',
    'Marketing Manager': 'Marketing/Advertising',
    'Sales Representative': 'Sales/Business Development',
    'Business Analyst': 'Business/Consulting',
    'Project Manager': 'Project Management/Operations',
    'HR Specialist': 'Human Resources/People Operations'
  };
  return contextMap[jobRole] || 'General Business';
};

// Fallback questions for immediate loading when AI generation fails
const getFallbackQuestions = (jobRole: JobRole, difficulty: DifficultyLevel): InterviewQuestion[] => {
  const baseQuestions: Record<JobRole, Record<DifficultyLevel, InterviewQuestion[]>> = {
    'Software Engineer': {
      'entry': [
        {
          id: 'se_entry_fallback_001',
          category: 'technical-deep-dive',
          text: 'Describe your experience with programming languages and which one you prefer for different types of projects.',
          expectedKeywords: ['programming languages', 'project types', 'experience', 'preferences'],
          timeLimit: 180,
          questionType: 'experience-based',
          complexity: 'quick-response',
          difficulty: 'entry',
          tips: 'Focus on specific examples and explain your reasoning.'
        },
        {
          id: 'se_entry_fallback_002',
          category: 'problem-solving',
          text: 'Walk me through how you would debug a program that is not working as expected.',
          expectedKeywords: ['debugging', 'systematic approach', 'tools', 'testing'],
          timeLimit: 240,
          questionType: 'scenario-based',
          complexity: 'detailed-analysis',
          difficulty: 'entry',
          tips: 'Demonstrate a structured debugging methodology.'
        }
      ],
      'mid': [
        {
          id: 'se_mid_fallback_001',
          category: 'technical-deep-dive',
          text: 'Explain the trade-offs between different architectural patterns you have used in your projects.',
          expectedKeywords: ['architecture', 'trade-offs', 'scalability', 'maintainability'],
          timeLimit: 300,
          questionType: 'experience-based',
          complexity: 'detailed-analysis',
          difficulty: 'mid',
          tips: 'Compare specific patterns with real examples.'
        }
      ],
      'senior': [
        {
          id: 'se_senior_fallback_001',
          category: 'leadership-influence',
          text: 'How do you approach technical decision-making when leading a development team?',
          expectedKeywords: ['leadership', 'technical decisions', 'team collaboration', 'strategy'],
          timeLimit: 360,
          questionType: 'experience-based',
          complexity: 'deep-dive',
          difficulty: 'senior',
          tips: 'Focus on leadership examples and decision frameworks.'
        }
      ]
    },
    'Data Scientist': {
      'entry': [
        {
          id: 'ds_entry_fallback_001',
          category: 'technical-deep-dive',
          text: 'Explain the difference between supervised and unsupervised learning with examples.',
          expectedKeywords: ['supervised', 'unsupervised', 'machine learning', 'examples'],
          timeLimit: 180,
          questionType: 'open-ended',
          complexity: 'quick-response',
          difficulty: 'entry',
          tips: 'Provide clear examples for each type.'
        }
      ],
      'mid': [
        {
          id: 'ds_mid_fallback_001',
          category: 'problem-solving',
          text: 'How would you handle missing data in a dataset for a machine learning project?',
          expectedKeywords: ['missing data', 'data cleaning', 'imputation', 'strategies'],
          timeLimit: 240,
          questionType: 'scenario-based',
          complexity: 'detailed-analysis',
          difficulty: 'mid',
          tips: 'Discuss multiple approaches and their trade-offs.'
        }
      ],
      'senior': [
        {
          id: 'ds_senior_fallback_001',
          category: 'leadership-influence',
          text: 'How do you communicate complex data science findings to non-technical stakeholders?',
          expectedKeywords: ['communication', 'stakeholders', 'data visualization', 'storytelling'],
          timeLimit: 300,
          questionType: 'experience-based',
          complexity: 'detailed-analysis',
          difficulty: 'senior',
          tips: 'Focus on specific examples of successful communication.'
        }
      ]
    },
    'Product Manager': {
      'entry': [
        {
          id: 'pm_entry_fallback_001',
          category: 'problem-solving',
          text: 'How would you prioritize features for a new product release?',
          expectedKeywords: ['prioritization', 'features', 'user needs', 'business value'],
          timeLimit: 240,
          questionType: 'scenario-based',
          complexity: 'detailed-analysis',
          difficulty: 'entry',
          tips: 'Explain your prioritization framework.'
        }
      ],
      'mid': [
        {
          id: 'pm_mid_fallback_001',
          category: 'situational-judgment',
          text: 'Describe a time when you had to make a difficult product decision with limited data.',
          expectedKeywords: ['decision making', 'limited data', 'uncertainty', 'outcome'],
          timeLimit: 300,
          questionType: 'experience-based',
          complexity: 'detailed-analysis',
          difficulty: 'mid',
          tips: 'Use the STAR method and focus on your decision process.'
        }
      ],
      'senior': [
        {
          id: 'pm_senior_fallback_001',
          category: 'leadership-influence',
          text: 'How do you align different stakeholders around a product vision?',
          expectedKeywords: ['stakeholder alignment', 'product vision', 'communication', 'consensus'],
          timeLimit: 360,
          questionType: 'experience-based',
          complexity: 'deep-dive',
          difficulty: 'senior',
          tips: 'Provide specific examples of successful alignment.'
        }
      ]
    },
    'UX Designer': {
      'entry': [
        {
          id: 'ux_entry_fallback_001',
          category: 'technical-deep-dive',
          text: 'Walk me through your design process from research to final design.',
          expectedKeywords: ['design process', 'user research', 'prototyping', 'iteration'],
          timeLimit: 240,
          questionType: 'open-ended',
          complexity: 'detailed-analysis',
          difficulty: 'entry',
          tips: 'Explain each step with specific examples.'
        }
      ],
      'mid': [
        {
          id: 'ux_mid_fallback_001',
          category: 'problem-solving',
          text: 'How would you approach designing for accessibility in a mobile app?',
          expectedKeywords: ['accessibility', 'mobile design', 'inclusive design', 'guidelines'],
          timeLimit: 300,
          questionType: 'scenario-based',
          complexity: 'detailed-analysis',
          difficulty: 'mid',
          tips: 'Discuss specific accessibility principles and implementation.'
        }
      ],
      'senior': [
        {
          id: 'ux_senior_fallback_001',
          category: 'leadership-influence',
          text: 'How do you advocate for user-centered design in an organization focused on business metrics?',
          expectedKeywords: ['user advocacy', 'business alignment', 'metrics', 'influence'],
          timeLimit: 360,
          questionType: 'experience-based',
          complexity: 'deep-dive',
          difficulty: 'senior',
          tips: 'Show how UX contributes to business success.'
        }
      ]
    },
    'DevOps Engineer': {
      'entry': [
        {
          id: 'devops_entry_fallback_001',
          category: 'technical-deep-dive',
          text: 'Explain the concept of CI/CD and its benefits.',
          expectedKeywords: ['CI/CD', 'continuous integration', 'continuous deployment', 'automation'],
          timeLimit: 180,
          questionType: 'open-ended',
          complexity: 'quick-response',
          difficulty: 'entry',
          tips: 'Focus on practical benefits and basic implementation.'
        }
      ],
      'mid': [
        {
          id: 'devops_mid_fallback_001',
          category: 'problem-solving',
          text: 'How would you handle a production outage in a microservices architecture?',
          expectedKeywords: ['incident response', 'microservices', 'troubleshooting', 'monitoring'],
          timeLimit: 300,
          questionType: 'scenario-based',
          complexity: 'detailed-analysis',
          difficulty: 'mid',
          tips: 'Outline a systematic incident response process.'
        }
      ],
      'senior': [
        {
          id: 'devops_senior_fallback_001',
          category: 'leadership-influence',
          text: 'How do you drive DevOps culture adoption across development teams?',
          expectedKeywords: ['culture change', 'team collaboration', 'DevOps practices', 'leadership'],
          timeLimit: 360,
          questionType: 'experience-based',
          complexity: 'deep-dive',
          difficulty: 'senior',
          tips: 'Focus on change management and cultural transformation.'
        }
      ]
    },
    'Marketing Manager': {
      'entry': [
        {
          id: 'mm_entry_fallback_001',
          category: 'problem-solving',
          text: 'How would you measure the success of a marketing campaign?',
          expectedKeywords: ['metrics', 'KPIs', 'campaign measurement', 'ROI'],
          timeLimit: 180,
          questionType: 'open-ended',
          complexity: 'quick-response',
          difficulty: 'entry',
          tips: 'Discuss both quantitative and qualitative metrics.'
        }
      ],
      'mid': [
        {
          id: 'mm_mid_fallback_001',
          category: 'situational-judgment',
          text: 'Describe a time when a marketing campaign did not perform as expected. How did you handle it?',
          expectedKeywords: ['campaign optimization', 'problem solving', 'data analysis', 'pivot'],
          timeLimit: 300,
          questionType: 'experience-based',
          complexity: 'detailed-analysis',
          difficulty: 'mid',
          tips: 'Focus on your analytical approach and lessons learned.'
        }
      ],
      'senior': [
        {
          id: 'mm_senior_fallback_001',
          category: 'leadership-influence',
          text: 'How do you develop and execute a comprehensive marketing strategy?',
          expectedKeywords: ['marketing strategy', 'market research', 'competitive analysis', 'execution'],
          timeLimit: 360,
          questionType: 'experience-based',
          complexity: 'deep-dive',
          difficulty: 'senior',
          tips: 'Outline your strategic planning process with examples.'
        }
      ]
    },
    'Sales Representative': {
      'entry': [
        {
          id: 'sr_entry_fallback_001',
          category: 'communication',
          text: 'How do you build rapport with a new potential client?',
          expectedKeywords: ['relationship building', 'rapport', 'client engagement', 'trust'],
          timeLimit: 180,
          questionType: 'open-ended',
          complexity: 'quick-response',
          difficulty: 'entry',
          tips: 'Provide specific techniques and examples.'
        }
      ],
      'mid': [
        {
          id: 'sr_mid_fallback_001',
          category: 'problem-solving',
          text: 'Describe a time when you had to overcome significant objections to close a deal.',
          expectedKeywords: ['objection handling', 'negotiation', 'persistence', 'solution'],
          timeLimit: 300,
          questionType: 'experience-based',
          complexity: 'detailed-analysis',
          difficulty: 'mid',
          tips: 'Use the STAR method and focus on your approach.'
        }
      ],
      'senior': [
        {
          id: 'sr_senior_fallback_001',
          category: 'leadership-influence',
          text: 'How do you mentor junior sales team members to improve their performance?',
          expectedKeywords: ['mentoring', 'team development', 'sales coaching', 'performance improvement'],
          timeLimit: 360,
          questionType: 'experience-based',
          complexity: 'deep-dive',
          difficulty: 'senior',
          tips: 'Share specific mentoring strategies and success stories.'
        }
      ]
    },
    'Business Analyst': {
      'entry': [
        {
          id: 'ba_entry_fallback_001',
          category: 'technical-deep-dive',
          text: 'How do you gather and document business requirements?',
          expectedKeywords: ['requirements gathering', 'stakeholder interviews', 'documentation', 'analysis'],
          timeLimit: 240,
          questionType: 'open-ended',
          complexity: 'detailed-analysis',
          difficulty: 'entry',
          tips: 'Explain your systematic approach to requirements gathering.'
        }
      ],
      'mid': [
        {
          id: 'ba_mid_fallback_001',
          category: 'problem-solving',
          text: 'Describe a time when you had to analyze conflicting requirements from different stakeholders.',
          expectedKeywords: ['conflict resolution', 'stakeholder management', 'requirements analysis', 'compromise'],
          timeLimit: 300,
          questionType: 'experience-based',
          complexity: 'detailed-analysis',
          difficulty: 'mid',
          tips: 'Focus on your analytical and diplomatic approach.'
        }
      ],
      'senior': [
        {
          id: 'ba_senior_fallback_001',
          category: 'leadership-influence',
          text: 'How do you drive business process improvements across an organization?',
          expectedKeywords: ['process improvement', 'change management', 'stakeholder buy-in', 'implementation'],
          timeLimit: 360,
          questionType: 'experience-based',
          complexity: 'deep-dive',
          difficulty: 'senior',
          tips: 'Discuss your approach to organizational change.'
        }
      ]
    },
    'Project Manager': {
      'entry': [
        {
          id: 'pm_entry_fallback_001',
          category: 'problem-solving',
          text: 'How do you handle project scope creep?',
          expectedKeywords: ['scope management', 'change control', 'stakeholder communication', 'documentation'],
          timeLimit: 240,
          questionType: 'scenario-based',
          complexity: 'detailed-analysis',
          difficulty: 'entry',
          tips: 'Explain your process for managing scope changes.'
        }
      ],
      'mid': [
        {
          id: 'pm_mid_fallback_001',
          category: 'situational-judgment',
          text: 'Describe a project that was falling behind schedule. How did you get it back on track?',
          expectedKeywords: ['schedule recovery', 'risk management', 'resource allocation', 'problem solving'],
          timeLimit: 300,
          questionType: 'experience-based',
          complexity: 'detailed-analysis',
          difficulty: 'mid',
          tips: 'Focus on your recovery strategies and lessons learned.'
        }
      ],
      'senior': [
        {
          id: 'pm_senior_fallback_001',
          category: 'leadership-influence',
          text: 'How do you manage a project with multiple stakeholders who have competing priorities?',
          expectedKeywords: ['stakeholder management', 'priority alignment', 'negotiation', 'communication'],
          timeLimit: 360,
          questionType: 'experience-based',
          complexity: 'deep-dive',
          difficulty: 'senior',
          tips: 'Demonstrate your stakeholder management skills.'
        }
      ]
    },
    'HR Specialist': {
      'entry': [
        {
          id: 'hr_entry_fallback_001',
          category: 'communication',
          text: 'How do you handle a difficult conversation with an employee about performance issues?',
          expectedKeywords: ['performance management', 'difficult conversations', 'employee relations', 'feedback'],
          timeLimit: 240,
          questionType: 'scenario-based',
          complexity: 'detailed-analysis',
          difficulty: 'entry',
          tips: 'Focus on your communication approach and empathy.'
        }
      ],
      'mid': [
        {
          id: 'hr_mid_fallback_001',
          category: 'problem-solving',
          text: 'Describe a time when you had to mediate a conflict between team members.',
          expectedKeywords: ['conflict resolution', 'mediation', 'team dynamics', 'solution'],
          timeLimit: 300,
          questionType: 'experience-based',
          complexity: 'detailed-analysis',
          difficulty: 'mid',
          tips: 'Explain your mediation process and outcome.'
        }
      ],
      'senior': [
        {
          id: 'hr_senior_fallback_001',
          category: 'leadership-influence',
          text: 'How do you develop and implement HR policies that support organizational culture?',
          expectedKeywords: ['policy development', 'organizational culture', 'change management', 'implementation'],
          timeLimit: 360,
          questionType: 'experience-based',
          complexity: 'deep-dive',
          difficulty: 'senior',
          tips: 'Connect HR strategy to business objectives.'
        }
      ]
    }
  };

  // Generic fallback questions for any role/difficulty
  const genericQuestions: InterviewQuestion[] = [
    {
      id: `${jobRole.toLowerCase().replace(' ', '_')}_${difficulty}_generic_001`,
      category: 'behavioral-stories',
      text: `Tell me about a challenging project you worked on in your ${jobRole} role.`,
      expectedKeywords: ['challenge', 'project', 'problem-solving', 'outcome'],
      timeLimit: 240,
      questionType: 'experience-based',
      complexity: 'detailed-analysis',
      difficulty,
      tips: 'Use the STAR method: Situation, Task, Action, Result.'
    },
    {
      id: `${jobRole.toLowerCase().replace(' ', '_')}_${difficulty}_generic_002`,
      category: 'communication',
      text: 'How do you handle disagreements or conflicts in a team setting?',
      expectedKeywords: ['conflict resolution', 'communication', 'teamwork', 'collaboration'],
      timeLimit: 180,
      questionType: 'scenario-based',
      complexity: 'quick-response',
      difficulty,
      tips: 'Provide specific examples of successful conflict resolution.'
    },
    {
      id: `${jobRole.toLowerCase().replace(' ', '_')}_${difficulty}_generic_003`,
      category: 'culture-fit',
      text: 'What motivates you in your work and how do you stay engaged?',
      expectedKeywords: ['motivation', 'engagement', 'values', 'career goals'],
      timeLimit: 180,
      questionType: 'open-ended',
      complexity: 'quick-response',
      difficulty,
      tips: 'Be authentic and connect to the role and company.'
    }
  ];

  return baseQuestions[jobRole]?.[difficulty] || genericQuestions;
};

const getCategoryDisplayName = (category: string): string => {
  const displayNames: Record<string, string> = {
    'technical-deep-dive': '🔧 Technical Deep-Dive',
    'behavioral-stories': '🎭 Behavioral Stories',
    'problem-solving': '🧩 Problem Solving',
    'situational-judgment': '🎯 Situational Judgment',
    'leadership-influence': '🏆 Leadership & Influence',
    'communication': '💬 Communication',
    'innovation-creativity': '🚀 Innovation & Creativity',
    'performance-metrics': '📈 Performance & Metrics',
    'industry-specific': '🔍 Industry Specific',
    'culture-fit': '🎪 Culture Fit'
  };
  return displayNames[category] || category;
};

const getQuestionTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    'open-ended': '💭',
    'scenario-based': '🎬',
    'experience-based': '📚',
    'hypothetical': '🤔'
  };
  return icons[type] || '❓';
};

interface InterviewSimulatorProps {
  jobRole: JobRole;
  difficulty: DifficultyLevel;
  duration?: number;
  onComplete?: (session: InterviewSession) => void;
  className?: string;
}

interface QuestionState {
  question: InterviewQuestion;
  response: string;
  speechAnalysis?: SpeechAnalysis;
  aiAnalysis?: any;
  isAnswered: boolean;
  timeSpent: number;
}

export function InterviewSimulator({ 
  jobRole, 
  difficulty, 
  duration = 30, 
  onComplete, 
  className 
}: InterviewSimulatorProps) {
  // Core state
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<QuestionState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'idle' | 'generating' | 'caching' | 'finalizing'>('idle');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [usingFallbackQuestions, setUsingFallbackQuestions] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  // Real-time feedback state
  const [realTimeFeedback, setRealTimeFeedback] = useState<{
    confidence: number;
    clarity: number;
    pace: number;
  }>({ confidence: 0, clarity: 0, pace: 0 });

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechAnalyzerRef = useRef<SpeechAnalyzer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Load previous questions from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`interview-questions-${jobRole}-${difficulty}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setPreviousQuestions(parsed);
        } catch (e) {
          console.warn('Failed to parse stored questions:', e);
        }
      }
    }
  }, [jobRole, difficulty]);

  // Initialize interview session
  useEffect(() => {
    initializeInterview();
    
    // Cleanup function to clear intervals when component unmounts
    return () => {
      stopRealTimeFeedback();
    };
  }, [jobRole, difficulty]);
  
  // Also cleanup when recording state changes
  useEffect(() => {
    if (!isRecording) {
      stopRealTimeFeedback();
    }
  }, [isRecording]);
  
  // Debug: Track state changes
  useEffect(() => {
    console.log('Current question index changed to:', currentQuestionIndex, 'Total questions:', questionStates.length);
  }, [currentQuestionIndex, questionStates.length]);

  // Initialize speech analyzer
  useEffect(() => {
    if (SpeechAnalyzer.isSupported()) {
      speechAnalyzerRef.current = new SpeechAnalyzer();
    }
    return () => {
      if (speechAnalyzerRef.current) {
        speechAnalyzerRef.current = null;
      }
    };
  }, []);

  const initializeInterview = async () => {
    setIsLoading(true);
    setLoadingStage('generating');
    setLoadingProgress(0);
    setError(null);
    
    try {
      // Progressive loading: Step 1 - Check cache
      setLoadingProgress(20);
      const cacheKey = `interview-questions-${jobRole}-${difficulty}-${Date.now().toString().slice(0, -7)}`; // Cache for ~3 hours
      const cachedQuestions = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null;
      
      let questions: InterviewQuestion[] = [];
      
      if (cachedQuestions) {
        setLoadingStage('caching');
        setLoadingProgress(60);
        try {
          const parsed = JSON.parse(cachedQuestions);
          questions = parsed.questions || [];
          setLoadingProgress(80);
        } catch (e) {
          console.warn('Failed to parse cached questions:', e);
        }
      }
      
      // If no cached questions or cache is empty, generate questions based on duration
      if (questions.length === 0) {
        setLoadingStage('generating');
        setLoadingProgress(40);
        
        console.info('Generating questions based on duration and difficulty level');
        setUsingFallbackQuestions(true);
        setLoadingProgress(60);
        
        // Use duration-based question generation from the static library
        questions = generateQuestionsByDuration(jobRole, difficulty, duration);
        setLoadingProgress(80);
      }

      // Progressive loading: Step 3 - Finalize session
      setLoadingStage('finalizing');
      setLoadingProgress(90);
      
      // Create session
      const newSession = generateInterviewSession(
        'user', // userId - could get from auth context
        jobRole,
        difficulty,
        questions.length
      );

      setSession(newSession);
      
      // Initialize question states
      const initialStates: QuestionState[] = questions.map(question => ({
        question,
        response: '',
        isAnswered: false,
        timeSpent: 0
      }));
      
      setQuestionStates(initialStates);
      console.log('Question states initialized:', initialStates.length, 'questions');
      setCurrentQuestionIndex(0);
      setQuestionStartTime(Date.now());
      setLoadingProgress(100);
      
      // Save new questions to localStorage for anti-repetition
      const newQuestionTexts = questions.map((q: InterviewQuestion) => q.question);
      const updatedPreviousQuestions = [...previousQuestions, ...newQuestionTexts].slice(-50); // Keep last 50 questions
      setPreviousQuestions(updatedPreviousQuestions);
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          `interview-questions-${jobRole}-${difficulty}`, 
          JSON.stringify(updatedPreviousQuestions)
        );
      }
      
      // Small delay to show completion
      setTimeout(() => {
        setLoadingStage('idle');
        setLoadingProgress(0);
      }, 500);
      
    } catch (err) {
      console.error('Failed to initialize interview:', err);
      setError('Failed to initialize interview. Please try again.');
      setLoadingStage('idle');
      setLoadingProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const setupMediaDevices = async () => {
    try {
      const constraints = {
        video: isVideoEnabled,
        audio: isAudioEnabled
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current && isVideoEnabled) {
        videoRef.current.srcObject = stream;
      }

      // Setup media recorder for video recording
      if (stream) {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9'
        });
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorderRef.current = mediaRecorder;
      }

    } catch (err) {
      console.error('Failed to setup media devices:', err);
      setError('Failed to access camera/microphone. Please check permissions.');
    }
  };

  const startRecording = async () => {
    if (!speechAnalyzerRef.current) {
      setError('Speech analysis not supported in this browser');
      return;
    }

    try {
      await setupMediaDevices();
      
      // Start speech analysis
      await speechAnalyzerRef.current.startRecording();
      
      // Start video recording
      if (mediaRecorderRef.current) {
        recordedChunksRef.current = [];
        mediaRecorderRef.current.start(1000); // Record in 1-second chunks
      }
      
      setIsRecording(true);
      setCurrentTranscript('');
      setQuestionStartTime(Date.now());
      
      // Start real-time feedback monitoring
      startRealTimeFeedback();
      
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!speechAnalyzerRef.current || !isRecording) return;

    try {
      // Stop real-time feedback first
      stopRealTimeFeedback();
      
      // Stop speech analysis and get results
      const speechAnalysis = speechAnalyzerRef.current.stopRecording();
      const finalTranscript = speechAnalyzerRef.current.getCurrentTranscript();
      
      // Stop video recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      // Stop media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      setIsRecording(false);
      
      // Calculate time spent
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      
      // Get AI analysis of the response
      let aiAnalysis = null;
      if (finalTranscript.trim()) {
        try {
          const analysisResult = await analyzeInterviewResponseAction({
            question: questionStates[currentQuestionIndex].question.question,
            response: finalTranscript,
            jobRole,
            difficulty
          });
          aiAnalysis = analysisResult.success ? analysisResult.data.analysis : null;
        } catch (err) {
          console.error('Failed to get AI analysis:', err);
        }
      }
      
      // Update question state
      setQuestionStates(prev => {
        const updated = [...prev];
        updated[currentQuestionIndex] = {
          ...updated[currentQuestionIndex],
          response: finalTranscript,
          speechAnalysis,
          aiAnalysis,
          isAnswered: true,
          timeSpent
        };
        return updated;
      });
      
      setCurrentTranscript(finalTranscript);
      
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setError('Failed to process recording. Please try again.');
    }
  };

  // Add ref to track the feedback interval
  const feedbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRealTimeFeedback = () => {
    // Clear any existing interval
    if (feedbackIntervalRef.current) {
      clearInterval(feedbackIntervalRef.current);
    }
    
    const updateFeedback = () => {
      if (!isRecording || !speechAnalyzerRef.current) {
        // Stop the interval if recording stopped
        if (feedbackIntervalRef.current) {
          clearInterval(feedbackIntervalRef.current);
          feedbackIntervalRef.current = null;
        }
        return;
      }
      
      const transcript = speechAnalyzerRef.current.getCurrentTranscript();
      setCurrentTranscript(transcript);
      
      // Simple real-time feedback calculation
      const wordCount = transcript.trim().split(/\s+/).filter(w => w.length > 0).length;
      const timeElapsed = (Date.now() - questionStartTime) / 1000;
      const wpm = timeElapsed > 0 ? (wordCount / timeElapsed) * 60 : 0;
      
      // Debug logging
      console.log('Real-time feedback update:', {
        transcript: transcript.substring(0, 50) + '...',
        wordCount,
        timeElapsed,
        wpm,
        isRecording
      });
      
      // Update real-time feedback with more responsive calculations
      const feedback = {
        confidence: Math.min(100, Math.max(0, wpm > 0 ? 70 + (wpm - 120) / 10 : wordCount > 0 ? 50 : 0)),
        clarity: Math.min(100, Math.max(0, wordCount > 5 ? 80 : wordCount * 16)),
        pace: Math.min(100, Math.max(0, wpm > 80 && wpm < 200 ? 90 : 100 - Math.abs(wpm - 140) / 2))
      };
      
      console.log('Setting feedback:', feedback);
      setRealTimeFeedback(feedback);
    };
    
    // Start the interval and store the reference
    feedbackIntervalRef.current = setInterval(updateFeedback, 500); // Update every 500ms for more responsive feedback
  };

  const stopRealTimeFeedback = () => {
    if (feedbackIntervalRef.current) {
      clearInterval(feedbackIntervalRef.current);
      feedbackIntervalRef.current = null;
    }
  };

  const nextQuestion = () => {
    console.log('Next question clicked. Current index:', currentQuestionIndex, 'Total questions:', questionStates.length);
    if (currentQuestionIndex < questionStates.length - 1) {
      console.log('Moving to next question:', currentQuestionIndex + 1);
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
      setCurrentTranscript('');
      setRealTimeFeedback({ confidence: 0, clarity: 0, pace: 0 });
    } else {
      console.log('Already at last question, cannot proceed');
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuestionStartTime(Date.now());
      setCurrentTranscript('');
      setRealTimeFeedback({ confidence: 0, clarity: 0, pace: 0 });
    }
  };

  const completeInterview = () => {
    if (!session) return;
    
    const completedSession: InterviewSession = {
      ...session,
      responses: questionStates.map(state => ({
        questionId: state.question.id,
        response: state.response,
        duration: state.timeSpent,
        speechAnalysis: state.speechAnalysis || {
          wordsPerMinute: 0,
          pauseFrequency: 0,
          fillerWords: 0,
          clarity: 0,
          volume: 0,
          tone: 'confident' as const
        },
        timestamp: new Date()
      })),
      endTime: new Date(),
      totalScore: calculateOverallScore(),
      status: 'completed' as const
    };
    
    onComplete?.(completedSession);
  };

  const calculateOverallScore = (): number => {
    const answeredQuestions = questionStates.filter(state => state.isAnswered);
    if (answeredQuestions.length === 0) return 0;
    
    const totalScore = answeredQuestions.reduce((sum, state) => {
      const speechScore = state.speechAnalysis ? 
        (state.speechAnalysis.clarity + 
         (100 - state.speechAnalysis.fillerWords * 5) + 
         (state.speechAnalysis.wordsPerMinute > 120 && state.speechAnalysis.wordsPerMinute < 180 ? 80 : 60)) / 3
        : 50;
      
      const aiScore = state.aiAnalysis?.overallScore || 50;
      
      return sum + (speechScore + aiScore) / 2;
    }, 0);
    
    return Math.round(totalScore / answeredQuestions.length);
  };

  const currentQuestion = questionStates[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questionStates.length) * 100;
  const isLastQuestion = currentQuestionIndex === questionStates.length - 1;
  const allQuestionsAnswered = questionStates.every(state => state.isAnswered);

  if (isLoading) {
    const getLoadingMessage = () => {
      switch (loadingStage) {
        case 'generating':
          return 'Generating personalized questions...';
        case 'caching':
          return 'Loading cached questions...';
        case 'finalizing':
          return 'Finalizing your interview...';
        default:
          return 'Preparing your interview...';
      }
    };

    return (
      <Card className={cn('w-full max-w-4xl mx-auto', className)}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-6 w-full max-w-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <div className="space-y-2">
              <p className="text-lg font-medium">{getLoadingMessage()}</p>
              <p className="text-sm text-muted-foreground">
                {loadingStage === 'generating' && 'Creating questions tailored to your role and experience level...'}
                {loadingStage === 'caching' && 'Retrieving your personalized question set...'}
                {loadingStage === 'finalizing' && 'Setting up your interview environment...'}
                {loadingStage === 'idle' && 'Getting everything ready for you...'}
              </p>
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="text-gray-800 dark:text-gray-300">Progress</div>
            <div className="text-gray-900 dark:text-white">{loadingProgress}%</div>
              </div>
              <Progress value={loadingProgress} className="w-full h-2" />
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <div className="flex space-x-1">
                <div className={cn('w-2 h-2 rounded-full', loadingProgress >= 20 ? 'bg-primary' : 'bg-muted')} />
                <div className={cn('w-2 h-2 rounded-full', loadingProgress >= 40 ? 'bg-primary' : 'bg-muted')} />
                <div className={cn('w-2 h-2 rounded-full', loadingProgress >= 60 ? 'bg-primary' : 'bg-muted')} />
                <div className={cn('w-2 h-2 rounded-full', loadingProgress >= 80 ? 'bg-primary' : 'bg-muted')} />
                <div className={cn('w-2 h-2 rounded-full', loadingProgress >= 100 ? 'bg-primary' : 'bg-muted')} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn('w-full max-w-4xl mx-auto', className)}>
        <CardContent className="p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={initializeInterview} 
            className="mt-4"
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!session || !currentQuestion) {
    return null;
  }

  return (
    <div className={cn('w-full max-w-6xl mx-auto space-y-6', className)}>
      {/* Curated Questions Notification */}
      {usingFallbackQuestions && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>✨ Premium Curated Questions:</strong> You're getting expertly crafted interview questions 
            designed for optimal practice and reliable performance.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Interview Simulator
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                {jobRole} • {difficulty} level • Question {currentQuestionIndex + 1} of {questionStates.length}
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  🎯 Diverse Questions
                </Badge>
                {previousQuestions.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    🚫 Anti-Repeat ({previousQuestions.length})
                  </Badge>
                )}
                <Button 
                  onClick={initializeInterview}
                  variant="outline"
                  size="sm"
                  className="text-xs ml-2"
                  disabled={isLoading}
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Fresh Questions
                </Button>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                {Math.round((Date.now() - questionStartTime) / 1000)}s
              </Badge>
              <Badge variant={isRecording ? 'destructive' : 'secondary'}>
                {isRecording ? 'Recording' : 'Ready'}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Interview Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {getCategoryDisplayName(currentQuestion.question.category)}
                  </Badge>
                  {currentQuestion.question.questionType && (
                    <Badge variant="secondary" className="text-xs">
                      {getQuestionTypeIcon(currentQuestion.question.questionType)} {currentQuestion.question.questionType}
                    </Badge>
                  )}
                </div>
                <Badge variant={currentQuestion.question.difficulty === 'senior' ? 'destructive' : 
                              currentQuestion.question.difficulty === 'mid' ? 'default' : 'secondary'}>
                  {currentQuestion.question.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4">
                {currentQuestion.question.question}
              </h3>
              
              {currentQuestion.question.tips && (
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tip:</strong> {currentQuestion.question.tips}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video Recording Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Video Recording
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4">
                {isVideoEnabled ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <VideoOff className="w-12 h-12" />
                  </div>
                )}
                
                {isRecording && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    REC
                  </div>
                )}
              </div>
              
              {/* Recording Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                >
                  {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                >
                  {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                
                {!isRecording ? (
                  <Button onClick={startRecording} className="px-8">
                    <Play className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="destructive" className="px-8">
                    <Square className="w-4 h-4 mr-2" />
                    Stop Recording
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {questionStates.map((state, index) => (
                <Button
                  key={index}
                  variant={index === currentQuestionIndex ? 'default' : 
                          state.isAnswered ? 'secondary' : 'outline'}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {state.isAnswered ? <CheckCircle className="w-3 h-3" /> : index + 1}
                </Button>
              ))}
            </div>
            
            {!isLastQuestion ? (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Next button clicked, isLastQuestion:', isLastQuestion);
                  nextQuestion();
                }}
              >
                Next
                <SkipForward className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={completeInterview}
                disabled={!allQuestionsAnswered}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Interview
              </Button>
            )}
          </div>
        </div>

        {/* Real-time Feedback Sidebar */}
        <div className="space-y-6">
          {/* Live Transcript */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Live Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-lg min-h-[100px] max-h-[200px] overflow-y-auto">
                <p className="text-sm">
                  {currentTranscript || 'Start recording to see live transcript...'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Feedback */}
          {isRecording && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Real-time Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="text-gray-800 dark:text-gray-300">Confidence</div>
                <div className="text-gray-900 dark:text-white">{Math.round(realTimeFeedback.confidence)}%</div>
                  </div>
                  <Progress value={realTimeFeedback.confidence} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="text-gray-800 dark:text-gray-300">Clarity</div>
                <div className="text-gray-900 dark:text-white">{Math.round(realTimeFeedback.clarity)}%</div>
                  </div>
                  <Progress value={realTimeFeedback.clarity} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="text-gray-800 dark:text-gray-300">Pace</div>
                <div className="text-gray-900 dark:text-white">{Math.round(realTimeFeedback.pace)}%</div>
                  </div>
                  <Progress value={realTimeFeedback.pace} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Question Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {questionStates.map((state, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                      index === currentQuestionIndex ? 'bg-primary text-primary-foreground' :
                      state.isAnswered ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                    )}>
                      {state.isAnswered ? <CheckCircle className="w-3 h-3" /> : index + 1}
                    </div>
                    <span className={cn(
                      index === currentQuestionIndex ? 'font-medium' : '',
                      state.isAnswered ? 'text-green-700' : 'text-muted-foreground'
                    )}>
                      Question {index + 1}
                    </span>
                    {state.isAnswered && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        {state.timeSpent}s
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default InterviewSimulator;