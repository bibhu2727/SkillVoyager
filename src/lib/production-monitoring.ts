/**
 * Production Monitoring and Analytics
 * Handles performance tracking, error reporting, and user analytics
 */

import React from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  timestamp: number;
  userAgent: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface UserEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

class ProductionMonitoring {
  private isEnabled: boolean;
  private sessionId: string;
  private userId?: string;
  private performanceBuffer: PerformanceMetric[] = [];
  private errorBuffer: ErrorReport[] = [];
  private eventBuffer: UserEvent[] = [];
  private flushInterval: number = 30000; // 30 seconds
  private maxBufferSize: number = 100;

  constructor() {
    this.isEnabled = (import.meta as any).env?.VITE_ENABLE_ANALYTICS === 'true';  
    this.sessionId = this.generateSessionId();
    
    if (this.isEnabled) {
      this.initializeMonitoring();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMonitoring(): void {
    // Set up periodic flushing
    setInterval(() => {
      this.flush();
    }, this.flushInterval);

    // Set up performance observer
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.trackPerformance(entry.name, entry.duration, {
              entryType: entry.entryType,
              startTime: entry.startTime
            });
          }
        });
        
        observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }

    // Set up error tracking
    window.addEventListener('error', (event) => {
      this.trackError(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(new Error(event.reason), {
        type: 'unhandledrejection'
      });
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('page_visibility_change', {
        hidden: document.hidden
      });
    });

    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.trackPerformance('page_load_time', navigation.loadEventEnd - navigation.fetchStart);
          this.trackPerformance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
          this.trackPerformance('first_contentful_paint', this.getFirstContentfulPaint());
        }
      }, 0);
    });
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : 0;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  trackPerformance(name: string, value: number, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    };

    this.performanceBuffer.push(metric);
    this.checkBufferSize();
  }

  trackError(error: Error, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      userId: this.userId,
      metadata
    };

    this.errorBuffer.push(errorReport);
    this.checkBufferSize();

    // Also log to console in development
    if ((import.meta as any).env?.DEV) {
      console.error('Tracked error:', error, metadata);
    }
  }

  trackEvent(event: string, properties: Record<string, any> = {}): void {
    if (!this.isEnabled) return;

    const userEvent: UserEvent = {
      event,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.eventBuffer.push(userEvent);
    this.checkBufferSize();
  }

  // Interview-specific tracking methods
  trackInterviewStart(interviewerId: string, interviewType: string): void {
    this.trackEvent('interview_started', {
      interviewer_id: interviewerId,
      interview_type: interviewType
    });
  }

  trackInterviewComplete(duration: number, score: number, interviewerId: string): void {
    this.trackEvent('interview_completed', {
      duration,
      score,
      interviewer_id: interviewerId
    });
  }

  trackSpeechRecognitionEvent(event: string, metadata?: Record<string, any>): void {
    this.trackEvent('speech_recognition', {
      event,
      ...metadata
    });
  }

  trackMediaPermission(type: 'camera' | 'microphone', granted: boolean): void {
    this.trackEvent('media_permission', {
      type,
      granted
    });
  }

  trackComponentLoad(componentName: string, loadTime: number): void {
    this.trackPerformance(`component_load_${componentName}`, loadTime);
  }

  private checkBufferSize(): void {
    if (this.performanceBuffer.length >= this.maxBufferSize ||
        this.errorBuffer.length >= this.maxBufferSize ||
        this.eventBuffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (!this.isEnabled) return;

    const data = {
      performance: [...this.performanceBuffer],
      errors: [...this.errorBuffer],
      events: [...this.eventBuffer],
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Clear buffers
    this.performanceBuffer = [];
    this.errorBuffer = [];
    this.eventBuffer = [];

    // Skip if no data to send
    if (data.performance.length === 0 && data.errors.length === 0 && data.events.length === 0) {
      return;
    }

    try {
      // Send to analytics endpoint
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      // Silently fail in production, log in development
      if ((import.meta as any).env?.DEV) {
        console.warn('Failed to send analytics data:', error);
      }
    }
  }

  // Manual flush for critical events
  async flushImmediate(): Promise<void> {
    await this.flush();
  }

  // Clean up on page unload
  destroy(): void {
    this.flush();
  }
}

// Create singleton instance
export const productionMonitoring = new ProductionMonitoring();

// Performance measurement utility
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>,
  metadata?: Record<string, any>
): T | Promise<T> {
  const start = performance.now();
  
  try {
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        productionMonitoring.trackPerformance(name, duration, metadata);
      });
    } else {
      const duration = performance.now() - start;
      productionMonitoring.trackPerformance(name, duration, metadata);
      return result;
    }
  } catch (error) {
    const duration = performance.now() - start;
    productionMonitoring.trackPerformance(name, duration, { ...metadata, error: true });
    productionMonitoring.trackError(error as Error, { context: name, ...metadata });
    throw error;
  }
}

// React hook for component performance tracking
export function useComponentPerformance(componentName: string) {
  React.useEffect(() => {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      productionMonitoring.trackComponentLoad(componentName, duration);
    };
  }, [componentName]);
}

// Error boundary integration
export function trackErrorBoundary(error: Error, errorInfo: any, componentStack?: string) {
  productionMonitoring.trackError(error, {
    type: 'react_error_boundary',
    componentStack,
    errorInfo
  });
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    productionMonitoring.destroy();
  });
}