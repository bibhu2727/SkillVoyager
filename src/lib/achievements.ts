import type { QuizSession, SkillCategory, DifficultyLevel } from './quiz-data';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'score' | 'streak' | 'category' | 'difficulty' | 'speed' | 'milestone';
  requirement: {
    type: 'total_score' | 'quiz_count' | 'streak_days' | 'category_mastery' | 'perfect_score' | 'speed_bonus' | 'difficulty_master';
    value: number;
    category?: SkillCategory;
    difficulty?: DifficultyLevel;
  };
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: Date;
  progress?: number;
}

export interface UserBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Score-based achievements
  {
    id: 'first_quiz',
    title: 'Getting Started',
    description: 'Complete your first quiz',
    icon: '🎯',
    category: 'milestone',
    requirement: { type: 'quiz_count', value: 1 },
    points: 10,
    rarity: 'common'
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Complete 10 quizzes',
    icon: '🏆',
    category: 'milestone',
    requirement: { type: 'quiz_count', value: 10 },
    points: 50,
    rarity: 'rare'
  },
  {
    id: 'quiz_legend',
    title: 'Quiz Legend',
    description: 'Complete 50 quizzes',
    icon: '👑',
    category: 'milestone',
    requirement: { type: 'quiz_count', value: 50 },
    points: 200,
    rarity: 'legendary'
  },
  {
    id: 'high_scorer',
    title: 'High Scorer',
    description: 'Reach 1,000 total points',
    icon: '⭐',
    category: 'score',
    requirement: { type: 'total_score', value: 1000 },
    points: 25,
    rarity: 'common'
  },
  {
    id: 'point_collector',
    title: 'Point Collector',
    description: 'Reach 5,000 total points',
    icon: '💎',
    category: 'score',
    requirement: { type: 'total_score', value: 5000 },
    points: 100,
    rarity: 'epic'
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Get a perfect score on any quiz',
    icon: '💯',
    category: 'score',
    requirement: { type: 'perfect_score', value: 1 },
    points: 75,
    rarity: 'rare'
  },
  
  // Category mastery achievements
  {
    id: 'data_science_novice',
    title: 'Data Science Novice',
    description: 'Complete 5 Data Science quizzes',
    icon: '📊',
    category: 'category',
    requirement: { type: 'category_mastery', value: 5, category: 'Data Science' },
    points: 30,
    rarity: 'common'
  },
  {
    id: 'marketing_guru',
    title: 'Marketing Guru',
    description: 'Complete 5 Marketing quizzes',
    icon: '📈',
    category: 'category',
    requirement: { type: 'category_mastery', value: 5, category: 'Marketing' },
    points: 30,
    rarity: 'common'
  },
  {
    id: 'finance_expert',
    title: 'Finance Expert',
    description: 'Complete 5 Finance quizzes',
    icon: '💰',
    category: 'category',
    requirement: { type: 'category_mastery', value: 5, category: 'Finance' },
    points: 30,
    rarity: 'common'
  },
  {
    id: 'code_warrior',
    title: 'Code Warrior',
    description: 'Complete 5 Software Development quizzes',
    icon: '💻',
    category: 'category',
    requirement: { type: 'category_mastery', value: 5, category: 'Software Development' },
    points: 30,
    rarity: 'common'
  },
  
  // Difficulty achievements
  {
    id: 'advanced_challenger',
    title: 'Advanced Challenger',
    description: 'Complete 3 Advanced difficulty quizzes',
    icon: '🔥',
    category: 'difficulty',
    requirement: { type: 'difficulty_master', value: 3, difficulty: 'Advanced' },
    points: 60,
    rarity: 'rare'
  },
  
  // Streak achievements
  {
    id: 'daily_learner',
    title: 'Daily Learner',
    description: 'Take quizzes for 3 consecutive days',
    icon: '📅',
    category: 'streak',
    requirement: { type: 'streak_days', value: 3 },
    points: 40,
    rarity: 'common'
  },
  {
    id: 'dedicated_student',
    title: 'Dedicated Student',
    description: 'Take quizzes for 7 consecutive days',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', value: 7 },
    points: 100,
    rarity: 'epic'
  },
  
  // Speed achievements
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete a quiz in under 2 minutes',
    icon: '⚡',
    category: 'speed',
    requirement: { type: 'speed_bonus', value: 120 }, // 120 seconds
    points: 50,
    rarity: 'rare'
  }
];

