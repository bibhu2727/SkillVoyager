import { Metadata } from 'next';
import { LazyDailyChallenge } from '@/components/quiz/lazy-daily-challenge';

export const metadata: Metadata = {
  title: 'Daily Challenge - Skill Quiz',
  description: 'Take on today\'s skill challenge and earn bonus points with our daily quiz game.',
};

export default function DailyChallengePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Daily Challenge</h1>
        <p className="text-muted-foreground">
          Test your skills with today's challenge and earn bonus points. New challenges available every day!
        </p>
      </div>
      
      <LazyDailyChallenge />
    </div>
  );
}