'use client';

import React, { memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Bot, Loader2, Zap, Database } from 'lucide-react';

interface TypingIndicatorProps {
  isVisible: boolean;
  stage?: 'thinking' | 'processing' | 'streaming' | 'caching';
  cacheHit?: boolean;
  optimizationLevel?: 'fast' | 'balanced' | 'maximum';
  className?: string;
}

/**
 * Intelligent Typing Indicator Component
 * Shows different states based on processing stage and optimization level
 */
export const TypingIndicator = memo<TypingIndicatorProps>(({ 
  isVisible, 
  stage = 'thinking',
  cacheHit = false,
  optimizationLevel = 'balanced',
  className 
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const getStageInfo = () => {
    switch (stage) {
      case 'thinking':
        return {
          icon: Bot,
          text: 'Analyzing your question',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-950'
        };
      case 'processing':
        return {
          icon: Loader2,
          text: 'Processing with AI',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 dark:bg-purple-950'
        };
      case 'streaming':
        return {
          icon: Zap,
          text: 'Streaming response',
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-950'
        };
      case 'caching':
        return {
          icon: Database,
          text: 'Optimizing for next time',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 dark:bg-orange-950'
        };
      default:
        return {
          icon: Bot,
          text: 'Working on it',
          color: 'text-slate-600',
          bgColor: 'bg-slate-50 dark:bg-slate-950'
        };
    }
  };

  const stageInfo = getStageInfo();
  const Icon = stageInfo.icon;

  const getOptimizationBadge = () => {
    if (cacheHit) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200">
          <Zap className="h-3 w-3" />
          Instant
        </span>
      );
    }

    switch (optimizationLevel) {
      case 'fast':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
            <Zap className="h-3 w-3" />
            Fast
          </span>
        );
      case 'maximum':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full dark:bg-purple-900 dark:text-purple-200">
            <Zap className="h-3 w-3" />
            Max
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 animate-in slide-in-from-bottom-2",
      stageInfo.bgColor,
      "border-slate-200 dark:border-slate-700",
      className
    )}>
      <div className="flex items-center gap-3 flex-1">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full",
          "bg-white dark:bg-slate-800 shadow-sm"
        )}>
          <Icon className={cn(
            "h-4 w-4",
            stageInfo.color,
            stage === 'processing' && "animate-spin",
            stage === 'streaming' && "animate-pulse"
          )} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-medium", stageInfo.color)}>
              {stageInfo.text}{dots}
            </span>
            {getOptimizationBadge()}
          </div>
          
          {/* Progress dots animation */}
          <div className="flex items-center gap-1 mt-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  stageInfo.color.replace('text-', 'bg-'),
                  "animate-pulse"
                )}
                style={{
                  animationDelay: `${i * 200}ms`,
                  opacity: dots.length > i ? 1 : 0.3
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Performance indicator */}
      <div className="text-xs text-slate-500 dark:text-slate-400">
        {cacheHit ? '<50ms' : '<5s'}
      </div>
    </div>
  );
});

TypingIndicator.displayName = 'TypingIndicator';