export function checkAchievements(userSessions: QuizSession[]): UserAchievement[] {
  const unlockedAchievements: UserAchievement[] = [];
  
  // Get existing achievements from localStorage
  const existingAchievements: UserAchievement[] = JSON.parse(
    localStorage.getItem('userAchievements') || '[]'
  );
  const existingIds = new Set(existingAchievements.map(a => a.achievementId));
  
  ACHIEVEMENTS.forEach(achievement => {
    if (existingIds.has(achievement.id)) return; // Already unlocked
    
    let isUnlocked = false;
    
    switch (achievement.requirement.type) {
      case 'quiz_count':
        isUnlocked = userSessions.length >= achievement.requirement.value;
        break;
        
      case 'total_score':
        const totalScore = userSessions.reduce((sum, session) => sum + session.score, 0);
        isUnlocked = totalScore >= achievement.requirement.value;
        break;
        
      case 'perfect_score':
        const perfectScores = userSessions.filter(session => {
          const maxPossible = session.totalPoints;
          return session.score === maxPossible;
        }).length;
        isUnlocked = perfectScores >= achievement.requirement.value;
        break;
        
      case 'category_mastery':
        if (achievement.requirement.category) {
          const categoryQuizzes = userSessions.filter(
            session => session.category === achievement.requirement.category
          ).length;
          isUnlocked = categoryQuizzes >= achievement.requirement.value;
        }
        break;
        
      case 'difficulty_master':
        if (achievement.requirement.difficulty) {
          const difficultyQuizzes = userSessions.filter(
            session => session.difficulty === achievement.requirement.difficulty
          ).length;
          isUnlocked = difficultyQuizzes >= achievement.requirement.value;
        }
        break;
        
      case 'streak_days':
        const streak = calculateCurrentStreak(userSessions);
        isUnlocked = streak >= achievement.requirement.value;
        break;
        
      case 'speed_bonus':
        const fastQuizzes = userSessions.filter(session => {
          if (!session.startTime || !session.endTime) return false;
          const duration = (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000;
          return duration <= achievement.requirement.value;
        }).length;
        isUnlocked = fastQuizzes >= 1;
        break;
    }
    
    if (isUnlocked) {
      unlockedAchievements.push({
        achievementId: achievement.id,
        unlockedAt: new Date()
      });
    }
  });
  
  // Save new achievements
  if (unlockedAchievements.length > 0) {
    const allAchievements = [...existingAchievements, ...unlockedAchievements];
    localStorage.setItem('userAchievements', JSON.stringify(allAchievements));
  }
  
  return unlockedAchievements;
}

export function calculateCurrentStreak(sessions: QuizSession[]): number {
  if (sessions.length === 0) return 0;
  
  // Sort sessions by date (most recent first)
  const sortedSessions = sessions
    .filter(session => session.endTime)
    .sort((a, b) => new Date(b.endTime!).getTime() - new Date(a.endTime!).getTime());
  
  if (sortedSessions.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  // Check if user took a quiz today or yesterday (to account for timezone differences)
  const mostRecentQuiz = new Date(sortedSessions[0].endTime!);
  mostRecentQuiz.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today.getTime() - mostRecentQuiz.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff > 1) return 0; // Streak broken
  
  // Count consecutive days
  const quizDates = new Set(
    sortedSessions.map(session => {
      const date = new Date(session.endTime!);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  );
  
  while (quizDates.has(currentDate.getTime())) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
}

export function getUserAchievements(): UserAchievement[] {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('userAchievements') || '[]');
  }
  return [];
}

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(achievement => achievement.id === id);
}

export function calculateAchievementProgress(achievement: Achievement, userSessions: QuizSession[]): number {
  switch (achievement.requirement.type) {
    case 'quiz_count':
      return Math.min(userSessions.length / achievement.requirement.value, 1);
      
    case 'total_score':
      const totalScore = userSessions.reduce((sum, session) => sum + session.score, 0);
      return Math.min(totalScore / achievement.requirement.value, 1);
      
    case 'category_mastery':
      if (achievement.requirement.category) {
        const categoryQuizzes = userSessions.filter(
          session => session.category === achievement.requirement.category
        ).length;
        return Math.min(categoryQuizzes / achievement.requirement.value, 1);
      }
      return 0;
      
    case 'difficulty_master':
      if (achievement.requirement.difficulty) {
        const difficultyQuizzes = userSessions.filter(
          session => session.difficulty === achievement.requirement.difficulty
        ).length;
        return Math.min(difficultyQuizzes / achievement.requirement.value, 1);
      }
      return 0;
      
    case 'streak_days':
      const streak = calculateCurrentStreak(userSessions);
      return Math.min(streak / achievement.requirement.value, 1);
      
    default:
      return 0;
  }
}

export function getRarityColor(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common': return 'text-gray-600';
    case 'rare': return 'text-blue-600';
    case 'epic': return 'text-purple-600';
    case 'legendary': return 'text-yellow-600';
    default: return 'text-gray-600';
  }
}

export function getRarityBadgeVariant(rarity: Achievement['rarity']): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (rarity) {
    case 'common': return 'secondary';
    case 'rare': return 'default';
    case 'epic': return 'destructive';
    case 'legendary': return 'outline';
    default: return 'secondary';
  }
}