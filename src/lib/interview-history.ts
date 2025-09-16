// Interview History and Progress Tracking

import type { InterviewSession, JobRole, DifficultyLevel, AIAnalysis } from './interview-simulator';

export interface InterviewHistoryEntry {
  id: string;
  sessionId: string;
  userId: string;
  jobRole: JobRole;
  difficulty: DifficultyLevel;
  completedAt: Date;
  duration: number; // in minutes
  overallScore: number;
  aiAnalysis: AIAnalysis;
  questionsAnswered: number;
  totalQuestions: number;
  averageResponseTime: number; // in seconds
  improvementAreas: string[];
  strengths: string[];
  tags?: string[];
  notes?: string;
}

export interface ProgressMetrics {
  totalInterviews: number;
  averageScore: number;
  scoreImprovement: number; // percentage change from first to latest
  mostPracticedRole: JobRole;
  strongestSkills: string[];
  improvementAreas: string[];
  streakDays: number;
  lastInterviewDate: Date;
  monthlyProgress: MonthlyProgress[];
  skillProgress: SkillProgress[];
}

export interface MonthlyProgress {
  month: string; // YYYY-MM format
  interviewCount: number;
  averageScore: number;
  improvementRate: number;
}

export interface SkillProgress {
  skill: string;
  category: 'technical' | 'communication' | 'problem-solving' | 'leadership';
  currentLevel: number; // 0-100
  previousLevel: number;
  improvement: number;
  lastPracticed: Date;
  practiceCount: number;
}

export interface InterviewGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetScore: number;
  targetRole: JobRole;
  targetDifficulty: DifficultyLevel;
  deadline: Date;
  isCompleted: boolean;
  progress: number; // 0-100
  createdAt: Date;
  completedAt?: Date;
}

export interface InterviewStreak {
  currentStreak: number;
  longestStreak: number;
  lastInterviewDate: Date;
  streakStartDate: Date;
}

// Mock data for demonstration
const mockInterviewHistory: InterviewHistoryEntry[] = [
  {
    id: 'hist_001',
    sessionId: 'session_001',
    userId: 'user_001',
    jobRole: 'Software Engineer',
    difficulty: 'mid',
    completedAt: new Date('2024-01-15'),
    duration: 45,
    overallScore: 78,
    aiAnalysis: {
      speechPattern: 'Clear and structured responses with good technical depth',
      confidence: 75,
      keywordUsage: ['algorithms', 'data structures', 'system design'],
      improvementAreas: ['Communication clarity', 'Example specificity'],
      strengths: ['Technical knowledge', 'Problem-solving approach'],
      overallScore: 78,
      detailedFeedback: {
        technical: 85,
        communication: 70,
        problemSolving: 80,
        leadership: 65
      }
    },
    questionsAnswered: 8,
    totalQuestions: 10,
    averageResponseTime: 180,
    improvementAreas: ['Communication clarity', 'Example specificity'],
    strengths: ['Technical knowledge', 'Problem-solving approach'],
    tags: ['technical', 'algorithms']
  },
  {
    id: 'hist_002',
    sessionId: 'session_002',
    userId: 'user_001',
    jobRole: 'Software Engineer',
    difficulty: 'senior',
    completedAt: new Date('2024-01-20'),
    duration: 60,
    overallScore: 82,
    aiAnalysis: {
      speechPattern: 'Confident delivery with improved examples',
      confidence: 82,
      keywordUsage: ['system architecture', 'scalability', 'leadership'],
      improvementAreas: ['Time management'],
      strengths: ['System design', 'Leadership examples', 'Communication'],
      overallScore: 82,
      detailedFeedback: {
        technical: 88,
        communication: 78,
        problemSolving: 85,
        leadership: 75
      }
    },
    questionsAnswered: 10,
    totalQuestions: 10,
    averageResponseTime: 200,
    improvementAreas: ['Time management'],
    strengths: ['System design', 'Leadership examples', 'Communication'],
    tags: ['system-design', 'leadership']
  }
];

// Interview History Management Class
export class InterviewHistoryManager {
  private static instance: InterviewHistoryManager;
  private history: InterviewHistoryEntry[] = mockInterviewHistory;
  private goals: InterviewGoal[] = [];

  static getInstance(): InterviewHistoryManager {
    if (!InterviewHistoryManager.instance) {
      InterviewHistoryManager.instance = new InterviewHistoryManager();
    }
    return InterviewHistoryManager.instance;
  }

