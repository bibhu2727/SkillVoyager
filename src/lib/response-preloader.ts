/**
 * @fileOverview Response preloader for CareerGuru chat
 * Anticipates common queries and pre-generates responses for instant delivery
 * Implements intelligent prediction and background processing
 */

interface PreloadedResponse {
  query: string;
  response: any;
  timestamp: number;
  confidence: number;
  hitCount: number;
}

interface UserContext {
  profile?: any;
  recentQueries: string[];
  sessionStartTime: number;
  interactionPattern: 'explorer' | 'focused' | 'casual';
}

class ResponsePreloader {
  private preloadedResponses = new Map<string, PreloadedResponse>();
  private userContext: UserContext = {
    recentQueries: [],
    sessionStartTime: Date.now(),
    interactionPattern: 'casual'
  };
  private isPreloading = false;
  private preloadQueue: string[] = [];

  // Common career-related queries that users frequently ask
  private readonly COMMON_QUERIES = [
    "What skills should I learn for AI engineering?",
    "How do I prepare for technical interviews?",
    "What's the best career path for software development?",
    "How can I improve my resume?",
    "What are the highest paying tech jobs?",
    "How do I transition to a tech career?",
    "What programming languages should I learn?",
    "How do I get experience without a job?",
    "What certifications are worth getting?",
    "How do I negotiate salary?",
    "What's the job market like for developers?",
    "How do I build a portfolio?",
    "What soft skills are important?",
    "How do I network effectively?",
    "What's the difference between frontend and backend?"
  ];

  constructor() {
    this.initializePreloading();
  }

  /**
   * Initialize background preloading of common responses
   */
  private async initializePreloading(): Promise<void> {
    // Start preloading common queries in the background
    setTimeout(() => {
      this.preloadCommonQueries();
    }, 2000); // Wait 2 seconds after initialization
  }

  /**
   * Preload responses for common queries
   */
  private async preloadCommonQueries(): Promise<void> {
    if (this.isPreloading) return;
    
    this.isPreloading = true;
    
    for (const query of this.COMMON_QUERIES) {
      try {
        await this.preloadResponse(query);
        // Small delay between preloads to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn(`Failed to preload response for: ${query}`, error);
      }
    }
    
    this.isPreloading = false;
  }

