'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  Play, 
  RotateCcw, 
  Trophy,
  Eye,
  Volume2,
  Brain,
  User,
  Star,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { getRandomInterviewer, AIInterviewer } from '@/lib/ai-interviewers';
import { PanelInterviewSession } from '@/lib/panel-interview-manager';
import { 
  LazyInterviewerSelection, 
  LazyClosedDoorSimulator,
  preloadInterviewComponents 
} from '@/components/lazy';
import InterviewErrorBoundary from '@/components/closed-door-interview/interview-error-boundary';
import ErrorBoundary from '@/components/error-boundary';

type InterviewPhase = 'setup' | 'interviewer-selection' | 'interview' | 'results';

interface InterviewSession {
  id: string;
  interviewer: AIInterviewer;
  startTime: Date;
  endTime?: Date;
  questions: string[];
  responses: string[];
  performanceMetrics: {
    eyeContact: number;
    speechClarity: number;
    confidence: number;
    bodyLanguage: number;
    overallScore: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  };
}

export default function ClosedDoorInterviewPage() {
  const [currentPhase, setCurrentPhase] = useState<InterviewPhase>('setup');
  const [selectedInterviewer, setSelectedInterviewer] = useState<AIInterviewer | null>(null);
  const [interviewSession, setInterviewSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Preload interview components on mount
  useEffect(() => {
    preloadInterviewComponents();
  }, []);

  // Memoize handlers to prevent unnecessary re-renders
  const handleInterviewerSelected = useCallback(async (interviewer: AIInterviewer) => {
    setIsTransitioning(true);
    setIsLoading(true);
    setSelectedInterviewer(interviewer);
    
    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentPhase('interview');
    
    // Create new interview session
    const session: InterviewSession = {
      id: `interview-${Date.now()}`,
      interviewer,
      startTime: new Date(),
      questions: [],
      responses: [],
      performanceMetrics: {
        eyeContact: 0,
        speechClarity: 0,
        confidence: 0,
        bodyLanguage: 0,
        overallScore: 0,
      },
      feedback: {
        strengths: [],
        improvements: [],
        recommendations: [],
      },
    };
    
    setInterviewSession(session);
    setIsLoading(false);
    setIsTransitioning(false);
  }, []);

  const handleRandomSelection = useCallback(async () => {
    setIsTransitioning(true);
    setIsLoading(true);
    
    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const randomInterviewer = getRandomInterviewer();
    await handleInterviewerSelected(randomInterviewer);
  }, [handleInterviewerSelected]);

  const handleInterviewComplete = useCallback(async (sessionData: PanelInterviewSession) => {
    setIsTransitioning(true);
    setIsLoading(true);
    
    if (interviewSession) {
      // Convert PanelInterviewSession to InterviewSession format
      const updatedSession: InterviewSession = {
        ...interviewSession,
        endTime: new Date(),
        // Convert timestamp to Date if needed
        startTime: sessionData.startTime ? new Date(sessionData.startTime) : interviewSession.startTime,
        // Map panel interview data to our session format
        questions: sessionData.questions.map(q => q.text),
        responses: sessionData.responses.map(r => r.response),
        // You can add more mapping here as needed
      };
      setInterviewSession(updatedSession);
    }
    
    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentPhase('results');
    setIsLoading(false);
    setIsTransitioning(false);
  }, [interviewSession]);

  const resetInterview = useCallback(async () => {
    setIsTransitioning(true);
    setIsLoading(true);
    
    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentPhase('setup');
    setSelectedInterviewer(null);
    setInterviewSession(null);
    setIsLoading(false);
    setIsTransitioning(false);
  }, []);

  const startInterviewerSelection = useCallback(async () => {
    setIsTransitioning(true);
    setIsLoading(true);
    
    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentPhase('interviewer-selection');
    setIsLoading(false);
    setIsTransitioning(false);
  }, []);

  const renderSetupPhase = useMemo(() => {
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-8 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mb-4">
            <Video className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Closed Door Interview
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Experience a realistic one-on-one interview simulation with AI-powered feedback and analysis
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Real-time Recording
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Advanced video and audio analysis tracks your performance metrics in real-time
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                AI-Powered Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get detailed feedback on communication skills, confidence, and body language
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                Instant Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Receive comprehensive performance reports immediately after your session
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Requirements */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">System Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Required:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Camera access for video recording</li>
                  <li>• Microphone for audio capture</li>
                  <li>• Stable internet connection</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Recommended:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Chrome or Firefox browser</li>
                  <li>• Quiet environment</li>
                  <li>• Good lighting conditions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Button */}
        <div className="flex justify-center pt-4">
          <Button 
            size="lg" 
            onClick={startInterviewerSelection}
            className="w-full sm:w-auto px-8 py-3 text-base sm:text-lg"
            disabled={isLoading || isTransitioning}
          >
            {isLoading || isTransitioning ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Play className="mr-2 h-5 w-5" />
            )}
            {isLoading || isTransitioning ? 'Loading...' : 'Start Interview Simulation'}
          </Button>
        </div>
      </div>
    );
  }, [startInterviewerSelection, isLoading]);

  const renderInterviewerSelection = useMemo(() => (
    <div className="max-w-4xl mx-auto">
      <LazyInterviewerSelection
        onInterviewerSelected={handleInterviewerSelected}
        onRandomSelection={handleRandomSelection}
        onBack={() => setCurrentPhase('setup')}
      />
    </div>
  ), [handleInterviewerSelected, handleRandomSelection]);

  const renderInterview = useMemo(() => (
    <div className="max-w-6xl mx-auto">
      <LazyClosedDoorSimulator
        onComplete={handleInterviewComplete}
      />
    </div>
  ), [handleInterviewComplete]);

  const renderResults = useMemo(() => {
    if (!interviewSession) return null;

    const { performanceMetrics, feedback, interviewer, startTime, endTime } = interviewSession;
    const duration = endTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60) : 0;

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Trophy className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Interview Complete!</h1>
          <p className="text-muted-foreground">
            You completed a {duration}-minute interview with {interviewer.name}
          </p>
        </div>

        {/* Overall Score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg sm:text-xl">Overall Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-2">
                {Math.round(performanceMetrics.overallScore)}
              </div>
              <div className="text-base sm:text-lg text-muted-foreground">out of 100</div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center space-y-2">
                <Eye className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-blue-500" />
                <div className="text-xs sm:text-sm font-medium">Eye Contact</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">{Math.round(performanceMetrics.eyeContact)}</div>
                <Progress value={performanceMetrics.eyeContact} className="h-2" />
              </div>
              
              <div className="text-center space-y-2">
                <Volume2 className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-green-500" />
                <div className="text-xs sm:text-sm font-medium">Speech Clarity</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">{Math.round(performanceMetrics.speechClarity)}</div>
                <Progress value={performanceMetrics.speechClarity} className="h-2" />
              </div>
              
              <div className="text-center space-y-2">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-yellow-500" />
                <div className="text-xs sm:text-sm font-medium">Confidence</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">{Math.round(performanceMetrics.confidence)}</div>
                <Progress value={performanceMetrics.confidence} className="h-2" />
              </div>
              
              <div className="text-center space-y-2">
                <User className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-purple-500" />
                <div className="text-xs sm:text-sm font-medium">Body Language</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">{Math.round(performanceMetrics.bodyLanguage)}</div>
                <Progress value={performanceMetrics.bodyLanguage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400 flex items-center gap-2 text-base sm:text-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-amber-600 dark:text-amber-400 flex items-center gap-2 text-base sm:text-lg">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {feedback.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">{index + 1}</span>
                  </div>
                  <span className="text-xs sm:text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Button variant="outline" onClick={resetInterview} className="w-full sm:w-auto" disabled={isLoading || isTransitioning}>
            {isLoading || isTransitioning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="mr-2 h-4 w-4" />
            )}
            {isLoading || isTransitioning ? 'Loading...' : 'Try Another Interview'}
          </Button>
          <Button onClick={() => setCurrentPhase('setup')} className="w-full sm:w-auto" disabled={isLoading || isTransitioning}>
            {isLoading || isTransitioning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isLoading || isTransitioning ? 'Loading...' : 'New Session'}
          </Button>
        </div>
      </div>
    );
  }, [interviewSession, resetInterview, isLoading]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative">
        {/* Loading overlay for smooth transitions */}
        {isTransitioning && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  Loading...
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div className="container mx-auto px-4 py-8 w-full max-w-full overflow-hidden">
          {currentPhase === 'setup' && renderSetupPhase}
          {currentPhase === 'interviewer-selection' && (
            <InterviewErrorBoundary>
              {renderInterviewerSelection}
            </InterviewErrorBoundary>
          )}
          {currentPhase === 'interview' && (
            <InterviewErrorBoundary>
              {renderInterview}
            </InterviewErrorBoundary>
          )}
          {currentPhase === 'results' && renderResults}
        </div>
      </div>
    </ErrorBoundary>
  );
}