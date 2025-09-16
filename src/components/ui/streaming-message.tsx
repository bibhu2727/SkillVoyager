'use client';

import React, { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Bot, User, CheckCircle, Clock, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StreamingMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    suggestions?: string[];
    actionItems?: string[];
    isComplete?: boolean;
  };
  isStreaming?: boolean;
  cacheHit?: boolean;
  responseTime?: number;
  className?: string;
}

/**
 * Optimized Streaming Message Component
 * Uses React.memo and useMemo for performance optimization
 */
export const StreamingMessage = memo<StreamingMessageProps>(({ 
  message, 
  isStreaming = false,
  cacheHit = false,
  responseTime,
  className 
}) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  // Memoize formatted content to prevent unnecessary re-renders
  const formattedContent = useMemo(() => {
    if (!message.content) return '';
    
    // Split content into paragraphs for better rendering
    return message.content.split('\n').filter(Boolean);
  }, [message.content]);

  // Memoize suggestions rendering
  const suggestionsElement = useMemo(() => {
    if (!message.suggestions?.length) return null;

    return (
      <div className="mt-3 space-y-2">
        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
          Suggestions:
        </div>
        <div className="flex flex-wrap gap-2">
          {message.suggestions.map((suggestion, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      </div>
    );
  }, [message.suggestions]);

  // Memoize action items rendering
  const actionItemsElement = useMemo(() => {
    if (!message.actionItems?.length) return null;

    return (
      <div className="mt-3 space-y-2">
        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
          Action Items:
        </div>
        <ul className="space-y-1">
          {message.actionItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }, [message.actionItems]);

  // Memoize performance indicators
  const performanceIndicators = useMemo(() => {
    if (isUser) return null;

    return (
      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
        {cacheHit && (
          <Badge variant="outline" className="text-xs border-green-500 text-green-600">
            <Zap className="h-3 w-3 mr-1" />
            Cached
          </Badge>
        )}
        {responseTime && (
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {responseTime}ms
          </Badge>
        )}
        {message.isComplete && (
          <Badge variant="outline" className="text-xs border-green-500 text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complete
          </Badge>
        )}
      </div>
    );
  }, [isUser, cacheHit, responseTime, message.isComplete]);

  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg transition-all duration-200",
      isUser ? "bg-blue-50 dark:bg-blue-950 ml-8" : "bg-slate-50 dark:bg-slate-900 mr-8",
      isStreaming && "animate-pulse",
      className
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
        isUser 
          ? "bg-blue-600 text-white" 
          : "bg-slate-600 text-white dark:bg-slate-300 dark:text-slate-900"
      )}>
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Message content */}
        <div className="space-y-2">
          {formattedContent.map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed text-slate-900 dark:text-slate-100">
              {paragraph}
              {isStreaming && index === formattedContent.length - 1 && (
                <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse" />
              )}
            </p>
          ))}
        </div>

        {/* Suggestions */}
        {suggestionsElement}

        {/* Action Items */}
        {actionItemsElement}

        {/* Performance Indicators */}
        {performanceIndicators}

        {/* Timestamp */}
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
});

StreamingMessage.displayName = 'StreamingMessage';