  /**
   * Preload a specific response
   */
  private async preloadResponse(query: string): Promise<void> {
    const cacheKey = this.generateCacheKey(query);
    
    // Skip if already preloaded and fresh
    if (this.preloadedResponses.has(cacheKey)) {
      const existing = this.preloadedResponses.get(cacheKey)!;
      if (Date.now() - existing.timestamp < 10 * 60 * 1000) { // 10 minutes
        return;
      }
    }

    try {
      const response = await fetch('/api/careerguru/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          userProfile: this.userContext.profile,
          conversationHistory: [],
          preload: true // Flag to indicate this is a preload request
        })
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        if (reader) {
          let fullResponse = { content: '', suggestions: [], actionItems: [], mood: '', confidence: 0 };
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const chunk = JSON.parse(line.slice(6));
                  
                  switch (chunk.type) {
                    case 'content':
                      if (chunk.content) {
                        fullResponse.content += chunk.content;
                      }
                      break;
                    case 'suggestions':
                      if (chunk.suggestions) {
                        fullResponse.suggestions = chunk.suggestions;
                      }
                      break;
                    case 'actionItems':
                      if (chunk.actionItems) {
                        fullResponse.actionItems = chunk.actionItems;
                      }
                      break;
                    case 'complete':
                      fullResponse.mood = chunk.mood || '';
                      fullResponse.confidence = chunk.confidence || 0;
                      break;
                  }
                } catch (parseError) {
                  // Ignore parse errors during preloading
                }
              }
            }
          }

          // Store the preloaded response
          this.preloadedResponses.set(cacheKey, {
            query,
            response: fullResponse,
            timestamp: Date.now(),
            confidence: 0.8, // High confidence for preloaded responses
            hitCount: 0
          });
        }
      }
    } catch (error) {
      console.warn(`Preload failed for query: ${query}`, error);
    }
  }

  /**
   * Get preloaded response if available
   */
  getPreloadedResponse(query: string, userProfile?: any): any | null {
    const cacheKey = this.generateCacheKey(query, userProfile);
    const preloaded = this.preloadedResponses.get(cacheKey);
    
    if (preloaded && (Date.now() - preloaded.timestamp) < 15 * 60 * 1000) { // 15 minutes
      preloaded.hitCount++;
      return preloaded.response;
    }
    
    return null;
  }

  /**
   * Update user context for better predictions
   */
  updateUserContext(query: string, userProfile?: any): void {
    this.userContext.profile = userProfile;
    this.userContext.recentQueries.push(query);
    
    // Keep only last 10 queries
    if (this.userContext.recentQueries.length > 10) {
      this.userContext.recentQueries.shift();
    }
    
    // Analyze interaction pattern
    this.analyzeInteractionPattern();
    
    // Predict and preload next likely queries
    this.predictAndPreload(query);
  }

  /**
   * Analyze user interaction pattern
   */
  private analyzeInteractionPattern(): void {
    const queries = this.userContext.recentQueries;
    const sessionDuration = Date.now() - this.userContext.sessionStartTime;
    
    if (queries.length >= 5 && sessionDuration < 5 * 60 * 1000) {
      this.userContext.interactionPattern = 'focused';
    } else if (queries.length >= 3 && sessionDuration < 10 * 60 * 1000) {
      this.userContext.interactionPattern = 'explorer';
    } else {
      this.userContext.interactionPattern = 'casual';
    }
  }

  /**
   * Predict and preload likely next queries
   */
  private predictAndPreload(currentQuery: string): void {
    const predictions = this.predictNextQueries(currentQuery);
    
    // Preload top 3 predictions
    predictions.slice(0, 3).forEach(prediction => {
      if (!this.preloadQueue.includes(prediction)) {
        this.preloadQueue.push(prediction);
      }
    });
    
    // Process preload queue
    this.processPreloadQueue();
  }

  /**
   * Predict next likely queries based on current query
   */
  private predictNextQueries(currentQuery: string): string[] {
    const predictions: string[] = [];
    const lowerQuery = currentQuery.toLowerCase();
    
    // Rule-based predictions
    if (lowerQuery.includes('skill') || lowerQuery.includes('learn')) {
      predictions.push(
        "How long does it take to learn programming?",
        "What's the best way to practice coding?",
        "Should I get a computer science degree?"
      );
    }
    
    if (lowerQuery.includes('interview') || lowerQuery.includes('job')) {
      predictions.push(
        "What questions are asked in technical interviews?",
        "How do I prepare for coding challenges?",
        "What should I wear to an interview?"
      );
    }
    
    if (lowerQuery.includes('career') || lowerQuery.includes('path')) {
      predictions.push(
        "How do I change careers?",
        "What's the job outlook for tech?",
        "Should I specialize or be a generalist?"
      );
    }
    
    if (lowerQuery.includes('salary') || lowerQuery.includes('pay')) {
      predictions.push(
        "How do I negotiate a raise?",
        "What benefits should I ask for?",
        "When is the best time to ask for a promotion?"
      );
    }
    
    return predictions;
  }

  /**
   * Process the preload queue
   */
  private async processPreloadQueue(): Promise<void> {
    if (this.isPreloading || this.preloadQueue.length === 0) return;
    
    const query = this.preloadQueue.shift();
    if (query) {
      await this.preloadResponse(query);
    }
    
    // Continue processing queue
    if (this.preloadQueue.length > 0) {
      setTimeout(() => this.processPreloadQueue(), 1000);
    }
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(query: string, userProfile?: any): string {
    const profileKey = userProfile ? JSON.stringify(userProfile) : 'anonymous';
    return `${query.toLowerCase().trim()}_${profileKey}`;
  }

  /**
   * Get preloader statistics
   */
  getStats() {
    return {
      preloadedCount: this.preloadedResponses.size,
      queueLength: this.preloadQueue.length,
      isPreloading: this.isPreloading,
      userPattern: this.userContext.interactionPattern,
      recentQueries: this.userContext.recentQueries.length
    };
  }

  /**
   * Clear preloaded responses
   */
  clearPreloaded(): void {
    this.preloadedResponses.clear();
    this.preloadQueue = [];
  }
}

// Global instance
export const responsePreloader = new ResponsePreloader();

/**
 * Check for preloaded response
 */
export function getPreloadedResponse(query: string, userProfile?: any): any | null {
  return responsePreloader.getPreloadedResponse(query, userProfile);
}

/**
 * Update user context for better predictions
 */
export function updateUserContext(query: string, userProfile?: any): void {
  responsePreloader.updateUserContext(query, userProfile);
}

/**
 * Get preloader statistics
 */
export function getPreloaderStats() {
  return responsePreloader.getStats();
}