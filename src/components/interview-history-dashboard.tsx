'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  BookOpen,
  BarChart3,
  LineChart,
  Flame,
  Star,
  CheckCircle,
  AlertCircle,
  Plus,
  Download,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  interviewHistoryManager,
  type InterviewHistoryEntry,
  type ProgressMetrics,
  type InterviewGoal,
  type InterviewStreak
} from '@/lib/interview-history';
import { type JobRole, type DifficultyLevel } from '@/lib/interview-simulator';
import { useAuth } from '@/contexts/auth-context';

interface InterviewHistoryDashboardProps {
  className?: string;
  onStartNewInterview?: () => void;
}

export function InterviewHistoryDashboard({ className, onStartNewInterview }: InterviewHistoryDashboardProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<InterviewHistoryEntry[]>([]);
  const [metrics, setMetrics] = useState<ProgressMetrics | null>(null);
  const [streak, setStreak] = useState<InterviewStreak | null>(null);
  const [goals, setGoals] = useState<InterviewGoal[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | JobRole>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | DifficultyLevel>('all');

  useEffect(() => {
    if (user?.id) {
      loadUserData(user.id);
    }
  }, [user?.id]);

  const loadUserData = (userId: string) => {
    const userHistory = interviewHistoryManager.getUserHistory(userId);
    const userMetrics = interviewHistoryManager.getProgressMetrics(userId);
    const userStreak = interviewHistoryManager.getInterviewStreak(userId);
    const userGoals = interviewHistoryManager.getUserGoals(userId);

    setHistory(userHistory);
    setMetrics(userMetrics);
    setStreak(userStreak);
    setGoals(userGoals);
  };

  const filteredHistory = history.filter(entry => {
    const roleMatch = selectedFilter === 'all' || entry.jobRole === selectedFilter;
    const difficultyMatch = selectedDifficulty === 'all' || entry.difficulty === selectedDifficulty;
    return roleMatch && difficultyMatch;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!metrics) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Interview History</h3>
          <p className="text-muted-foreground mb-4">
            Start practicing interviews to see your progress and analytics here.
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Start First Interview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Interviews</p>
                <p className="text-2xl font-bold">{metrics.totalInterviews}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className={cn('text-2xl font-bold', getScoreColor(metrics.averageScore))}>
                  {metrics.averageScore}%
                </p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Improvement</p>
                <div className="flex items-center gap-1">
                  <p className={cn('text-2xl font-bold', 
                    metrics.scoreImprovement >= 0 ? 'text-green-600' : 'text-red-600'
                  )}>
                    {metrics.scoreImprovement > 0 ? '+' : ''}{metrics.scoreImprovement}%
                  </p>
                  {metrics.scoreImprovement >= 0 ? 
                    <TrendingUp className="w-4 h-4 text-green-600" /> : 
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  }
                </div>
              </div>
              <LineChart className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{streak?.currentStreak || 0} days</p>
              </div>
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="history">Interview History</TabsTrigger>
          <TabsTrigger value="progress">Progress Analytics</TabsTrigger>
          <TabsTrigger value="goals">Goals & Targets</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Filters:</div>
                </div>
                
                <select 
                  value={selectedFilter} 
                  onChange={(e) => setSelectedFilter(e.target.value as any)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="UX Designer">UX Designer</option>
                </select>

                <select 
                  value={selectedDifficulty} 
                  onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                </select>

                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Interview History List */}
          <div className="space-y-4">
            {filteredHistory.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{entry.jobRole}</h3>
                        <Badge variant="outline">{entry.difficulty}</Badge>
                        <Badge variant={getScoreBadgeVariant(entry.overallScore)}>
                          {entry.overallScore}%
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(entry.completedAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(entry.duration)}
                        </div>
                        <div>
                          {entry.questionsAnswered}/{entry.totalQuestions} questions
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {entry.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Technical</p>
                          <p className="font-medium">{entry.aiAnalysis.detailedFeedback.technical}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Communication</p>
                          <p className="font-medium">{entry.aiAnalysis.detailedFeedback.communication}%</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>

                  {entry.notes && (
                    <>
                      <Separator className="my-4" />
                      <p className="text-sm text-muted-foreground">{entry.notes}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Skill Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Development</CardTitle>
              <CardDescription>
                Track your improvement across different skill areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {metrics.skillProgress.map((skill) => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium capitalize text-gray-900 dark:text-white">{skill.skill}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {skill.currentLevel}%
                      </span>
                      {skill.improvement > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          +{skill.improvement}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress value={skill.currentLevel} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Monthly Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
              <CardDescription>
                Your interview performance over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.monthlyProgress.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {month.interviewCount} interviews
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn('font-semibold', getScoreColor(month.averageScore))}>
                        {month.averageScore}%
                      </p>
                      {month.improvementRate !== 0 && (
                        <p className={cn('text-xs flex items-center gap-1',
                          month.improvementRate > 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {month.improvementRate > 0 ? 
                            <TrendingUp className="w-3 h-3" /> : 
                            <TrendingDown className="w-3 h-3" />
                          }
                          {Math.abs(month.improvementRate)}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Active Goals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Interview Goals</CardTitle>
                  <CardDescription>
                    Set and track your interview preparation targets
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {goals.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Goals Set</h3>
                  <p className="text-muted-foreground mb-4">
                    Set interview goals to track your progress and stay motivated.
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Goal
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <Card key={goal.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{goal.title}</h4>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                          {goal.isCompleted ? (
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              In Progress
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-gray-800 dark:text-gray-300">Progress</div>
            <div className="text-gray-900 dark:text-white">{Math.round(goal.progress)}%</div>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                          <div className="text-gray-800 dark:text-gray-300">Target: {goal.targetScore}% • {goal.targetRole} • {goal.targetDifficulty}</div>
            <div className="text-gray-800 dark:text-gray-300">Due: {formatDate(goal.deadline)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Strengths and Improvement Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Top Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.strongestSkills.map((skill, index) => (
                    <div key={skill} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="capitalize text-gray-900 dark:text-white">{skill}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Focus Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.improvementAreas.map((area, index) => (
                    <div key={area} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="capitalize text-gray-900 dark:text-white">{area}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interview Streak */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Interview Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-500">{streak?.currentStreak || 0}</p>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{streak?.longestStreak || 0}</p>
                  <p className="text-sm text-muted-foreground">Longest Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {streak?.lastInterviewDate ? formatDate(streak.lastInterviewDate) : 'Never'}
                  </p>
                  <p className="text-sm text-muted-foreground">Last Interview</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}