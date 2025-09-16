'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  MessageSquare,
  Volume2,
  Target,
  Award,
  BookOpen,
  Lightbulb,
  Download,
  Share2,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InterviewSession, SpeechAnalysis } from '@/lib/interview-simulator';

interface InterviewResultsDashboardProps {
  session: InterviewSession;
  onRetake?: () => void;
  onDownloadReport?: () => void;
  onShare?: () => void;
  className?: string;
}

interface ScoreBreakdown {
  category: string;
  score: number;
  maxScore: number;
  feedback: string;
  icon: React.ReactNode;
  color: string;
}

interface ImprovementArea {
  area: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  actionItems: string[];
  resources: string[];
}

export function InterviewResultsDashboard({
  session,
  onRetake,
  onDownloadReport,
  onShare,
  className
}: InterviewResultsDashboardProps) {
  // Calculate detailed scores
  const scoreBreakdown = calculateScoreBreakdown(session);
  const improvementAreas = generateImprovementAreas(session);
  const overallGrade = getOverallGrade(session.overallScore || 0);
  const strengths = identifyStrengths(session);
  const timeAnalysis = analyzeTimeSpent(session);

  return (
    <div className={cn('w-full max-w-6xl mx-auto space-y-6', className)}>
      {/* Header with Overall Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className={cn(
              'w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white',
              (session.overallScore || 0) >= 80 ? 'bg-green-500' :
              (session.overallScore || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            )}>
              {session.overallScore || 0}
            </div>
          </div>
          <CardTitle className="text-2xl mb-2">
            Interview Complete!
          </CardTitle>
          <CardDescription className="text-lg">
            <Badge 
              variant={overallGrade.variant as any}
              className="text-sm px-3 py-1"
            >
              {overallGrade.grade} - {overallGrade.description}
            </Badge>
          </CardDescription>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {session.jobRole}
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              {session.difficulty} level
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {Math.round(session.responses.reduce((sum, r) => sum + (r.timeSpent || 0), 0) / 60)} min
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {scoreBreakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn('p-1 rounded', item.color)}>
                        {item.icon}
                      </div>
                      <div className="text-gray-900 dark:text-white font-medium">{item.category}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {item.score}/{item.maxScore}
                      </span>
                      <Badge variant="outline">
                        {Math.round((item.score / item.maxScore) * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={(item.score / item.maxScore) * 100} 
                    className="h-2"
                  />
                  <p className="text-sm text-muted-foreground">{item.feedback}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Question-by-Question Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Question Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.responses.map((response, index) => {
                const question = session.questions.find(q => q.id === response.questionId);
                if (!question) return null;

                const responseScore = calculateResponseScore(response);
                
                return (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Question {index + 1}
                          </Badge>
                          <Badge variant={question.difficulty === 'senior' ? 'destructive' : 
                                        question.difficulty === 'mid' ? 'default' : 'secondary'}>
                            {question.difficulty}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm mb-2">{question.text}</h4>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white',
                          responseScore >= 80 ? 'bg-green-500' :
                          responseScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        )}>
                          {responseScore}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-muted-foreground">Time</div>
                        <div className="font-medium">{response.timeSpent || 0}s</div>
                      </div>
                      {response.speechAnalysis && (
                        <>
                          <div className="text-center">
                            <div className="text-muted-foreground">WPM</div>
                            <div className="font-medium">{response.speechAnalysis.wordsPerMinute}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-muted-foreground">Clarity</div>
                            <div className="font-medium">{response.speechAnalysis.clarity}%</div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {response.aiAnalysis && (
                      <div className="bg-muted p-3 rounded text-sm">
                        <p><strong>AI Feedback:</strong> {response.aiAnalysis.feedback}</p>
                        {response.aiAnalysis.keyStrengths && response.aiAnalysis.keyStrengths.length > 0 && (
                          <div className="mt-2">
                            <strong>Strengths:</strong>
                            <ul className="list-disc list-inside ml-2 text-green-700">
                              {response.aiAnalysis.keyStrengths.map((strength: string, i: number) => (
                                <li key={i}>{strength}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {response.aiAnalysis.improvementAreas && response.aiAnalysis.improvementAreas.length > 0 && (
                          <div className="mt-2">
                            <strong>Areas for Improvement:</strong>
                            <ul className="list-disc list-inside ml-2 text-orange-700">
                              {response.aiAnalysis.improvementAreas.map((area: string, i: number) => (
                                <li key={i}>{area}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={onRetake} className="w-full" variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Interview
              </Button>
              <Button onClick={onDownloadReport} className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button onClick={onShare} className="w-full" variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </Button>
            </CardContent>
          </Card>

          {/* Key Strengths */}
          {strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-600" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-gray-900 dark:text-white">{strength}</div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Time Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <div className="text-gray-800 dark:text-gray-300">Total Time:</div>
            <div className="font-medium text-gray-900 dark:text-white">{timeAnalysis.totalTime}</div>
              </div>
              <div className="flex justify-between text-sm">
                <div className="text-gray-800 dark:text-gray-300">Avg per Question:</div>
            <div className="font-medium text-gray-900 dark:text-white">{timeAnalysis.averageTime}</div>
              </div>
              <div className="flex justify-between text-sm">
                <div className="text-gray-800 dark:text-gray-300">Pacing:</div>
                <Badge variant={timeAnalysis.pacing === 'Good' ? 'default' : 'secondary'}>
                  {timeAnalysis.pacing}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Improvement Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-orange-600" />
                Priority Improvements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {improvementAreas.slice(0, 3).map((area, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={area.priority === 'high' ? 'destructive' : 
                                area.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {area.priority}
                      </Badge>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{area.area}</div>
                    </div>
                    <p className="text-xs text-muted-foreground">{area.description}</p>
                    {area.actionItems.length > 0 && (
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {area.actionItems.slice(0, 2).map((item, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <div className="text-orange-600 dark:text-orange-400">•</div>
                <div className="text-gray-900 dark:text-white">{item}</div>
                          </li>
                        ))}
                      </ul>
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

// Helper functions
function calculateScoreBreakdown(session: InterviewSession): ScoreBreakdown[] {
  const responses = session.responses.filter(r => r.response.trim().length > 0);
  
  // Communication Score
  const avgSpeechScore = responses.reduce((sum, r) => {
    if (!r.speechAnalysis) return sum + 50;
    return sum + (r.speechAnalysis.clarity + 
                  Math.max(0, 100 - r.speechAnalysis.fillerWords * 10) + 
                  (r.speechAnalysis.wordsPerMinute > 100 && r.speechAnalysis.wordsPerMinute < 200 ? 80 : 60)) / 3;
  }, 0) / responses.length;

  // Content Score
  const avgContentScore = responses.reduce((sum, r) => {
    return sum + (r.aiAnalysis?.contentScore || 50);
  }, 0) / responses.length;

  // Technical Score
  const avgTechnicalScore = responses.reduce((sum, r) => {
    return sum + (r.aiAnalysis?.technicalScore || 50);
  }, 0) / responses.length;

  // Confidence Score
  const avgConfidenceScore = responses.reduce((sum, r) => {
    if (!r.speechAnalysis) return sum + 50;
    const toneScore = r.speechAnalysis.tone === 'confident' ? 90 : 
                     r.speechAnalysis.tone === 'enthusiastic' ? 85 :
                     r.speechAnalysis.tone === 'nervous' ? 40 : 60;
    return sum + (toneScore + r.speechAnalysis.volume) / 2;
  }, 0) / responses.length;

  return [
    {
      category: 'Communication',
      score: Math.round(avgSpeechScore),
      maxScore: 100,
      feedback: avgSpeechScore >= 80 ? 'Excellent verbal communication skills' :
                avgSpeechScore >= 60 ? 'Good communication with room for improvement' :
                'Focus on clarity and reducing filler words',
      icon: <MessageSquare className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      category: 'Content Quality',
      score: Math.round(avgContentScore),
      maxScore: 100,
      feedback: avgContentScore >= 80 ? 'Strong, relevant responses' :
                avgContentScore >= 60 ? 'Good content with some gaps' :
                'Work on providing more detailed, structured answers',
      icon: <BookOpen className="w-4 h-4" />,
      color: 'bg-green-100 text-green-700'
    },
    {
      category: 'Technical Knowledge',
      score: Math.round(avgTechnicalScore),
      maxScore: 100,
      feedback: avgTechnicalScore >= 80 ? 'Solid technical understanding' :
                avgTechnicalScore >= 60 ? 'Adequate technical knowledge' :
                'Strengthen technical fundamentals',
      icon: <Target className="w-4 h-4" />,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      category: 'Confidence & Presence',
      score: Math.round(avgConfidenceScore),
      maxScore: 100,
      feedback: avgConfidenceScore >= 80 ? 'Confident and engaging presence' :
                avgConfidenceScore >= 60 ? 'Generally confident with some hesitation' :
                'Work on building confidence and reducing nervousness',
      icon: <Award className="w-4 h-4" />,
      color: 'bg-orange-100 text-orange-700'
    }
  ];
}

function generateImprovementAreas(session: InterviewSession): ImprovementArea[] {
  const areas: ImprovementArea[] = [];
  const responses = session.responses.filter(r => r.response.trim().length > 0);
  
  // Analyze speech patterns
  const avgFillerWords = responses.reduce((sum, r) => 
    sum + (r.speechAnalysis?.fillerWords || 0), 0) / responses.length;
  
  if (avgFillerWords > 3) {
    areas.push({
      area: 'Reduce Filler Words',
      priority: 'high',
      description: 'You used an average of ' + Math.round(avgFillerWords) + ' filler words per response.',
      actionItems: [
        'Practice speaking more slowly and deliberately',
        'Record yourself and identify your most common filler words',
        'Use strategic pauses instead of filler words'
      ],
      resources: ['Toastmasters speaking exercises', 'Public speaking courses']
    });
  }

  // Analyze response length and depth
  const avgResponseLength = responses.reduce((sum, r) => 
    sum + r.response.split(' ').length, 0) / responses.length;
  
  if (avgResponseLength < 50) {
    areas.push({
      area: 'Provide More Detailed Responses',
      priority: 'medium',
      description: 'Your responses averaged ' + Math.round(avgResponseLength) + ' words. Consider providing more depth.',
      actionItems: [
        'Use the STAR method (Situation, Task, Action, Result)',
        'Prepare specific examples from your experience',
        'Practice elaborating on your initial answers'
      ],
      resources: ['STAR method guides', 'Interview storytelling techniques']
    });
  }

  // Analyze technical content
  const technicalQuestions = responses.filter(r => 
    r.aiAnalysis && (r.aiAnalysis.technicalScore || 0) < 60);
  
  if (technicalQuestions.length > 0) {
    areas.push({
      area: 'Strengthen Technical Knowledge',
      priority: 'high',
      description: 'Some technical responses could be more comprehensive.',
      actionItems: [
        'Review fundamental concepts for your role',
        'Practice explaining technical concepts simply',
        'Stay updated with industry best practices'
      ],
      resources: ['Technical documentation', 'Online courses', 'Practice coding problems']
    });
  }

  return areas.slice(0, 5); // Return top 5 areas
}

function getOverallGrade(score: number): { grade: string; description: string; variant: string } {
  if (score >= 90) return { grade: 'A+', description: 'Outstanding', variant: 'default' };
  if (score >= 80) return { grade: 'A', description: 'Excellent', variant: 'default' };
  if (score >= 70) return { grade: 'B', description: 'Good', variant: 'secondary' };
  if (score >= 60) return { grade: 'C', description: 'Fair', variant: 'outline' };
  return { grade: 'D', description: 'Needs Improvement', variant: 'destructive' };
}

function identifyStrengths(session: InterviewSession): string[] {
  const strengths: string[] = [];
  const responses = session.responses.filter(r => r.response.trim().length > 0);
  
  // Check speech quality
  const avgClarity = responses.reduce((sum, r) => 
    sum + (r.speechAnalysis?.clarity || 50), 0) / responses.length;
  
  if (avgClarity >= 80) {
    strengths.push('Clear and articulate communication');
  }
  
  // Check confidence
  const confidentResponses = responses.filter(r => 
    r.speechAnalysis?.tone === 'confident' || r.speechAnalysis?.tone === 'enthusiastic');
  
  if (confidentResponses.length >= responses.length * 0.6) {
    strengths.push('Confident and engaging presence');
  }
  
  // Check response timing
  const avgTime = responses.reduce((sum, r) => sum + (r.timeSpent || 0), 0) / responses.length;
  if (avgTime >= 60 && avgTime <= 180) {
    strengths.push('Well-paced responses');
  }
  
  // Check AI feedback
  const positiveAIFeedback = responses.filter(r => 
    r.aiAnalysis && r.aiAnalysis.overallScore && r.aiAnalysis.overallScore >= 75);
  
  if (positiveAIFeedback.length >= responses.length * 0.6) {
    strengths.push('Strong content and technical knowledge');
  }
  
  return strengths;
}

function analyzeTimeSpent(session: InterviewSession): {
  totalTime: string;
  averageTime: string;
  pacing: string;
} {
  const totalSeconds = session.responses.reduce((sum, r) => sum + (r.timeSpent || 0), 0);
  const avgSeconds = totalSeconds / session.responses.length;
  
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalSecondsRemainder = totalSeconds % 60;
  
  let pacing = 'Good';
  if (avgSeconds < 30) pacing = 'Too Fast';
  else if (avgSeconds > 300) pacing = 'Too Slow';
  
  return {
    totalTime: `${totalMinutes}m ${totalSecondsRemainder}s`,
    averageTime: `${Math.round(avgSeconds)}s`,
    pacing
  };
}

function calculateResponseScore(response: any): number {
  let score = 50; // Base score
  
  // Speech analysis contribution (40%)
  if (response.speechAnalysis) {
    const speechScore = (response.speechAnalysis.clarity + 
                        Math.max(0, 100 - response.speechAnalysis.fillerWords * 10) + 
                        (response.speechAnalysis.wordsPerMinute > 100 && response.speechAnalysis.wordsPerMinute < 200 ? 80 : 60)) / 3;
    score = score * 0.6 + speechScore * 0.4;
  }
  
  // AI analysis contribution (60%)
  if (response.aiAnalysis && response.aiAnalysis.overallScore !== undefined) {
    score = score * 0.4 + response.aiAnalysis.overallScore * 0.6;
  }
  
  return Math.round(Math.max(0, Math.min(100, score)));
}

export default InterviewResultsDashboard;