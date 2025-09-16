'use client';

import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { InterviewSession } from '@/lib/interview-simulator';

// Lazy load the InterviewResultsDashboard component
const InterviewResultsDashboard = lazy(() => import('./interview-results-dashboard').then(module => ({ default: module.InterviewResultsDashboard })));

interface LazyInterviewResultsDashboardProps {
  session: InterviewSession;
  onRetake?: () => void;
  onDownloadReport?: () => void;
  onShare?: () => void;
}

// Loading skeleton component
const InterviewResultsSkeleton = () => (
  <div className="space-y-6">
    <div className="text-center space-y-4">
      <Skeleton className="h-8 w-64 mx-auto" />
      <Skeleton className="h-4 w-48 mx-auto" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
    
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
    
    <div className="flex gap-4 justify-center">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-32" />
    </div>
  </div>
);

export default function LazyInterviewResultsDashboard(props: LazyInterviewResultsDashboardProps) {
  return (
    <Suspense fallback={<InterviewResultsSkeleton />}>
      <InterviewResultsDashboard {...props} />
    </Suspense>
  );
}