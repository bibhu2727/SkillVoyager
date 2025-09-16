'use client';

import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the InterviewHistoryDashboard component
const InterviewHistoryDashboard = lazy(() => import('./interview-history-dashboard').then(module => ({ default: module.InterviewHistoryDashboard })));

interface LazyInterviewHistoryDashboardProps {
  onStartNewInterview: () => void;
}

// Loading skeleton component
const InterviewHistorySkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-3">
          <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      ))}
    </div>
    
    <div className="flex justify-center">
      <Skeleton className="h-10 w-32" />
    </div>
  </div>
);

export default function LazyInterviewHistoryDashboard(props: LazyInterviewHistoryDashboardProps) {
  return (
    <Suspense fallback={<InterviewHistorySkeleton />}>
      <InterviewHistoryDashboard {...props} />
    </Suspense>
  );
}