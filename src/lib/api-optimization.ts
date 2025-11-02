/**
 * API Optimization Utilities
 * Handles rate limiting, caching, and request optimization for production
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RequestConfig {
  cacheKey?: string;
  cacheTTL?: number; // Time to live in milliseconds
  retryAttempts?: number;
  retryDelay?: number;
  timeout?: number;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

class APIOptimization {
  private cache = new Map<string, CacheEntry<any>>();
  private rateLimits = new Map<string, RateLimitEntry>();
  private requestQueue = new Map<string, Promise<any>>();
  
  // Default configuration
  private defaultConfig: Required<RequestConfig> = {
    cacheKey: '',
    cacheTTL: 5 * 60 * 1000, // 5 minutes
    retryAttempts: 3,
    retryDelay: 1000,
    timeout: 30000, // 30 seconds
    rateLimit: {
      maxRequests: 100,
      windowMs: 60000 // 1 minute
    }
  };

  constructor() {
    // Clean up expired cache entries every 5 minutes
    setInterval(() => {
      this.cleanupCache();
    }, 5 * 60 * 1000);

    // Clean up expired rate limit entries every minute
    setInterval(() => {
      this.cleanupRateLimits();
    }, 60 * 1000);
  }

  /**
   * Optimized fetch with caching, rate limiting, and retry logic
   */
  async optimizedFetch<T>(
    url: string,
    options: RequestInit = {},
    config: Partial<RequestConfig> = {}
  ): Promise<T> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const cacheKey = finalConfig.cacheKey || this.generateCacheKey(url, options);

    // Check cache first
    if (this.isGetRequest(options) && finalConfig.cacheTTL > 0) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Check rate limiting
    if (finalConfig.rateLimit) {
      const rateLimitKey = this.getRateLimitKey(url);
      if (this.isRateLimited(rateLimitKey, finalConfig.rateLimit)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
    }

    // Check if request is already in progress (deduplication)
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey);
    }

    // Create the request promise
    const requestPromise = this.executeRequest<T>(url, options, finalConfig);
    
    // Store in queue for deduplication
    this.requestQueue.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      
      // Cache successful GET requests
      if (this.isGetRequest(options) && finalConfig.cacheTTL > 0) {
        this.setCache(cacheKey, result, finalConfig.cacheTTL);
      }

      return result;
    } finally {
      // Remove from queue
      this.requestQueue.delete(cacheKey);
    }
  }

  private async executeRequest<T>(
    url: string,
    options: RequestInit,
    config: Required<RequestConfig>
  ): Promise<T> {
    let lastError: Error = new Error('Request failed after all retry attempts');

    for (let attempt = 0; attempt <= config.retryAttempts; attempt++) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (this.isNonRetryableError(error as Error)) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === config.retryAttempts) {
          break;
        }

        // Wait before retry with exponential backoff
        const delay = config.retryDelay * Math.pow(2, attempt);
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  private isNonRetryableError(error: Error): boolean {
    // Don't retry on client errors (4xx) or abort errors
    return error.message.includes('HTTP 4') || 
           error.name === 'AbortError' ||
           error.message.includes('Rate limit exceeded');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateCacheKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  private getRateLimitKey(url: string): string {
    // Extract base URL for rate limiting
    try {
      const urlObj = new URL(url);
      return `${urlObj.origin}${urlObj.pathname}`;
    } catch {
      return url;
    }
  }

  private isGetRequest(options: RequestInit): boolean {
    return !options.method || options.method.toUpperCase() === 'GET';
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    };
    this.cache.set(key, entry);
  }

  private isRateLimited(key: string, config: { maxRequests: number; windowMs: number }): boolean {
    const now = Date.now();
    const entry = this.rateLimits.get(key);

    if (!entry) {
      this.rateLimits.set(key, { count: 1, resetTime: now + config.windowMs });
      return false;
    }

    if (now > entry.resetTime) {
      this.rateLimits.set(key, { count: 1, resetTime: now + config.windowMs });
      return false;
    }

    if (entry.count >= config.maxRequests) {
      return true;
    }

    entry.count++;
    return false;
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  private cleanupRateLimits(): void {
    const now = Date.now();
    for (const [key, entry] of this.rateLimits.entries()) {
      if (now > entry.resetTime) {
        this.rateLimits.delete(key);
      }
    }
  }

  /**
   * Clear cache for specific key or all cache
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; hitRate: number } {
    // This is a simplified implementation
    // In production, you'd want to track hits/misses properly
    return {
      size: this.cache.size,
      hitRate: 0 // Would need proper tracking
    };
  }

  /**
   * Preload data into cache
   */
  async preloadCache<T>(
    url: string,
    options: RequestInit = {},
    config: Partial<RequestConfig> = {}
  ): Promise<void> {
    try {
      await this.optimizedFetch<T>(url, options, config);
    } catch (error) {
      // Silently fail preloading
      console.warn('Failed to preload cache for:', url, error);
    }
  }
}

// Create singleton instance
export const apiOptimization = new APIOptimization();

// Convenience functions for common use cases
export async function cachedFetch<T>(
  url: string,
  options: RequestInit = {},
  cacheTTL: number = 5 * 60 * 1000
): Promise<T> {
  return apiOptimization.optimizedFetch<T>(url, options, { cacheTTL });
}

export async function rateLimitedFetch<T>(
  url: string,
  options: RequestInit = {},
  rateLimit: { maxRequests: number; windowMs: number } = { maxRequests: 10, windowMs: 60000 }
): Promise<T> {
  return apiOptimization.optimizedFetch<T>(url, options, { rateLimit });
}

// AI service specific optimizations
export class AIServiceOptimizer {
  private static instance: AIServiceOptimizer;
  
  static getInstance(): AIServiceOptimizer {
    if (!AIServiceOptimizer.instance) {
      AIServiceOptimizer.instance = new AIServiceOptimizer();
    }
    return AIServiceOptimizer.instance;
  }

  async optimizedAIRequest<T>(
    endpoint: string,
    payload: any,
    options: {
      provider: 'openai' | 'anthropic' | 'google';
      cacheable?: boolean;
      priority?: 'high' | 'normal' | 'low';
    }
  ): Promise<T> {
    const config: Partial<RequestConfig> = {
      retryAttempts: 2,
      retryDelay: 2000,
      timeout: 60000, // 1 minute for AI requests
      rateLimit: this.getProviderRateLimit(options.provider)
    };

    // Cache certain AI requests (like interview questions)
    if (options.cacheable) {
      config.cacheTTL = 30 * 60 * 1000; // 30 minutes
      config.cacheKey = `ai:${options.provider}:${JSON.stringify(payload)}`;
    }

    return apiOptimization.optimizedFetch<T>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }, config);
  }

  private getProviderRateLimit(provider: string): { maxRequests: number; windowMs: number } {
    switch (provider) {
      case 'openai':
        return { maxRequests: 50, windowMs: 60000 }; // 50 requests per minute
      case 'anthropic':
        return { maxRequests: 30, windowMs: 60000 }; // 30 requests per minute
      case 'google':
        return { maxRequests: 60, windowMs: 60000 }; // 60 requests per minute
      default:
        return { maxRequests: 20, windowMs: 60000 }; // Conservative default
    }
  }
}

export const aiServiceOptimizer = AIServiceOptimizer.getInstance();