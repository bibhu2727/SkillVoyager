'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  Mic, 
  Video, 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target,
  Volume2,
  Camera,
  Activity,
  Award
} from 'lucide-react';
import { RecordingMetrics, RecordingSession } from '@/lib/comprehensive-recorder';
import { PanelInterviewSession } from '@/lib/panel-interview-manager';

interface AnalysisDashboardProps {
  recordingSession?: RecordingSession | null;
  interviewSession?: PanelInterviewSession | null;
  isLive?: boolean;
}

export default function AnalysisDashboard({ 
  recordingSession, 
  interviewSession, 
  isLive = false 
}: AnalysisDashboardProps) {
  if (!recordingSession?.metrics) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No analysis data available</p>
            <p className="text-sm">Start an interview to see metrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const metrics = recordingSession.metrics;
  const overallScore = calculateOverallScore(metrics);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="h-full">
      <Tabs defaultValue="overview" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Question Responses Summary */}
            {interviewSession?.questionResponses && Object.keys(interviewSession.questionResponses).length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Question Responses Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(interviewSession.questionResponses).map(([questionKey, response]) => (
                      <div key={questionKey} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {questionKey.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {(response as string).length} characters
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {response as string}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Overall Score */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Overall Performance
                  {isLive && (
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                      LIVE
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-bold">
                    <span className={getScoreColor(overallScore)}>
                      {Math.round(overallScore)}%
                    </span>
                  </div>
                  <Badge variant={getScoreBadgeVariant(overallScore)}>
                    {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
                <Progress value={overallScore} className="h-2" />
              </CardContent>
            </Card>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Voice Clarity</p>
                      <p className="text-xl font-semibold">{Math.round(metrics.audio.clarity)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Eye className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Eye Contact</p>
                      <p className="text-xl font-semibold">{Math.round(metrics.video.eyeContact)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Brain className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Confidence</p>
                      <p className="text-xl font-semibold">{Math.round(metrics.behavioral.confidenceLevel)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600">Engagement</p>
                      <p className="text-xl font-semibold">{Math.round(metrics.behavioral.engagement)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interview Progress */}
            {interviewSession && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Interview Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Questions Answered</span>
                      <span>{interviewSession.currentQuestionIndex} / {interviewSession.questions.length}</span>
                    </div>
                    <Progress 
                      value={(interviewSession.currentQuestionIndex / interviewSession.questions.length) * 100} 
                      className="h-2" 
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Duration: {formatDuration(interviewSession.startTime)}</span>
                      <span>Responses: {interviewSession.responses.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="audio" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Audio Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Volume Level</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={metrics.audio.volume} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{Math.round(metrics.audio.volume)}%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Speech Clarity</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={metrics.audio.clarity} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{Math.round(metrics.audio.clarity)}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{Math.round(metrics.audio.speechRate)}</p>
                    <p className="text-sm text-gray-600">Words/Min</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{metrics.audio.pauseCount}</p>
                    <p className="text-sm text-gray-600">Pauses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{metrics.audio.fillerWords}</p>
                    <p className="text-sm text-gray-600">Filler Words</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Audio Quality Insights</h4>
                  <div className="space-y-2 text-sm">
                    {metrics.audio.volume > 70 ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>Good volume level - clear and audible</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <TrendingDown className="w-4 h-4" />
                        <span>Consider speaking louder for better clarity</span>
                      </div>
                    )}
                    {metrics.audio.fillerWords < 5 ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>Minimal filler words - articulate speech</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <TrendingDown className="w-4 h-4" />
                        <span>Try to reduce "um", "uh", and other filler words</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Video Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Eye Contact</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={metrics.video.eyeContact} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{Math.round(metrics.video.eyeContact)}%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Head Movement</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={metrics.video.headMovement * 10} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{Math.round(metrics.video.headMovement)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Posture</h4>
                      <Badge variant={metrics.video.posture === 'good' ? 'default' : 'secondary'}>
                        {metrics.video.posture}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Gestures</h4>
                      <p className="text-2xl font-bold text-purple-600">{metrics.video.gestureCount}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Facial Expressions</h4>
                  <div className="flex flex-wrap gap-2">
                    {metrics.video.facialExpressions.map((expression, index) => (
                      <Badge key={index} variant="outline">
                        {expression}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Video Quality Insights</h4>
                  <div className="space-y-2 text-sm">
                    {metrics.video.eyeContact > 70 ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>Excellent eye contact - shows confidence and engagement</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <TrendingDown className="w-4 h-4" />
                        <span>Try to maintain more eye contact with the camera</span>
                      </div>
                    )}
                    {metrics.video.posture === 'good' ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>Good posture - professional appearance</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <TrendingDown className="w-4 h-4" />
                        <span>Consider improving your posture for a more professional look</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavioral" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Behavioral Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Confidence Level</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={metrics.behavioral.confidenceLevel} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{Math.round(metrics.behavioral.confidenceLevel)}%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nervousness</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={metrics.behavioral.nervousness} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{Math.round(metrics.behavioral.nervousness)}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Engagement</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={metrics.behavioral.engagement} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{Math.round(metrics.behavioral.engagement)}%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Professionalism</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={metrics.behavioral.professionalism} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{Math.round(metrics.behavioral.professionalism)}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Behavioral Insights</h4>
                  <div className="space-y-2 text-sm">
                    {metrics.behavioral.confidenceLevel > 70 ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>High confidence level - you appear self-assured</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <TrendingDown className="w-4 h-4" />
                        <span>Work on building confidence through practice and preparation</span>
                      </div>
                    )}
                    {metrics.behavioral.nervousness < 30 ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>Low nervousness - you appear calm and composed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <TrendingDown className="w-4 h-4" />
                        <span>Try relaxation techniques to reduce nervousness</span>
                      </div>
                    )}
                    {metrics.behavioral.engagement > 70 ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>High engagement - you show genuine interest</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <TrendingDown className="w-4 h-4" />
                        <span>Show more enthusiasm and interest in the conversation</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// Helper functions
function calculateOverallScore(metrics: RecordingMetrics): number {
  const audioScore = (metrics.audio.volume + metrics.audio.clarity + (100 - metrics.audio.fillerWords)) / 3;
  const videoScore = (metrics.video.eyeContact + (metrics.video.posture === 'good' ? 100 : 50)) / 2;
  const behavioralScore = (metrics.behavioral.confidenceLevel + metrics.behavioral.engagement + metrics.behavioral.professionalism) / 3;
  
  return (audioScore + videoScore + behavioralScore) / 3;
}

function formatDuration(startTime: number): string {
  const duration = Date.now() - startTime;
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}