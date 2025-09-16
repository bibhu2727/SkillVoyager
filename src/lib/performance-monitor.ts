/**
 * @fileOverview Performance monitoring system for CareerGuru chat
 * Tracks response times, identifies bottlenecks, and provides optimization insights
 */

interface PerformanceMetric {
  id: string;
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
  status: 'pending' | 'completed' | 'failed';
}

interface PerformanceStats {
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  totalRequests: number;
  successRate: number;
  cacheHitRate: number;
  slowestOperations: Array<{ operation: string; avgTime: number }>;
}

class PerformanceMonitor {
  private metrics = new Map<string, PerformanceMetric>();
  private completedMetrics: PerformanceMetric[] = [];
  private maxHistorySize = 1000;

  /**
   * Start tracking a performance metric
   */
  startMetric(operation: string, metadata?: Record<string, any>): string {
    const id = `${operation}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const metric: PerformanceMetric = {
      id,
      operation,
      startTime: performance.now(),
      metadata,
      status: 'pending'
    };

    this.metrics.set(id, metric);
    return id;
  }

  /**
   * End tracking a performance metric
   */
  endMetric(id: string, status: 'completed' | 'failed' = 'completed', additionalMetadata?: Record<string, any>): void {
    const metric = this.metrics.get(id);
    if (!metric) return;

    const endTime = performance.now();
    metric.endTime = endTime;
    metric.duration = endTime - metric.startTime;
    metric.status = status;

    if (additionalMetadata) {
      metric.metadata = { ...metric.metadata, ...additionalMetadata };
    }

    // Move to completed metrics
    this.completedMetrics.push(metric);
    this.metrics.delete(id);

    // Maintain history size
    if (this.completedMetrics.length > this.maxHistorySize) {
      this.completedMetrics.shift();
    }

    // Log slow operations
    if (metric.duration > 5000) { // 5 seconds
      console.warn(`Slow operation detected: ${metric.operation} took ${metric.duration.toFixed(2)}ms`);
    }
  }

  /**
   * Track a complete operation with automatic timing
   */
  async trackOperation<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const id = this.startMetric(operation, metadata);
    
    try {
      const result = await fn();
      this.endMetric(id, 'completed', { success: true });
      return result;
    } catch (error) {
      this.endMetric(id, 'failed', { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Get performance statistics
   */
  getStats(): PerformanceStats {
    const completedOps = this.completedMetrics.filter(m => m.status === 'completed' && m.duration);
    const durations = completedOps.map(m => m.duration!).sort((a, b) => a - b);

    if (durations.length === 0) {
      return {
        averageResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        totalRequests: 0,
        successRate: 0,
        cacheHitRate: 0,
        slowestOperations: []
      };
    }

    const average = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const p95Index = Math.floor(durations.length * 0.95);
    const p99Index = Math.floor(durations.length * 0.99);

    const successfulOps = this.completedMetrics.filter(m => m.status === 'completed').length;
    const totalOps = this.completedMetrics.length;
    const successRate = totalOps > 0 ? successfulOps / totalOps : 0;

    // Calculate cache hit rate
    const cacheHits = this.completedMetrics.filter(m => 
      m.metadata?.cached === true
    ).length;
    const cacheHitRate = totalOps > 0 ? cacheHits / totalOps : 0;

    // Find slowest operations
    const operationTimes = new Map<string, number[]>();
    completedOps.forEach(m => {
      if (!operationTimes.has(m.operation)) {
        operationTimes.set(m.operation, []);
      }
      operationTimes.get(m.operation)!.push(m.duration!);
    });

    const slowestOperations = Array.from(operationTimes.entries())
      .map(([operation, times]) => ({
        operation,
        avgTime: times.reduce((sum, t) => sum + t, 0) / times.length
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 5);

    return {
      averageResponseTime: average,
      p95ResponseTime: durations[p95Index] || 0,
      p99ResponseTime: durations[p99Index] || 0,
      totalRequests: totalOps,
      successRate,
      cacheHitRate,
      slowestOperations
    };
  }

  /**
   * Get recent metrics for debugging
   */
  getRecentMetrics(limit: number = 10): PerformanceMetric[] {
    return this.completedMetrics.slice(-limit);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    this.completedMetrics = [];
  }

  /**
   * Get real-time performance health
   */
  getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  } {
    const stats = this.getStats();
    const issues: string[] = [];
    const recommendations: string[] = [];
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    // Check average response time
    if (stats.averageResponseTime > 5000) {
      status = 'critical';
      issues.push('Average response time exceeds 5 seconds');
      recommendations.push('Implement response streaming and optimize AI calls');
    } else if (stats.averageResponseTime > 3000) {
      status = 'warning';
      issues.push('Average response time is above 3 seconds');
      recommendations.push('Consider implementing caching for common queries');
    }

    // Check success rate
    if (stats.successRate < 0.9) {
      status = 'critical';
      issues.push('Success rate is below 90%');
      recommendations.push('Investigate error patterns and implement retry logic');
    } else if (stats.successRate < 0.95) {
      status = status === 'critical' ? 'critical' : 'warning';
      issues.push('Success rate is below 95%');
      recommendations.push('Monitor error logs and improve error handling');
    }

    // Check cache hit rate
    if (stats.cacheHitRate < 0.2) {
      recommendations.push('Improve caching strategy to reduce AI API calls');
    }

    return { status, issues, recommendations };
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Helper function for easy operation tracking
export const trackPerformance = <T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> => {
  return performanceMonitor.trackOperation(operation, fn, metadata);
};

export default performanceMonitor;