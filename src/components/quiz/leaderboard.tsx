"use client";

import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, Calendar, Target } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import type { QuizSession, SkillCategory, DifficultyLevel } from '@/lib/quiz-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  totalScore: number;
  quizzesCompleted: number;
  averageScore: number;
  bestCategory: SkillCategory;
  lastActive: Date;
  rank: number;
}

interface CategoryStats {
  category: SkillCategory;
  totalScore: number;
  quizzesCompleted: number;
  averageScore: number;
  bestScore: number;
}

export function Leaderboard() {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<CategoryStats[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'week' | 'month'>('all');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboardData();
  }, [selectedPeriod, selectedCategory]);

  const loadLeaderboardData = () => {
    setLoading(true);
    
    // Get all quiz sessions from localStorage
    const allSessions: QuizSession[] = JSON.parse(localStorage.getItem('quizSessions') || '[]');
    
    // Filter sessions based on selected period
    const now = new Date();
    const filteredSessions = allSessions.filter(session => {
      if (!session.endTime) return false;
      
      const sessionDate = new Date(session.endTime);
      
      switch (selectedPeriod) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return sessionDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return sessionDate >= monthAgo;
        default:
          return true;
      }
    });

    // Filter by category if selected
    const categoryFilteredSessions = selectedCategory === 'all' 
      ? filteredSessions 
      : filteredSessions.filter(session => session.category === selectedCategory);

    // Group sessions by user
    const userSessionsMap = new Map<string, QuizSession[]>();
    categoryFilteredSessions.forEach(session => {
      if (!userSessionsMap.has(session.userId)) {
        userSessionsMap.set(session.userId, []);
      }
      userSessionsMap.get(session.userId)!.push(session);
    });

    // Calculate leaderboard entries
    const entries: LeaderboardEntry[] = [];
    userSessionsMap.forEach((sessions, userId) => {
      const totalScore = sessions.reduce((sum, session) => sum + session.score, 0);
      const quizzesCompleted = sessions.length;
      const averageScore = totalScore / quizzesCompleted;
      
      // Find best category
      const categoryScores = new Map<SkillCategory, number[]>();
      sessions.forEach(session => {
        if (!categoryScores.has(session.category)) {
          categoryScores.set(session.category, []);
        }
        categoryScores.get(session.category)!.push(session.score);
      });
      
      let bestCategory: SkillCategory = 'Data Science';
      let bestCategoryAvg = 0;
      categoryScores.forEach((scores, category) => {
        const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        if (avg > bestCategoryAvg) {
          bestCategoryAvg = avg;
          bestCategory = category;
        }
      });
      
      const lastActive = new Date(Math.max(...sessions.map(s => new Date(s.endTime!).getTime())));
      
      // Get user info (in a real app, this would come from a user database)
      const userName = userId === user?.id ? user.name : `User ${userId.slice(-4)}`;
      const userAvatar = userId === user?.id ? user.avatar : undefined;
      
      entries.push({
        userId,
        userName,
        userAvatar,
        totalScore,
        quizzesCompleted,
        averageScore,
        bestCategory,
        lastActive,
        rank: 0, // Will be set after sorting
      });
    });

    // Sort by total score and assign ranks
    entries.sort((a, b) => b.totalScore - a.totalScore);
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    setLeaderboardData(entries);

    // Calculate user's category stats
    if (user) {
      const userSessions = allSessions.filter(session => session.userId === user.id);
      const categoryStatsMap = new Map<SkillCategory, QuizSession[]>();
      
      userSessions.forEach(session => {
        if (!categoryStatsMap.has(session.category)) {
          categoryStatsMap.set(session.category, []);
        }
        categoryStatsMap.get(session.category)!.push(session);
      });
      
      const stats: CategoryStats[] = [];
      categoryStatsMap.forEach((sessions, category) => {
        const totalScore = sessions.reduce((sum, session) => sum + session.score, 0);
        const quizzesCompleted = sessions.length;
        const averageScore = totalScore / quizzesCompleted;
        const bestScore = Math.max(...sessions.map(session => session.score));
        
        stats.push({
          category,
          totalScore,
          quizzesCompleted,
          averageScore,
          bestScore,
        });
      });
      
      stats.sort((a, b) => b.totalScore - a.totalScore);
      setUserStats(stats);
    }
    
    setLoading(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <div className="text-gray-800 dark:text-gray-300">#{rank}</div>;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank <= 3) return 'default';
    if (rank <= 10) return 'secondary';
    return 'outline';
  };

  const currentUserRank = leaderboardData.find(entry => entry.userId === user?.id)?.rank;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leaderboard</h2>
          <p className="text-muted-foreground">
            See how you rank against other quiz takers
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Software Development">Software Development</SelectItem>
              <SelectItem value="Project Management">Project Management</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Human Resources">Human Resources</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="leaderboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="leaderboard">Global Leaderboard</TabsTrigger>
          <TabsTrigger value="mystats">My Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leaderboard" className="space-y-4">
          {/* Current user rank highlight */}
          {currentUserRank && (
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRankIcon(currentUserRank)}
                    <Badge variant={getRankBadgeVariant(currentUserRank)}>
                      Rank #{currentUserRank}
                    </Badge>
                  </div>
                  <div className="text-gray-800 dark:text-gray-300">Your current position</div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Leaderboard entries */}
          <div className="space-y-2">
            {leaderboardData.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Data Available</h3>
                  <p className="text-sm text-muted-foreground">
                    No quiz results found for the selected filters. Take a quiz to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              leaderboardData.map((entry) => (
                <Card key={entry.userId} className={entry.userId === user?.id ? 'border-primary/50' : ''}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 min-w-[60px]">
                          {getRankIcon(entry.rank)}
                        </div>
                        
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={entry.userAvatar} />
                          <AvatarFallback>
                            {entry.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-semibold">
                            {entry.userName}
                            {entry.userId === user?.id && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Best in {entry.bestCategory}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-lg">{entry.totalScore.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.quizzesCompleted} quiz{entry.quizzesCompleted !== 1 ? 'es' : ''}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Avg: {Math.round(entry.averageScore)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="mystats" className="space-y-4">
          {userStats.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Quiz History</h3>
                <p className="text-sm text-muted-foreground">
                  Take some quizzes to see your performance statistics here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {userStats.map((stat) => (
                <Card key={stat.category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{stat.category}</CardTitle>
                    <CardDescription>
                      {stat.quizzesCompleted} quiz{stat.quizzesCompleted !== 1 ? 'es' : ''} completed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-gray-800 dark:text-gray-300">Total Score</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{stat.totalScore.toLocaleString()}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-800 dark:text-gray-300">Average Score</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{Math.round(stat.averageScore)}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-800 dark:text-gray-300">Best Score</div>
                      <div className="font-semibold text-primary">{stat.bestScore}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}