  // Add new interview session to history
  addInterviewSession(session: InterviewSession, userId: string): InterviewHistoryEntry {
    const entry: InterviewHistoryEntry = {
      id: `hist_${Date.now()}`,
      sessionId: session.id,
      userId,
      jobRole: session.jobRole,
      difficulty: session.difficulty,
      completedAt: session.completedAt || new Date(),
      duration: session.duration || 0,
      overallScore: session.aiAnalysis?.overallScore || 0,
      aiAnalysis: session.aiAnalysis!,
      questionsAnswered: session.responses.length,
      totalQuestions: session.questions.length,
      averageResponseTime: this.calculateAverageResponseTime(session),
      improvementAreas: session.aiAnalysis?.improvementAreas || [],
      strengths: session.aiAnalysis?.strengths || [],
      tags: this.generateTags(session)
    };

    this.history.unshift(entry); // Add to beginning for chronological order
    return entry;
  }

  // Get user's interview history
  getUserHistory(userId: string, limit?: number): InterviewHistoryEntry[] {
    const userHistory = this.history
      .filter(entry => entry.userId === userId)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
    
    return limit ? userHistory.slice(0, limit) : userHistory;
  }

  // Calculate progress metrics
  getProgressMetrics(userId: string): ProgressMetrics {
    const userHistory = this.getUserHistory(userId);
    
    if (userHistory.length === 0) {
      return {
        totalInterviews: 0,
        averageScore: 0,
        scoreImprovement: 0,
        mostPracticedRole: 'Software Engineer',
        strongestSkills: [],
        improvementAreas: [],
        streakDays: 0,
        lastInterviewDate: new Date(),
        monthlyProgress: [],
        skillProgress: []
      };
    }

    const totalInterviews = userHistory.length;
    const averageScore = userHistory.reduce((sum, entry) => sum + entry.overallScore, 0) / totalInterviews;
    const scoreImprovement = this.calculateScoreImprovement(userHistory);
    const mostPracticedRole = this.getMostPracticedRole(userHistory);
    const strongestSkills = this.getStrongestSkills(userHistory);
    const improvementAreas = this.getTopImprovementAreas(userHistory);
    const streak = this.calculateStreak(userHistory);
    const monthlyProgress = this.calculateMonthlyProgress(userHistory);
    const skillProgress = this.calculateSkillProgress(userHistory);

    return {
      totalInterviews,
      averageScore: Math.round(averageScore),
      scoreImprovement,
      mostPracticedRole,
      strongestSkills,
      improvementAreas,
      streakDays: streak.currentStreak,
      lastInterviewDate: userHistory[0].completedAt,
      monthlyProgress,
      skillProgress
    };
  }

  // Get interview streak information
  getInterviewStreak(userId: string): InterviewStreak {
    const userHistory = this.getUserHistory(userId);
    return this.calculateStreak(userHistory);
  }

  // Set and manage goals
  setGoal(goal: Omit<InterviewGoal, 'id' | 'createdAt' | 'progress'>): InterviewGoal {
    const newGoal: InterviewGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      createdAt: new Date(),
      progress: 0
    };
    
