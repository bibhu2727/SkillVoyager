import { Metadata } from 'next';
import { GamesHub } from '@/components/games/games-hub';

export const metadata: Metadata = {
  title: 'Career Games | SkillVoyager',
  description: 'Interactive career simulation and skill-building games to enhance your professional journey.',
};

export default function GamesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            🎮 Career Games Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Level up your career skills through interactive games and simulations.
          </p>
        </div>
        
        <GamesHub />
      </div>
    </div>
  );
}