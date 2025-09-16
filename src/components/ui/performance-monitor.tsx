'use client';

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Clock, Database, Zap } from 'lucide-react';

interface PerformanceStats {
  averageResponseTime: number;
  cacheHitRate: number;
  totalRequests: number;
  preloaderStats?: {
    preloadedQueries: number;
    hitRate: number;
    backgroundProcessing: boolean;
  };
}

interface PerformanceMonitorProps {
  stats: PerformanceStats;
  isVisible?: boolean;
}

/**
 * Performance Monitor Component
 * Displays real-time performance metrics for the chat system
 */
export const PerformanceMonitor = memo<PerformanceMonitorProps>(({ 
  stats, 
  isVisible = false 
}) => {
  if (!isVisible) return null;

  const getResponseTimeColor = (time: number) => {
    if (time < 1000) return 'text-green-600';
    if (time < 3000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCacheRateColor = (rate: number) => {
    if (rate > 70) return 'text-green-600';
    if (rate > 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Activity className="h-4 w-4 text-blue-600" />
          Performance Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Response Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium">Avg Response</span>
          </div>
          <Badge 
            variant="outline" 
            className={`${getResponseTimeColor(stats.averageResponseTime)} border-current`}
          >
            {stats.averageResponseTime.toFixed(0)}ms
          </Badge>
        </div>

        {/* Cache Hit Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium">Cache Hit Rate</span>
            </div>
            <span className={`text-sm font-semibold ${getCacheRateColor(stats.cacheHitRate)}`}>
              {stats.cacheHitRate.toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={stats.cacheHitRate} 
            className="h-2"
          />
        </div>

        {/* Preloader Stats */}
        {stats.preloaderStats && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Preloader</span>
              </div>
              <div className="flex items-center gap-2">
                {stats.preloaderStats.backgroundProcessing && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
                <Badge variant="secondary" className="text-xs">
                  {stats.preloaderStats.preloadedQueries} ready
                </Badge>
              </div>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Hit Rate: {stats.preloaderStats.hitRate.toFixed(1)}%
            </div>
          </div>
        )}

        {/* Total Requests */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-600 dark:text-slate-400">
            Total Requests
          </span>
          <span className="text-xs font-medium">
            {stats.totalRequests}
          </span>
        </div>

        {/* Performance Status */}
        <div className="flex items-center justify-center pt-2">
          <Badge 
            variant={stats.averageResponseTime < 5000 ? "default" : "destructive"}
            className="text-xs"
          >
            {stats.averageResponseTime < 5000 ? "🚀 Optimized" : "⚠️ Needs Optimization"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';