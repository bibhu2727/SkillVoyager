"use client";

import { lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar } from 'lucide-react';

// Lazy load the DailyChallenge component to reduce initial bundle size
const DailyChallenge = lazy(() => import('./daily-challenge').then(module => ({ default: module.DailyChallenge })));

function DailyChallengeSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Calendar className="h-6 w-6" />
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading Daily Challenge...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-20 bg-muted rounded animate-pulse" />
            <div className="h-20 bg-muted rounded animate-pulse" />
            <div className="h-20 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-32 bg-muted rounded animate-pulse" />
          <div className="h-10 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    </div>
  );
}

export function LazyDailyChallenge() {
  return (
    <Suspense fallback={<DailyChallengeSkeleton />}>
      <DailyChallenge />
    </Suspense>
  );
}