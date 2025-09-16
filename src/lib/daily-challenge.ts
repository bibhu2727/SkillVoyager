import type { QuizQuestion, SkillCategory, DifficultyLevel } from './quiz-data';

export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD format
  category: SkillCategory;
  difficulty: DifficultyLevel;
  questions: QuizQuestion[];
  bonusMultiplier: number;
  theme: string;
  description: string;
}

export interface DailyChallengeResult {
  challengeId: string;
  userId: string;
  score: number;
  totalPoints: number;
  completedAt: Date;
  timeSpent: number; // in seconds
}

const CHALLENGE_THEMES = [
  {
    theme: 'Monday Motivation',
    description: 'Start your week strong with fundamental concepts!',
    preferredCategories: ['Project Management', 'Human Resources'],
    difficulty: 'Beginner' as DifficultyLevel,
    bonusMultiplier: 1.2
  },
  {
    theme: 'Tech Tuesday',
    description: 'Dive deep into technical skills and innovation!',
    preferredCategories: ['Software Development', 'Data Science'],
    difficulty: 'Intermediate' as DifficultyLevel,
    bonusMultiplier: 1.5
  },
  {
    theme: 'Wisdom Wednesday',
    description: 'Challenge yourself with advanced concepts!',
    preferredCategories: ['Finance', 'Marketing'],
    difficulty: 'Advanced' as DifficultyLevel,
    bonusMultiplier: 2.0
  },
  {
    theme: 'Throwback Thursday',
    description: 'Revisit classic skills and timeless knowledge!',
    preferredCategories: ['Design', 'Sales'],
    difficulty: 'Intermediate' as DifficultyLevel,
    bonusMultiplier: 1.3
  },
  {
    theme: 'Friday Focus',
    description: 'End the week with a focused skill challenge!',
    preferredCategories: ['Data Science', 'Project Management'],
    difficulty: 'Beginner' as DifficultyLevel,
    bonusMultiplier: 1.4
  },
  {
    theme: 'Saturday Special',
    description: 'Weekend learning with a special twist!',
    preferredCategories: ['Marketing', 'Design'],
    difficulty: 'Advanced' as DifficultyLevel,
    bonusMultiplier: 1.8
  },
  {
    theme: 'Sunday Synthesis',
    description: 'Combine knowledge from multiple domains!',
    preferredCategories: ['Finance', 'Software Development'],
    difficulty: 'Intermediate' as DifficultyLevel,
    bonusMultiplier: 1.6
  }
];

export async function generateDailyChallenge(date: Date = new Date()): Promise<DailyChallenge> {
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Use date as seed for consistent daily challenges
  const seed = dateString.split('-').reduce((acc, part) => acc + parseInt(part), 0);
  
  // Select theme based on day of week
  const themeIndex = dayOfWeek;
  const selectedTheme = CHALLENGE_THEMES[themeIndex];
  
  // Select category from preferred categories using seed
  const categoryIndex = seed % selectedTheme.preferredCategories.length;
  const category = selectedTheme.preferredCategories[categoryIndex] as SkillCategory;
  
  // Dynamically import getRandomQuestions to reduce bundle size
  const { getRandomQuestions } = await import('./quiz-data');
  const questions = getRandomQuestions(category, selectedTheme.difficulty, 5);
  
  return {
    id: `daily_${dateString}`,
    date: dateString,
    category,
    difficulty: selectedTheme.difficulty,
    questions,
    bonusMultiplier: selectedTheme.bonusMultiplier,
    theme: selectedTheme.theme,
    description: selectedTheme.description
  };
}

export async function getTodaysChallenge(): Promise<DailyChallenge> {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  // Check if we have today's challenge cached (only on client-side)
  if (typeof window !== 'undefined') {
    const cachedChallenge = localStorage.getItem(`dailyChallenge_${todayString}`);
    if (cachedChallenge) {
      return JSON.parse(cachedChallenge);
    }
  }
  
  // Generate new challenge for today
  const challenge = await generateDailyChallenge(today);
  
  // Cache the challenge (only on client-side)
  if (typeof window !== 'undefined') {
    localStorage.setItem(`dailyChallenge_${todayString}`, JSON.stringify(challenge));
  }
  
  return challenge;
}

