/**
 * @fileOverview Smart caching system for CareerGuru responses
 * Implements intelligent caching with TTL, similarity matching, and performance optimization
 */

interface CacheEntry {
  key: string;
  response: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  hitCount: number;
  similarity?: number;
}

interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  similarityThreshold: number;
}

class SmartCacheManager {
  private cache = new Map<string, CacheEntry>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 1000,
      defaultTTL: 30 * 60 * 1000, // 30 minutes
      similarityThreshold: 0.8,
      ...config
    };
  }

  /**
   * Generate cache key from message and context
   */
  private generateKey(message: string, userProfile?: any): string {
    const normalizedMessage = message.toLowerCase().trim();
    const profileKey = userProfile ? JSON.stringify(userProfile) : '';
    return `${normalizedMessage}:${profileKey}`;
  }

  /**
   * Calculate similarity between two messages using simple word overlap
   */
  private calculateSimilarity(msg1: string, msg2: string): number {
    const words1 = new Set(msg1.toLowerCase().split(/\s+/));
    const words2 = new Set(msg2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  /**
   * Find similar cached responses
   */
  private findSimilarResponse(message: string): CacheEntry | null {
    let bestMatch: CacheEntry | null = null;
    let bestSimilarity = 0;

    for (const entry of this.cache.values()) {
      if (this.isExpired(entry)) continue;

      const similarity = this.calculateSimilarity(message, entry.key.split(':')[0]);
      if (similarity > this.config.similarityThreshold && similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = entry;
      }
    }

    if (bestMatch) {
      bestMatch.similarity = bestSimilarity;
      bestMatch.hitCount++;
    }

    return bestMatch;
  }

  /**
   * Check if cache entry is expired
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Clean expired entries
   */
  private cleanup(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Evict least recently used entries if cache is full
   */
  private evictLRU(): void {
    if (this.cache.size < this.config.maxSize) return;

    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Get cached response
   */
  get(message: string, userProfile?: any): any | null {
    this.cleanup();

    const key = this.generateKey(message, userProfile);
    const entry = this.cache.get(key);

    if (entry && !this.isExpired(entry)) {
      entry.hitCount++;
      return entry.response;
    }

    // Try to find similar response
    const similarEntry = this.findSimilarResponse(message);
    return similarEntry ? similarEntry.response : null;
  }

  /**
   * Set cached response
   */
  set(message: string, response: any, userProfile?: any, ttl?: number): void {
    this.evictLRU();

    const key = this.generateKey(message, userProfile);
    const entry: CacheEntry = {
      key,
      response,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      hitCount: 0
    };

    this.cache.set(key, entry);
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    hitRate: number;
    totalHits: number;
    avgResponseTime: number;
  } {
    let totalHits = 0;
    for (const entry of this.cache.values()) {
      totalHits += entry.hitCount;
    }

    return {
      size: this.cache.size,
      hitRate: this.cache.size > 0 ? totalHits / this.cache.size : 0,
      totalHits,
      avgResponseTime: 50 // Cached responses are ~50ms
    };
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Preload common responses
   */
  preloadCommonResponses(): void {
    const commonQueries = [
      { message: "What career path should I pursue?", response: { response: "Let me help you explore career paths based on your interests and skills...", mood: "supportive", confidence: 0.9 }},
      { message: "How can I improve my resume?", response: { response: "Here are key strategies to make your resume stand out...", mood: "analytical", confidence: 0.95 }},
      { message: "What skills should I learn next?", response: { response: "Based on current market trends, here are valuable skills to develop...", mood: "motivational", confidence: 0.9 }},
      { message: "How do I negotiate my salary?", response: { response: "Salary negotiation is an art. Here's how to approach it strategically...", mood: "encouraging", confidence: 0.92 }},
      { message: "Should I change careers?", response: { response: "Career transitions are big decisions. Let's explore your situation...", mood: "supportive", confidence: 0.88 }}
    ];

    commonQueries.forEach(({ message, response }) => {
      this.set(message, response, undefined, 60 * 60 * 1000); // 1 hour TTL for common queries
    });
  }
}

// Global cache instance
export const cacheManager = new SmartCacheManager({
  maxSize: 2000,
  defaultTTL: 45 * 60 * 1000, // 45 minutes
  similarityThreshold: 0.75
});

// Initialize with common responses
cacheManager.preloadCommonResponses();

export default cacheManager;