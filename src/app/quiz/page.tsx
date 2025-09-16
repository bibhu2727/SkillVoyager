import { LazyQuizGame } from '@/components/quiz/lazy-quiz-game';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skill Challenge Quiz | SkillVoyager',
  description: 'Test your knowledge across different career fields and earn points with our interactive quiz game.',
};

export default function QuizPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Skill Challenge Quiz
          </h1>
          <p className="text-muted-foreground text-lg">
            Test your knowledge, earn points, and track your progress across different career fields.
          </p>
        </div>
        
        <LazyQuizGame />
      </div>
    </div>
  );
}