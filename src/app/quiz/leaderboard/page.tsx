import { Leaderboard } from '@/components/quiz/leaderboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiz Leaderboard | SkillVoyager',
  description: 'See how you rank against other quiz takers and track your performance across different skill categories.',
};

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Leaderboard />
      </div>
    </div>
  );
}