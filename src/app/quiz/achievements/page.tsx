import { Achievements } from '@/components/quiz/achievements';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiz Achievements | SkillVoyager',
  description: 'Track your quiz achievements, badges, and milestones as you progress through different skill challenges.',
};

export default function AchievementsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Achievements & Badges
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your progress and celebrate your learning milestones.
          </p>
        </div>
        
        <Achievements />
      </div>
    </div>
  );
}