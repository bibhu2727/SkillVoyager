import { AIInterviewer, InterviewerPanel, createInterviewerPanel } from './ai-interviewers';
import { speakAsInterviewer } from './voice-synthesis';
import { comprehensiveRecorder } from './comprehensive-recorder';

export interface InterviewQuestion {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedDuration: number; // in seconds
  followUpQuestions?: string[];
}

export interface PanelInterviewSession {
  id: string;
  panel: InterviewerPanel;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  startTime: number;
  endTime?: number;
  responses: Array<{
    questionId: string;
    interviewerId: string;
    response: string;
    timestamp: number;
    duration: number;
    metrics?: any;
  }>;
  isActive: boolean;
  questionResponses?: { [key: string]: string };
}

class PanelInterviewManager {
  private currentSession: PanelInterviewSession | null = null;
  private questionBank: InterviewQuestion[] = [];
  private speechRecognition: any = null;
  private isListening = false;
  private currentResponse = '';

  constructor() {
    this.initializeQuestionBank();
    this.initializeSpeechRecognition();
  }

  private initializeQuestionBank(): void {
    this.questionBank = [
      {
        id: 'q1',
        text: "Tell me about yourself and your background in this field.",
        category: 'introduction',
        difficulty: 'easy',
        expectedDuration: 120,
        followUpQuestions: ["What specific achievements are you most proud of?"]
      },
      {
        id: 'q2',
        text: "Describe a challenging project you worked on and how you overcame the obstacles.",
        category: 'behavioral',
        difficulty: 'medium',
        expectedDuration: 180,
        followUpQuestions: ["What would you do differently if you faced a similar situation again?"]
      },
      {
        id: 'q3',
        text: "How do you handle working under pressure and tight deadlines?",
        category: 'behavioral',
        difficulty: 'medium',
        expectedDuration: 150,
        followUpQuestions: ["Can you give me a specific example?"]
      },
      {
        id: 'q4',
        text: "What are your greatest strengths and how do they apply to this role?",
        category: 'strengths',
        difficulty: 'easy',
        expectedDuration: 120,
        followUpQuestions: ["How have you developed these strengths over time?"]
      },
      {
        id: 'q5',
        text: "Describe a time when you had to work with a difficult team member. How did you handle it?",
        category: 'teamwork',
        difficulty: 'medium',
        expectedDuration: 180,
        followUpQuestions: ["What did you learn from that experience?"]
      },
      {
        id: 'q6',
        text: "Where do you see yourself in 5 years, and how does this position fit into your career goals?",
        category: 'career_goals',
        difficulty: 'easy',
        expectedDuration: 150,
        followUpQuestions: ["What steps are you taking to achieve these goals?"]
      },
      {
        id: 'q7',
        text: "Tell me about a time when you had to learn a new skill quickly. How did you approach it?",
        category: 'learning',
        difficulty: 'medium',
        expectedDuration: 180,
        followUpQuestions: ["How do you stay updated with industry trends?"]
      },
      {
        id: 'q8',
        text: "Describe a situation where you had to make a difficult decision with limited information.",
        category: 'decision_making',
        difficulty: 'hard',
        expectedDuration: 200,
        followUpQuestions: ["What factors did you consider in making that decision?"]
      },
      {
        id: 'q9',
        text: "How do you prioritize tasks when you have multiple competing deadlines?",
        category: 'time_management',
        difficulty: 'medium',
        expectedDuration: 150,
        followUpQuestions: ["What tools or methods do you use for organization?"]
      },
      {
        id: 'q10',
        text: "Tell me about a time when you received constructive criticism. How did you handle it?",
        category: 'feedback',
        difficulty: 'medium',
        expectedDuration: 180,
        followUpQuestions: ["How did you implement the feedback you received?"]
      },
      {
        id: 'q11',
        text: "Describe a situation where you had to solve a complex problem. What was your approach?",
        category: 'problem_solving',
        difficulty: 'hard',
        expectedDuration: 200,
        followUpQuestions: ["What tools or methodologies did you use?"]
      },
      {
        id: 'q12',
        text: "Tell me about a time when you had to lead a team or take initiative on a project.",
        category: 'leadership',
        difficulty: 'medium',
        expectedDuration: 180,
        followUpQuestions: ["What leadership style do you prefer and why?"]
      },
      {
        id: 'q13',
        text: "How do you ensure effective communication in a team environment?",
        category: 'communication',
        difficulty: 'medium',
        expectedDuration: 150,
        followUpQuestions: ["Can you give an example of when communication was crucial?"]
      },
      {
        id: 'q14',
        text: "What motivates you to perform your best work?",
        category: 'behavioral',
        difficulty: 'easy',
        expectedDuration: 120,
        followUpQuestions: ["How do you maintain motivation during challenging times?"]
      },
      {
        id: 'q15',
        text: "Describe a time when you had to adapt to a significant change at work.",
        category: 'behavioral',
        difficulty: 'medium',
        expectedDuration: 180,
        followUpQuestions: ["How do you typically handle change?"]
      }
    ];
  }

