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
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Clock,
  TrendingUp,
  User,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockAIService } from '@/lib/mock-ai-service';
import type { 
  InterviewPhase, 
  InterviewSession,
  AIInterviewer 
} from '@/app/closed-door-interview/page';

interface MockClosedDoorInterviewProps {
  selectedInterviewer: AIInterviewer;
  onComplete: (session: InterviewSession) => void;
  className?: string;
}

type MockQuestionPhase = 'introduction' | 'behavioral' | 'technical' | 'problem-solving' | 'closing';

interface MockQuestion {
  id: string;
  question: string;
  phase: MockQuestionPhase;
  expectedDuration: number;
}

export function MockClosedDoorInterview({ 
  selectedInterviewer, 
  onComplete, 
  className 
}: MockClosedDoorInterviewProps) {
  // Core state
  const [currentPhase, setCurrentPhase] = useState<InterviewPhase>('interview');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [sessionStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [interviewProgress, setInterviewProgress] = useState(0);

  // Mock AI service
  const mockAI = useRef(mockAIService);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize mock interview
  useEffect(() => {
    initializeMockInterview();
    setupCamera();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedInterviewer]);

  const initializeMockInterview = () => {
    const mockQuestions: MockQuestion[] = [
      {
        id: '1',
        question: `Hello! I'm ${selectedInterviewer.name}. Thank you for taking the time to interview with us today. Could you start by telling me a bit about yourself and what interests you about this position?`,
        phase: 'introduction',
        expectedDuration: 120
      },
      {
        id: '2', 
        question: 'Can you describe a challenging project you worked on recently and how you approached solving the problems you encountered?',
        phase: 'behavioral',
        expectedDuration: 180
      },
      {
        id: '3',
        question: 'Tell me about a time when you had to work with a difficult team member. How did you handle the situation?',
        phase: 'behavioral', 
        expectedDuration: 150
      },
      {
        id: '4',
        question: 'Walk me through your technical approach to building a scalable web application. What technologies would you choose and why?',
        phase: 'technical',
        expectedDuration: 240
      },
      {
        id: '5',
        question: 'How would you debug a performance issue in a web application that\'s running slowly for users?',
        phase: 'technical',
        expectedDuration: 200
      },
      {
        id: '6',
        question: 'Imagine you\'re given a project with a very tight deadline, but the requirements are unclear. How would you proceed?',
        phase: 'problem-solving',
        expectedDuration: 180
      },
      {
        id: '7',
        question: 'Do you have any questions for me about the role, the team, or the company culture?',
        phase: 'closing',
        expectedDuration: 120
      }
    ];
    
    setQuestions(mockQuestions);
    setQuestionStartTime(Date.now());
  };

  const setupCamera = async () => {
    try {
      // Try to get camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: isVideoEnabled, 
        audio: isAudioEnabled 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current && isVideoEnabled) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.warn('Camera/microphone access denied or not available:', error);
      // Continue without camera - this is a mock interview anyway
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setQuestionStartTime(Date.now());
    setCurrentResponse('');
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Simulate processing the response
    setTimeout(() => {
      handleResponseSubmit();
    }, 1000);
  };

  const handleResponseSubmit = () => {
    const mockResponse = currentResponse || "Thank you for the question. I believe my experience in software development and problem-solving skills make me a good fit for this role. I'm excited about the opportunity to contribute to your team.";
    
    const newResponses = [...responses, mockResponse];
    setResponses(newResponses);
    setCurrentResponse('');

    // Move to next question or complete interview
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      updatePhase(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
    } else {
      completeInterview(newResponses);
    }

    // Update progress
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    setInterviewProgress(progress);
  };

  const updatePhase = (questionIndex: number) => {
    if (questionIndex < questions.length) {
      const mockPhase = questions[questionIndex].phase;
      // Convert MockQuestionPhase to InterviewPhase
      const interviewPhase: InterviewPhase = mockPhase === 'closing' ? 'results' : 'interview';
      setCurrentPhase(interviewPhase);
    }
  };

  const completeInterview = (finalResponses: string[]) => {
    const sessionDuration = Date.now() - sessionStartTime;
    
    // Convert string responses to MockInterviewResponse format
    const mockResponses = finalResponses.map((response, index) => ({
      question: questions[index]?.question || '',
      response,
      analysis: {
        confidence: 75 + Math.random() * 20,
        clarity: 70 + Math.random() * 25,
        relevance: 80 + Math.random() * 15,
        suggestions: ['Great response!']
      }
    }));
    
    // Generate mock performance metrics
    const mockMetrics = mockAI.current.generatePerformanceMetrics(mockResponses);
    const mockFeedback = mockAI.current.generateFeedback(mockResponses, mockMetrics);

    const session: InterviewSession = {
      id: `mock-session-${Date.now()}`,
      interviewerId: selectedInterviewer.id,
      startTime: sessionStartTime,
      endTime: Date.now(),
      duration: sessionDuration,
      phase: 'completed',
      questions: questions.map(q => q.question),
      responses: finalResponses,
      performanceMetrics: mockMetrics,
      feedback: mockFeedback,
      overallScore: mockMetrics.overallScore,
      isCompleted: true
    };

    onComplete(session);
  };

  const skipQuestion = () => {
    handleResponseSubmit();
  };

  const toggleVideo = async () => {
    setIsVideoEnabled(!isVideoEnabled);
    
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
      }
    }
  };

  const toggleAudio = async () => {
    setIsAudioEnabled(!isAudioEnabled);
    
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
      }
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const timeElapsed = Math.floor((Date.now() - questionStartTime) / 1000);

  if (!currentQuestion) {
    return (
      <Card className={cn("w-full max-w-4xl mx-auto", className)}>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>Loading interview questions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{selectedInterviewer.name}</CardTitle>
              <CardDescription>{selectedInterviewer.background}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="capitalize">
            {currentPhase.replace('-', ' ')}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
          </div>
          <Progress value={interviewProgress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Video Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Interviewer Avatar */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium">{selectedInterviewer.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedInterviewer.specialties.join(', ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidate Video */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-muted relative">
                {isVideoEnabled ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <User className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Camera Off</p>
                    </div>
                  </div>
                )}
                
                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded text-xs">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    REC
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Section */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Bot className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <CardTitle className="text-base mb-2">Interview Question</CardTitle>
                <p className="text-sm leading-relaxed">{currentQuestion.question}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Response Section */}
        {isRecording && (
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <CardTitle className="text-base mb-2">Your Response</CardTitle>
                  <textarea
                    value={currentResponse}
                    onChange={(e) => setCurrentResponse(e.target.value)}
                    placeholder="Type your response here or speak aloud..."
                    className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVideo}
            className={cn(!isVideoEnabled && "bg-red-50 border-red-200")}
          >
            {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4 text-red-500" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleAudio}
            className={cn(!isAudioEnabled && "bg-red-50 border-red-200")}
          >
            {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-red-500" />}
          </Button>

          <Button
            onClick={toggleRecording}
            size="lg"
            className={cn(
              "px-8",
              isRecording 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-primary hover:bg-primary/90"
            )}
          >
            {isRecording ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop & Submit
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Response
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={skipQuestion}
            disabled={isRecording}
          >
            <SkipForward className="h-4 w-4 mr-2" />
            Skip
          </Button>
        </div>

        {/* Progress Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>This is a mock interview simulation that works completely offline.</p>
          <p>No API keys or external services required.</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default MockClosedDoorInterview;