    this.goals.push(newGoal);
    return newGoal;
  }

  // Get user goals
  getUserGoals(userId: string): InterviewGoal[] {
    return this.goals.filter(goal => goal.userId === userId);
  }

  // Update goal progress
  updateGoalProgress(goalId: string, userId: string): void {
    const goal = this.goals.find(g => g.id === goalId && g.userId === userId);
    if (!goal) return;

    const userHistory = this.getUserHistory(userId);
    const relevantSessions = userHistory.filter(entry => 
      entry.jobRole === goal.targetRole && 
      entry.difficulty === goal.targetDifficulty
    );

    if (relevantSessions.length > 0) {
      const latestScore = relevantSessions[0].overallScore;
      goal.progress = Math.min(100, (latestScore / goal.targetScore) * 100);
      
      if (latestScore >= goal.targetScore && !goal.isCompleted) {
        goal.isCompleted = true;
        goal.completedAt = new Date();
      }
    }
  }

  // Private helper methods
  private calculateAverageResponseTime(session: InterviewSession): number {
    const totalTime = session.responses.reduce((sum, response) => sum + response.duration, 0);
    return session.responses.length > 0 ? totalTime / session.responses.length : 0;
  }

  private generateTags(session: InterviewSession): string[] {
    const tags: string[] = [];
    
    // Add role-based tags
    tags.push(session.jobRole.toLowerCase().replace(' ', '-'));
    
    // Add difficulty tag
    tags.push(session.difficulty);
    
    // Add category tags based on questions
    const categories = session.questions.map(q => q.category);
    const uniqueCategories = [...new Set(categories)];
    tags.push(...uniqueCategories);
    
    return tags;
  }

  private calculateScoreImprovement(history: InterviewHistoryEntry[]): number {
    if (history.length < 2) return 0;
    
    const latest = history[0].overallScore;
    const earliest = history[history.length - 1].overallScore;
    
    return Math.round(((latest - earliest) / earliest) * 100);
  }

  private getMostPracticedRole(history: InterviewHistoryEntry[]): JobRole {
    const roleCounts = history.reduce((counts, entry) => {
      counts[entry.jobRole] = (counts[entry.jobRole] || 0) + 1;
      return counts;
    }, {} as Record<JobRole, number>);
    
    return Object.entries(roleCounts).reduce((a, b) => 
      roleCounts[a[0] as JobRole] > roleCounts[b[0] as JobRole] ? a : b
    )[0] as JobRole;
  }

  private getStrongestSkills(history: InterviewHistoryEntry[]): string[] {
    const skillCounts = history.reduce((counts, entry) => {
      entry.strengths.forEach(skill => {
        counts[skill] = (counts[skill] || 0) + 1;
      });
      return counts;
    }, {} as Record<string, number>);
    
    return Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([skill]) => skill);
  }

  private getTopImprovementAreas(history: InterviewHistoryEntry[]): string[] {
    const areaCounts = history.reduce((counts, entry) => {
      entry.improvementAreas.forEach(area => {
        counts[area] = (counts[area] || 0) + 1;
      });
      return counts;
    }, {} as Record<string, number>);
    
    return Object.entries(areaCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([area]) => area);
  }

  private calculateStreak(history: InterviewHistoryEntry[]): InterviewStreak {
    if (history.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastInterviewDate: new Date(),
        streakStartDate: new Date()
      };
    }

    const sortedHistory = [...history].sort((a, b) => 
      b.completedAt.getTime() - a.completedAt.getTime()
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let streakStartDate = sortedHistory[0].completedAt;

    // Calculate streaks based on consecutive days
    for (let i = 0; i < sortedHistory.length; i++) {
      const currentDate = sortedHistory[i].completedAt;
      const nextDate = i < sortedHistory.length - 1 ? sortedHistory[i + 1].completedAt : null;
      
      tempStreak++;
      
      if (nextDate) {
        const daysDiff = Math.floor(
          (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysDiff > 1) {
          // Streak broken
          if (i === 0) currentStreak = tempStreak;
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 0;
        }
      } else {
        // Last entry
        if (i === 0) currentStreak = tempStreak;
        longestStreak = Math.max(longestStreak, tempStreak);
      }
    }

    return {
      currentStreak,
      longestStreak,
      lastInterviewDate: sortedHistory[0].completedAt,
      streakStartDate
    };
  }

  private calculateMonthlyProgress(history: InterviewHistoryEntry[]): MonthlyProgress[] {
    const monthlyData = history.reduce((months, entry) => {
      const monthKey = entry.completedAt.toISOString().substring(0, 7); // YYYY-MM
      
      if (!months[monthKey]) {
        months[monthKey] = {
          month: monthKey,
          interviewCount: 0,
          totalScore: 0,
          scores: []
        };
      }
      
      months[monthKey].interviewCount++;
      months[monthKey].totalScore += entry.overallScore;
      months[monthKey].scores.push(entry.overallScore);
      
      return months;
    }, {} as Record<string, any>);

    return Object.values(monthlyData)
      .map((month: any) => ({
        month: month.month,
        interviewCount: month.interviewCount,
        averageScore: Math.round(month.totalScore / month.interviewCount),
        improvementRate: this.calculateMonthlyImprovement(month.scores)
      }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 6); // Last 6 months
  }

  private calculateMonthlyImprovement(scores: number[]): number {
    if (scores.length < 2) return 0;
    
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
    
    return Math.round(((secondAvg - firstAvg) / firstAvg) * 100);
  }

  private calculateSkillProgress(history: InterviewHistoryEntry[]): SkillProgress[] {
    const skillData = history.reduce((skills, entry) => {
      const feedback = entry.aiAnalysis.detailedFeedback;
      
      Object.entries(feedback).forEach(([skill, score]) => {
        if (!skills[skill]) {
          skills[skill] = {
            skill,
            category: skill as any,
            scores: [],
            dates: []
          };
        }
        
        skills[skill].scores.push(score);
        skills[skill].dates.push(entry.completedAt);
      });
      
      return skills;
    }, {} as Record<string, any>);

    return Object.values(skillData)
      .map((skill: any) => {
        const currentLevel = skill.scores[0] || 0;
        const previousLevel = skill.scores[skill.scores.length - 1] || 0;
        
        return {
          skill: skill.skill,
          category: skill.category,
          currentLevel,
          previousLevel,
          improvement: currentLevel - previousLevel,
          lastPracticed: skill.dates[0],
          practiceCount: skill.scores.length
        };
      })
      .sort((a, b) => b.currentLevel - a.currentLevel);
  }
}

// Export singleton instance
export const interviewHistoryManager = InterviewHistoryManager.getInstance();