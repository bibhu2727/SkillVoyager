"use client";

import { lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Video, Mic } from 'lucide-react';
import type { JobRole, DifficultyLevel, InterviewSession } from '@/lib/interview-simulator';

// Lazy load the InterviewSimulator component to reduce initial bundle size
const InterviewSimulator = lazy(() => import('./interview-simulator').then(module => ({ default: module.InterviewSimulator })));

function InterviewSimulatorSkeleton() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Video className="h-6 w-6" />
          <Mic className="h-6 w-6" />
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading Interview Simulator...
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-muted rounded animate-pulse" />
          <div className="h-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="h-10 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-12 bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

interface LazyInterviewSimulatorProps {
  jobRole: JobRole;
  difficulty: DifficultyLevel;
  duration: number;
  onComplete: (session: InterviewSession) => void;
}

export function LazyInterviewSimulator({ 
  jobRole, 
  difficulty, 
  duration, 
  onComplete 
}: LazyInterviewSimulatorProps) {
  return (
    <Suspense fallback={<InterviewSimulatorSkeleton />}>
      <InterviewSimulator 
        jobRole={jobRole}
        difficulty={difficulty}
        duration={duration}
        onComplete={onComplete}
      />
    </Suspense>
  );
}