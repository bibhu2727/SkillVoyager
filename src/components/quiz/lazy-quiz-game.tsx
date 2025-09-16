"use client";

import { lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Lazy load the QuizGame component to reduce initial bundle size
const QuizGame = lazy(() => import('./quiz-game').then(module => ({ default: module.QuizGame })));

function QuizGameSkeleton() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading Quiz...
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="h-10 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

interface LazyQuizGameProps {
  onQuizComplete?: (session: any) => void;
}

export function LazyQuizGame({ onQuizComplete }: LazyQuizGameProps) {
  return (
    <Suspense fallback={<QuizGameSkeleton />}>
      <QuizGame onQuizComplete={onQuizComplete} />
    </Suspense>
  );
}