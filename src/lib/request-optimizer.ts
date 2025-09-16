/**
 * @fileOverview Advanced request optimization system for CareerGuru
 * Implements connection pooling, request batching, and intelligent routing
 * for sub-5-second response times
 */

interface RequestConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  priority: 'high' | 'medium' | 'low';
  timeout: number;
}

interface BatchedRequest {
  id: string;
  config: RequestConfig;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  timestamp: number;
}

interface ConnectionPool {
  activeConnections: number;
  maxConnections: number;
  queue: BatchedRequest[];
  processing: boolean;
}

class RequestOptimizer {
  private connectionPool: ConnectionPool;
  private batchQueue: BatchedRequest[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private readonly BATCH_SIZE = 5;
  private readonly BATCH_DELAY = 100; // ms
  private readonly MAX_CONNECTIONS = 6;
  private readonly CONNECTION_TIMEOUT = 8000; // ms

  constructor() {
    this.connectionPool = {
      activeConnections: 0,
      maxConnections: this.MAX_CONNECTIONS,
      queue: [],
      processing: false
    };
  }

  /**
   * Optimized fetch with connection pooling and batching
   */
  async optimizedFetch(config: RequestConfig): Promise<Response> {
    return new Promise((resolve, reject) => {
      const request: BatchedRequest = {
        id: this.generateRequestId(),
        config,
        resolve,
        reject,
        timestamp: Date.now()
      };

      // Add to batch queue
      this.batchQueue.push(request);

      // Process immediately for high priority requests
      if (config.priority === 'high') {
        this.processBatch();
      } else {
        // Batch low/medium priority requests
        this.scheduleBatchProcessing();
      }
    });
  }

  /**
   * Schedule batch processing with debouncing
   */
  private scheduleBatchProcessing(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }

    this.batchTimer = setTimeout(() => {
      this.processBatch();
    }, this.BATCH_DELAY);
  }

  /**
   * Process batched requests with connection pooling
   */
  private async processBatch(): Promise<void> {
    if (this.connectionPool.processing || this.batchQueue.length === 0) {
      return;
    }

    this.connectionPool.processing = true;

    // Sort by priority and timestamp
    this.batchQueue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.config.priority] - priorityOrder[a.config.priority];
      return priorityDiff !== 0 ? priorityDiff : a.timestamp - b.timestamp;
    });

    // Process requests in batches
    while (this.batchQueue.length > 0) {
      const batch = this.batchQueue.splice(0, Math.min(this.BATCH_SIZE, this.batchQueue.length));
      
      // Wait for available connections
      await this.waitForAvailableConnection();

      // Process batch concurrently
      const promises = batch.map(request => this.executeRequest(request));
      
      try {
        await Promise.allSettled(promises);
      } catch (error) {
        console.error('Batch processing error:', error);
      }
    }

    this.connectionPool.processing = false;
  }

  /**
   * Wait for available connection slot
   */
  private async waitForAvailableConnection(): Promise<void> {
    return new Promise((resolve) => {
      const checkConnection = () => {
        if (this.connectionPool.activeConnections < this.connectionPool.maxConnections) {
          resolve();
        } else {
          setTimeout(checkConnection, 10);
        }
      };
      checkConnection();
    });
  }

  /**
   * Execute individual request with connection management
   */
  private async executeRequest(request: BatchedRequest): Promise<void> {
    this.connectionPool.activeConnections++;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, request.config.timeout || this.CONNECTION_TIMEOUT);

      const response = await fetch(request.config.url, {
        method: request.config.method,
        headers: request.config.headers,
        body: request.config.body,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      request.resolve(response);

    } catch (error) {
      request.reject(error);
    } finally {
      this.connectionPool.activeConnections--;
    }
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get connection pool stats
   */
  getStats() {
    return {
      activeConnections: this.connectionPool.activeConnections,
      maxConnections: this.connectionPool.maxConnections,
      queueLength: this.batchQueue.length,
      processing: this.connectionPool.processing
    };
  }

  /**
   * Clear all pending requests
   */
  clearQueue(): void {
    this.batchQueue.forEach(request => {
      request.reject(new Error('Request cancelled'));
    });
    this.batchQueue = [];
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
  }
}

// Global instance
export const requestOptimizer = new RequestOptimizer();

/**
 * Optimized fetch wrapper for CareerGuru API calls
 */
export async function optimizedFetch(
  url: string, 
  options: RequestInit & { priority?: 'high' | 'medium' | 'low' } = {}
): Promise<Response> {
  const { priority = 'medium', ...fetchOptions } = options;
  
  const config: RequestConfig = {
    url,
    method: fetchOptions.method || 'GET',
    headers: (fetchOptions.headers as Record<string, string>) || {},
    body: fetchOptions.body as string || '',
    priority,
    timeout: 8000
  };

  return requestOptimizer.optimizedFetch(config);
}

/**
 * Preload common API endpoints for faster responses
 */
export function preloadCommonEndpoints(): void {
  const commonEndpoints = [
    '/api/careerguru/stream',
    '/api/profile',
    '/api/insights'
  ];

  commonEndpoints.forEach(endpoint => {
    // Warm up connections
    optimizedFetch(endpoint, { 
      method: 'OPTIONS',
      priority: 'low'
    }).catch(() => {
      // Ignore preload errors
    });
  });
}

/**
 * Smart retry with exponential backoff
 */
export async function smartRetry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}