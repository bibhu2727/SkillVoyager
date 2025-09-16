"use client";

import { useState, useEffect } from 'react';
import { Calendar, Clock, Trophy, Flame, Star, Gift, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import {
  DailyChallenge,
  DailyChallengeResult,
  getTodaysChallenge,
  hasTakenTodaysChallenge,
  saveDailyChallengeResult,
  getDailyChallengeStreak,
  getWeeklyDailyChallengeStats,
  getUpcomingChallenges,
  calculateDailyChallengeScore
} from '@/lib/daily-challenge';
import type { QuizSession } from '@/lib/quiz-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuizGame } from './quiz-game';

export function DailyChallenge() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [todaysChallenge, setTodaysChallenge] = useState<DailyChallenge | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [streak, setStreak] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState({
    completed: 0,
    totalPossible: 7,
    averageScore: 0,
    totalBonus: 0
  });
  const [upcomingChallenges, setUpcomingChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyChallengeData();
  }, [user]);

  const loadDailyChallengeData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      // Get today's challenge
      const challenge = await getTodaysChallenge();
      setTodaysChallenge(challenge);
      
      // Check if user has completed today's challenge
      const completed = hasTakenTodaysChallenge(user.id);
      setHasCompleted(completed);
      
      // Get user's streak
      const userStreak = getDailyChallengeStreak(user.id);
      setStreak(userStreak);
      
      // Get weekly stats
      const stats = getWeeklyDailyChallengeStats(user.id);
      setWeeklyStats(stats);
      
      // Get upcoming challenges
      const upcoming = await getUpcomingChallenges(7);
      setUpcomingChallenges(upcoming);
    } catch (error) {
      console.error('Failed to load daily challenge data:', error);
      toast({
        title: "Error Loading Challenge",
        description: "Failed to load today's challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartChallenge = () => {
    setIsPlaying(true);
  };

  const handleChallengeComplete = (session: QuizSession) => {
    if (!todaysChallenge || !user) return;
    
    // Calculate score with bonus multiplier
    const bonusScore = calculateDailyChallengeScore(session.answers, todaysChallenge);
    
    // Save daily challenge result
    const result: DailyChallengeResult = {
      challengeId: todaysChallenge.id,
      userId: user.id,
      score: bonusScore,
      totalPoints: Math.round(session.totalPoints * todaysChallenge.bonusMultiplier),
      completedAt: new Date(),
      timeSpent: session.endTime && session.startTime 
        ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000)
        : 0
    };
    
    saveDailyChallengeResult(result);
    
    // Show completion toast
    const bonusPoints = bonusScore - session.score;
    toast({
      title: '🎉 Daily Challenge Complete!',
      description: `You earned ${bonusScore} points (${bonusPoints} bonus points from ${todaysChallenge.bonusMultiplier}x multiplier)!`,
      duration: 5000,
    });
    
    // Update state
    setHasCompleted(true);
    setIsPlaying(false);
    
    // Reload data to update streak and stats
    loadDailyChallengeData();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500 dark:bg-green-600';
      case 'Intermediate': return 'bg-yellow-500 dark:bg-yellow-600';
      case 'Advanced': return 'bg-red-500 dark:bg-red-600';
      default: return 'bg-muted dark:bg-muted';
    }
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '🌟';
    if (streak >= 3) return '💪';
    return '🎯';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isPlaying && todaysChallenge) {
    return (
      <div className="space-y-6">
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {todaysChallenge.theme}
              <Badge className={getDifficultyColor(todaysChallenge.difficulty)}>
                {todaysChallenge.difficulty}
              </Badge>
              <Badge variant="outline">
                {todaysChallenge.bonusMultiplier}x Bonus
              </Badge>
            </CardTitle>
            <CardDescription>{todaysChallenge.description}</CardDescription>
          </CardHeader>
        </Card>
        
        <QuizGame onQuizComplete={handleChallengeComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getStreakIcon(streak)}</span>
              <div>
                <p className="text-2xl font-bold">{streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{weeklyStats.completed}/7</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{Math.round(weeklyStats.averageScore * 100)}%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{weeklyStats.totalBonus}</p>
                <p className="text-xs text-muted-foreground">Bonus Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">Today's Challenge</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-4">
          {todaysChallenge ? (
            <Card className={hasCompleted ? 'border-green-500/50 bg-green-50/50' : 'border-primary/50 bg-primary/5'}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5" />
                      {todaysChallenge.theme}
                      {hasCompleted && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          ✓ Completed
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mb-3">
                      {todaysChallenge.description}
                    </CardDescription>
                    
                    <div className="flex gap-2 mb-3">
                      <Badge className={getDifficultyColor(todaysChallenge.difficulty)}>
                        {todaysChallenge.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {todaysChallenge.category}
                      </Badge>
                      <Badge variant="secondary">
                        {todaysChallenge.bonusMultiplier}x Points
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl mb-1">
                      {hasCompleted ? '🏆' : '🎯'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {todaysChallenge.questions.length} Questions
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {hasCompleted ? (
                  <div className="text-center py-4">
                    <Trophy className="h-12 w-12 mx-auto text-green-500 mb-3" />
                    <h3 className="font-semibold text-green-700 mb-2">
                      Challenge Completed!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Great job! Come back tomorrow for a new challenge.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <div className="text-gray-800 dark:text-gray-300">{streak} day streak</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <div className="text-gray-800 dark:text-gray-300">{todaysChallenge.bonusMultiplier}x bonus earned</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Challenge Details:</h3>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• {todaysChallenge.questions.length} questions from {todaysChallenge.category}</li>
                        <li>• {todaysChallenge.difficulty} difficulty level</li>
                        <li>• {todaysChallenge.bonusMultiplier}x point multiplier</li>
                        <li>• Available for 24 hours only</li>
                      </ul>
                    </div>
                    
                    <Button onClick={handleStartChallenge} className="w-full" size="lg">
                      <Clock className="mr-2 h-4 w-4" />
                      Start Today's Challenge
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Challenge Available</h3>
                <p className="text-sm text-muted-foreground">
                  Unable to load today's challenge. Please try again later.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingChallenges.map((challenge, index) => {
              const date = new Date(challenge.date);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
              const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              
              return (
                <Card key={challenge.id} className="opacity-75">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{challenge.theme}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {dayName}, {dateString}
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                          <Badge variant="secondary">
                            {challenge.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg mb-1">📅</div>
                        <div className="text-xs text-muted-foreground">
                          {challenge.bonusMultiplier}x
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {challenge.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl mb-2">{getStreakIcon(streak)}</div>
                  <div className="text-3xl font-bold mb-2">{streak}</div>
                  <div className="text-sm text-muted-foreground">
                    {streak === 0 ? 'Start your streak today!' : 
                     streak === 1 ? 'day in a row' : 'days in a row'}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Challenges Completed</span>
                    <span className="text-gray-800 dark:text-gray-200">{weeklyStats.completed}/7</span>
                  </div>
                  <Progress value={(weeklyStats.completed / 7) * 100} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">{Math.round(weeklyStats.averageScore * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Avg Score</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{weeklyStats.totalBonus}</div>
                    <div className="text-xs text-muted-foreground">Bonus Points</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}