export function hasTakenTodaysChallenge(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const today = new Date().toISOString().split('T')[0];
  const results: DailyChallengeResult[] = JSON.parse(
    localStorage.getItem('dailyChallengeResults') || '[]'
  );
  
  return results.some(result => 
    result.userId === userId && 
    result.challengeId === `daily_${today}`
  );
}

export function saveDailyChallengeResult(result: DailyChallengeResult): void {
  if (typeof window === 'undefined') return;
  
  const existingResults: DailyChallengeResult[] = JSON.parse(
    localStorage.getItem('dailyChallengeResults') || '[]'
  );
  
  existingResults.push(result);
  localStorage.setItem('dailyChallengeResults', JSON.stringify(existingResults));
}

export function getDailyChallengeResults(userId: string): DailyChallengeResult[] {
  if (typeof window === 'undefined') return [];
  
  const results: DailyChallengeResult[] = JSON.parse(
    localStorage.getItem('dailyChallengeResults') || '[]'
  );
  
  return results.filter(result => result.userId === userId);
}

export function getDailyChallengeStreak(userId: string): number {
  const results = getDailyChallengeResults(userId);
  if (results.length === 0) return 0;
  
  // Sort results by completion date (most recent first)
  const sortedResults = results.sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  // Check if user completed today's challenge
  const todayString = today.toISOString().split('T')[0];
  const completedToday = results.some(result => 
    result.challengeId === `daily_${todayString}`
  );
  
  // If not completed today, check if completed yesterday (streak might still be active)
  if (!completedToday) {
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  // Count consecutive days
  const completedDates = new Set(
    results.map(result => result.challengeId.replace('daily_', ''))
  );
  
  while (true) {
    const dateString = currentDate.toISOString().split('T')[0];
    if (completedDates.has(dateString)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

export function getWeeklyDailyChallengeStats(userId: string): {
  completed: number;
  totalPossible: number;
  averageScore: number;
  totalBonus: number;
} {
  const results = getDailyChallengeResults(userId);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const weeklyResults = results.filter(result => 
    new Date(result.completedAt) >= oneWeekAgo
  );
  
  const completed = weeklyResults.length;
  const totalPossible = 7; // 7 days in a week
  const averageScore = weeklyResults.length > 0 
    ? weeklyResults.reduce((sum, result) => sum + (result.score / result.totalPoints), 0) / weeklyResults.length
    : 0;
  
  // Calculate bonus points earned from daily challenges
  const totalBonus = weeklyResults.reduce((sum, result) => {
    const baseScore = result.score;
    const challenge = JSON.parse(localStorage.getItem(`dailyChallenge_${result.challengeId.replace('daily_', '')}`) || '{}');
    const bonusMultiplier = challenge.bonusMultiplier || 1;
    return sum + (baseScore * (bonusMultiplier - 1));
  }, 0);
  
  return {
    completed,
    totalPossible,
    averageScore,
    totalBonus: Math.round(totalBonus)
  };
}

export async function getUpcomingChallenges(days: number = 7): Promise<DailyChallenge[]> {
  const challenges: DailyChallenge[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    challenges.push(await generateDailyChallenge(date));
  }
  
  return challenges;
}

export function calculateDailyChallengeScore(answers: (number | null)[], challenge: DailyChallenge): number {
  let score = 0;
  
  answers.forEach((answer, index) => {
    if (answer !== null && answer === challenge.questions[index].correctAnswer) {
      score += challenge.questions[index].points;
    }
  });
  
  // Apply bonus multiplier
  return Math.round(score * challenge.bonusMultiplier);
}