"use client";

import { useState, useEffect } from 'react';
import { Trophy, Award, Star, Lock, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import type { QuizSession } from '@/lib/quiz-data';
import {
  Achievement,
  UserAchievement,
  ACHIEVEMENTS,
  checkAchievements,
  getUserAchievements,
  getAchievementById,
  calculateAchievementProgress,
  getRarityColor,
  getRarityBadgeVariant,
  calculateCurrentStreak
} from '@/lib/achievements';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface AchievementsProps {
  onNewAchievement?: (achievement: Achievement) => void;
}

export function Achievements({ onNewAchievement }: AchievementsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [userSessions, setUserSessions] = useState<QuizSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    loadAchievements();
  }, [user]);

  const loadAchievements = () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Load user's quiz sessions
    const allSessions: QuizSession[] = JSON.parse(localStorage.getItem('quizSessions') || '[]');
    const userSessionsData = allSessions.filter(session => session.userId === user.id);
    setUserSessions(userSessionsData);
    
    // Load existing achievements
    const existingAchievements = getUserAchievements();
    setUserAchievements(existingAchievements);
    
    // Check for new achievements
    const newAchievements = checkAchievements(userSessionsData);
    if (newAchievements.length > 0) {
      // Show toast notifications for new achievements
      newAchievements.forEach(userAchievement => {
        const achievement = getAchievementById(userAchievement.achievementId);
        if (achievement) {
          toast({
            title: '🎉 Achievement Unlocked!',
            description: `${achievement.icon} ${achievement.title}: ${achievement.description}`,
            duration: 5000,
          });
          
          if (onNewAchievement) {
            onNewAchievement(achievement);
          }
        }
      });
      
      // Update state with new achievements
      setUserAchievements(prev => [...prev, ...newAchievements]);
    }
    
    // Calculate current streak
    setCurrentStreak(calculateCurrentStreak(userSessionsData));
    
    setLoading(false);
  };

  const getUnlockedAchievements = () => {
    const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));
    return ACHIEVEMENTS.filter(achievement => unlockedIds.has(achievement.id));
  };

  const getLockedAchievements = () => {
    const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));
    return ACHIEVEMENTS.filter(achievement => !unlockedIds.has(achievement.id));
  };

  const getTotalAchievementPoints = () => {
    const unlockedAchievements = getUnlockedAchievements();
    return unlockedAchievements.reduce((total, achievement) => total + achievement.points, 0);
  };

  const getAchievementsByCategory = (achievements: Achievement[]) => {
    const categories = ['milestone', 'score', 'category', 'difficulty', 'streak', 'speed'] as const;
    return categories.reduce((acc, category) => {
      acc[category] = achievements.filter(achievement => achievement.category === category);
      return acc;
    }, {} as Record<string, Achievement[]>);
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'milestone': return '🏁';
      case 'score': return '⭐';
      case 'category': return '📚';
      case 'difficulty': return '🔥';
      case 'streak': return '📅';
      case 'speed': return '⚡';
      default: return '🏆';
    }
  };

  const getCategoryTitle = (category: Achievement['category']) => {
    switch (category) {
      case 'milestone': return 'Milestones';
      case 'score': return 'High Scores';
      case 'category': return 'Subject Mastery';
      case 'difficulty': return 'Difficulty Challenges';
      case 'streak': return 'Learning Streaks';
      case 'speed': return 'Speed Challenges';
      default: return 'Achievements';
    }
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

  const unlockedAchievements = getUnlockedAchievements();
  const lockedAchievements = getLockedAchievements();
  const totalPoints = getTotalAchievementPoints();

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
                <p className="text-xs text-muted-foreground">Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-xs text-muted-foreground">Points Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)}%</p>
                <p className="text-xs text-muted-foreground">Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🔥</span>
              <div>
                <p className="text-2xl font-bold">{currentStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="unlocked" className="space-y-6">
        <TabsList>
          <TabsTrigger value="unlocked">Unlocked ({unlockedAchievements.length})</TabsTrigger>
          <TabsTrigger value="locked">Locked ({lockedAchievements.length})</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unlocked" className="space-y-4">
          {unlockedAchievements.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Achievements Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Take some quizzes to start earning achievements!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {unlockedAchievements.map((achievement) => {
                const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
                return (
                  <Card key={achievement.id} className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <Badge variant={getRarityBadgeVariant(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold mb-1">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {achievement.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="text-gray-700 dark:text-gray-300">+{achievement.points} points</span>
                        {userAchievement && (
                          <span className="text-gray-700 dark:text-gray-300">
                            Earned {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="locked" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lockedAchievements.map((achievement) => {
              const progress = calculateAchievementProgress(achievement, userSessions);
              const progressPercentage = Math.round(progress * 100);
              
              return (
                <Card key={achievement.id} className="opacity-75">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl grayscale">{achievement.icon}</div>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">{achievement.rarity}</Badge>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold mb-1 text-muted-foreground">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {achievement.description}
                    </p>
                    
                    {progress > 0 && progress < 1 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-700 dark:text-gray-300">Progress</span>
                          <span className="text-gray-800 dark:text-gray-200">{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      +{achievement.points} points when unlocked
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-6">
          {Object.entries(getAchievementsByCategory([...unlockedAchievements, ...lockedAchievements]))
            .filter(([_, achievements]) => achievements.length > 0)
            .map(([category, achievements]) => {
              const unlockedCount = achievements.filter(a => 
                unlockedAchievements.some(ua => ua.id === a.id)
              ).length;
              
              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(category as Achievement['category'])}</span>
                      {getCategoryTitle(category as Achievement['category'])}
                      <Badge variant="outline">
                        {unlockedCount}/{achievements.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {unlockedCount === achievements.length 
                        ? 'All achievements unlocked!' 
                        : `${achievements.length - unlockedCount} achievements remaining`
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2">
                      {achievements.map((achievement) => {
                        const isUnlocked = unlockedAchievements.some(ua => ua.id === achievement.id);
                        return (
                          <div 
                            key={achievement.id} 
                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                              isUnlocked ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'
                            }`}
                          >
                            <div className={`text-xl ${isUnlocked ? '' : 'grayscale'}`}>
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <div className={`font-medium text-sm ${
                                isUnlocked ? '' : 'text-muted-foreground'
                              }`}>
                                {achievement.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                +{achievement.points} points
                              </div>
                            </div>
                            {isUnlocked ? (
                              <Award className="h-4 w-4 text-primary" />
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          }
        </TabsContent>
      </Tabs>
    </div>
  );
}