  private initializeSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.speechRecognition = new SpeechRecognition();
      
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = 'en-US';

      this.speechRecognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        this.currentResponse = finalTranscript + interimTranscript;
        
        // Add to comprehensive recorder transcript
        if (finalTranscript) {
          comprehensiveRecorder.addTranscriptEntry(finalTranscript, event.results[event.resultIndex][0].confidence);
        }
      };

      this.speechRecognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
        
        // Handle different error types
        if (event.error === 'network') {
          console.log('Network error, retrying in 2 seconds...');
          setTimeout(() => {
            if (this.isListening) {
              this.startListening();
            }
          }, 2000);
        } else if (event.error === 'not-allowed') {
          console.error('Microphone access denied');
        } else if (event.error === 'aborted') {
          console.log('Speech recognition aborted');
        }
      };

      this.speechRecognition.onend = () => {
        this.isListening = false;
        // Only restart if we should still be listening
        if (this.currentSession?.isActive) {
          setTimeout(() => {
            this.startListening();
          }, 100);
        }
      };

      this.speechRecognition.onstart = () => {
        this.isListening = true;
        console.log('Panel speech recognition started');
      };
    }
  }

  public async startPanelInterview(): Promise<string> {
    // Create new panel and session
    const panel = createInterviewerPanel();
    const selectedQuestions = this.selectQuestionsForPanel(panel);

    this.currentSession = {
      id: `panel_interview_${Date.now()}`,
      panel,
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      startTime: Date.now(),
      responses: [],
      isActive: true
    };

    // Start comprehensive recording
    await comprehensiveRecorder.startRecording();

    // Start speech recognition
    this.startListening();

    console.log('Panel interview started with interviewers:', panel.interviewers.map(i => i.name));
    
    return this.currentSession.id;
  }

  public async askNextQuestion(): Promise<{ question: string; interviewer: AIInterviewer; isComplete: boolean }> {
    if (!this.currentSession || !this.currentSession.isActive) {
      throw new Error('No active interview session');
    }

    const session = this.currentSession;
    
    // Check if interview is complete
    if (session.currentQuestionIndex >= session.questions.length) {
      return { question: '', interviewer: session.panel.interviewers[0], isComplete: true };
    }

    // Get current question
    const currentQuestion = session.questions[session.currentQuestionIndex];
    
    // Rotate to next interviewer
    const currentInterviewer = session.panel.interviewers[session.panel.currentSpeaker];
    session.panel.currentSpeaker = (session.panel.currentSpeaker + 1) % session.panel.interviewers.length;
    session.panel.questionCount++;

    console.log(`${currentInterviewer.name} will ask: ${currentQuestion.text}`);

    // Return question immediately so UI can display it
    const result = {
      question: currentQuestion.text,
      interviewer: currentInterviewer,
      isComplete: false
    };

    // Add delay before speaking to ensure text appears first
    setTimeout(async () => {
      try {
        await speakAsInterviewer(currentQuestion.text, currentInterviewer.voiceId);
        console.log(`${currentInterviewer.name} spoke: ${currentQuestion.text}`);
      } catch (error) {
        console.error('Failed to speak question:', error);
      }
    }, 1500); // 1.5 second delay

    return result;
  }

  public async submitResponse(): Promise<void> {
    if (!this.currentSession || !this.currentSession.isActive) {
      throw new Error('No active interview session');
    }

    const session = this.currentSession;
    const currentQuestion = session.questions[session.currentQuestionIndex];
    const currentInterviewer = session.panel.interviewers[(session.panel.currentSpeaker - 1 + session.panel.interviewers.length) % session.panel.interviewers.length];

    // Stop listening temporarily
    this.stopListening();

    // Record the response
    session.responses.push({
      questionId: currentQuestion.id,
      interviewerId: currentInterviewer.id,
      response: this.currentResponse,
      timestamp: Date.now(),
      duration: 0, // Will be calculated
      metrics: comprehensiveRecorder.getRecordingSession()?.metrics
    });

    // Move to next question
    session.currentQuestionIndex++;

    // Clear current response
    this.currentResponse = '';

    // Resume listening for next question
    setTimeout(() => {
      this.startListening();
    }, 1000);

    console.log('Response submitted, moving to next question');
  }

  public async endPanelInterview(): Promise<PanelInterviewSession> {
    if (!this.currentSession) {
      throw new Error('No active interview session');
    }

    // Stop listening
    this.stopListening();

    // Stop recording
    const recordingSession = await comprehensiveRecorder.stopRecording();

    // Finalize session
    this.currentSession.endTime = Date.now();
    this.currentSession.isActive = false;

    const completedSession = { ...this.currentSession };
    this.currentSession = null;

    console.log('Panel interview completed');
    return completedSession;
  }

  private selectQuestionsForPanel(panel: InterviewerPanel): InterviewQuestion[] {
    // Select exactly 12 questions for proper rotation (4 questions per interviewer)
    const selectedQuestions: InterviewQuestion[] = [];
    const usedCategories = new Set<string>();

    // Ensure variety in question types - exactly 12 questions
    const categories = ['introduction', 'behavioral', 'strengths', 'teamwork', 'career_goals', 'learning', 'decision_making', 'time_management', 'feedback', 'problem_solving', 'leadership', 'communication'];
    
    // First, select one question from each category to ensure variety
    for (const category of categories) {
      const categoryQuestions = this.questionBank.filter(q => q.category === category);
      if (categoryQuestions.length > 0 && selectedQuestions.length < 12) {
        const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
        selectedQuestions.push(randomQuestion);
        usedCategories.add(category);
      }
    }

    // If we still need more questions to reach 12, add from remaining pool
    while (selectedQuestions.length < 12) {
      const remainingQuestions = this.questionBank.filter(q => 
        !selectedQuestions.some(sq => sq.id === q.id)
      );
      if (remainingQuestions.length === 0) break;
      
      const randomQuestion = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
      selectedQuestions.push(randomQuestion);
    }

    // Ensure we have exactly 12 questions
    return selectedQuestions.slice(0, 12);
  }

  private startListening(): void {
    if (this.speechRecognition && !this.isListening) {
      try {
        this.speechRecognition.start();
      } catch (error: any) {
        if (error.name === 'InvalidStateError') {
          console.log('Speech recognition already running, stopping first...');
          this.speechRecognition.stop();
          setTimeout(() => {
            if (!this.isListening) {
              this.speechRecognition.start();
            }
          }, 100);
        } else {
          console.error('Error starting speech recognition:', error);
        }
      }
    }
  }

  private stopListening(): void {
    if (this.speechRecognition && this.isListening) {
      this.isListening = false;
      try {
        this.speechRecognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }

  public getCurrentSession(): PanelInterviewSession | null {
    return this.currentSession;
  }

  public getCurrentResponse(): string {
    return this.currentResponse;
  }

  public isSessionActive(): boolean {
    return this.currentSession?.isActive || false;
  }
}

// Singleton instance
export const panelInterviewManager = new PanelInterviewManager();

// Utility functions
export function formatInterviewDuration(startTime: number, endTime?: number): string {
  const duration = (endTime || Date.now()) - startTime;
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function calculateInterviewProgress(session: PanelInterviewSession): number {
  return Math.round((session.currentQuestionIndex / session.questions.length) * 100);
}