/**
 * @fileOverview React hook for streaming CareerGuru chat responses
 * Provides real-time streaming functionality with optimized performance
 * Includes advanced optimizations for sub-5-second response times
 */

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { CareerGuruChatInput } from '@/ai/flows/career-guru-chat';
import { StreamingChunk } from '@/lib/streaming-response';
import { optimizedFetch, smartRetry } from '@/lib/request-optimizer';
import { getPreloadedResponse, updateUserContext, getPreloaderStats } from '@/lib/response-preloader';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
  actionItems?: string[];
  mood?: 'supportive' | 'motivational' | 'analytical' | 'friendly' | 'encouraging';
  confidence?: number;
  isStreaming?: boolean;
}

interface StreamingState {
  isStreaming: boolean;
  currentMessage: string;
  error: string | null;
  responseTime: number;
  cacheHit?: boolean;
  optimizationLevel?: 'fast' | 'normal' | 'slow';
  connectionStatus?: 'connected' | 'connecting' | 'disconnected';
}

interface UseStreamingChatReturn {
  messages: Message[];
  streamingState: StreamingState;
  sendMessage: (message: string, userProfile?: any) => Promise<void>;
  isLoading: boolean;
  clearMessages: () => void;
  retryLastMessage: () => Promise<void>;
  performanceStats: {
    averageResponseTime: number;
    cacheHitRate: number;
    totalRequests: number;
    preloaderStats?: any;
  };
}

// Advanced optimization constants
const DEBOUNCE_DELAY = 300; // ms
const MAX_RETRY_ATTEMPTS = 3;
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const FAST_RESPONSE_THRESHOLD = 2000; // 2 seconds
const CONNECTION_TIMEOUT = 8000; // 8 seconds

// Simple in-memory cache for ultra-fast responses
const responseCache = new Map<string, { 
  response: any; 
  timestamp: number; 
  hitCount: number;
}>();

// Performance tracking
let performanceMetrics = {
  totalRequests: 0,
  totalResponseTime: 0,
  cacheHits: 0,
};

export function useStreamingChat(): UseStreamingChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingState, setStreamingState] = useState<StreamingState>({
    isStreaming: false,
    currentMessage: '',
    error: null,
    responseTime: 0,
    cacheHit: false,
    optimizationLevel: 'normal',
    connectionStatus: 'disconnected'
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastInputRef = useRef<{ message: string; userProfile?: any } | null>(null);
  const startTimeRef = useRef<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);

  // Memoized performance stats for better rendering performance
  const performanceStats = useMemo(() => ({
    averageResponseTime: performanceMetrics.totalRequests > 0 
      ? performanceMetrics.totalResponseTime / performanceMetrics.totalRequests 
      : 0,
    cacheHitRate: performanceMetrics.totalRequests > 0 
      ? (performanceMetrics.cacheHits / performanceMetrics.totalRequests) * 100 
      : 0,
    totalRequests: performanceMetrics.totalRequests,
    preloaderStats: getPreloaderStats()
  }), [performanceMetrics.totalRequests, performanceMetrics.totalResponseTime, performanceMetrics.cacheHits]);

  // Cache cleanup effect
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of responseCache.entries()) {
        if (now - value.timestamp > CACHE_EXPIRY) {
          responseCache.delete(key);
        }
      }
    }, 60000); // Clean every minute

    return () => clearInterval(cleanup);
  }, []);

  // Generate cache key for requests
  const generateCacheKey = useCallback((message: string, userProfile?: any): string => {
    const profileKey = userProfile ? JSON.stringify(userProfile) : 'anonymous';
    return `${message.toLowerCase().trim()}_${profileKey}`;
  }, []);

  // Check cache for existing responses
  const checkCache = useCallback((cacheKey: string) => {
    const cached = responseCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_EXPIRY) {
      cached.hitCount++;
      return cached.response;
    }
    return null;
  }, []);

  // Store response in cache
  const cacheResponse = useCallback((cacheKey: string, response: any) => {
    responseCache.set(cacheKey, {
      response,
      timestamp: Date.now(),
      hitCount: 1
    });
  }, []);

  const sendMessage = useCallback(async (message: string, userProfile?: any) => {
    if (!message.trim() || isLoading) return;

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Check for preloaded response first (instant delivery)
    const preloadedResponse = getPreloadedResponse(message);
    if (preloadedResponse) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage, preloadedResponse]);
      setStreamingState(prev => ({ 
        ...prev, 
        isStreaming: false, 
        cacheHit: true,
        connectionStatus: 'connected',
        optimizationLevel: 'fast'
      }));
      
      // Update performance metrics for preloaded response
      performanceMetrics.totalRequests++;
      performanceMetrics.cacheHits++;
      performanceMetrics.totalResponseTime += 50; // Preloaded responses are ~50ms
      
      // Update user context for better future predictions
      updateUserContext(message, preloadedResponse.content);
      
      setIsLoading(false);
      return;
    }

    // Store for retry functionality
    lastInputRef.current = { message, userProfile };
    startTimeRef.current = performance.now();
    retryCountRef.current = 0;

    // Generate cache key and check for cached response
    const cacheKey = generateCacheKey(message, userProfile);
    const cachedResponse = checkCache(cacheKey);

    // Update connection status
    setStreamingState(prev => ({
      ...prev,
      connectionStatus: 'connecting',
      cacheHit: !!cachedResponse
    }));

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // If we have a cached response, use it immediately
    if (cachedResponse) {
      performanceMetrics.cacheHits++;
      performanceMetrics.totalRequests++;
      
      const responseTime = performance.now() - startTimeRef.current;
      performanceMetrics.totalResponseTime += responseTime;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cachedResponse.content,
        timestamp: new Date().toISOString(),
        suggestions: cachedResponse.suggestions,
        actionItems: cachedResponse.actionItems,
        mood: cachedResponse.mood,
        confidence: cachedResponse.confidence
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingState({
        isStreaming: false,
        currentMessage: cachedResponse.content,
        error: null,
        responseTime,
        cacheHit: true,
        optimizationLevel: 'fast',
        connectionStatus: 'connected'
      });
      setIsLoading(false);
      return;
    }

    // Proceed with API call for new responses
    setStreamingState(prev => ({
      ...prev,
      isStreaming: true,
      currentMessage: '',
      error: null,
      responseTime: 0,
      cacheHit: false,
      optimizationLevel: 'normal'
    }));

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      performanceMetrics.totalRequests++;

      const input: CareerGuruChatInput = {
        message,
        userProfile,
        conversationHistory: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        }))
      };

      // Add timeout to the fetch request
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, CONNECTION_TIMEOUT);

      // Use optimized fetch with connection pooling
      const response = await optimizedFetch('/api/careerguru/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
        signal: abortControllerRef.current.signal,
        priority: 'high' // High priority for chat responses
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      setStreamingState(prev => ({
        ...prev,
        connectionStatus: 'connected'
      }));

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream available');
      }

      const decoder = new TextDecoder();
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: true
      };

      // Add streaming message placeholder
      setMessages(prev => [...prev, assistantMessage]);

      let buffer = '';
      let completeResponse = { content: '', suggestions: [] as string[], actionItems: [] as string[], mood: '', confidence: 0 };
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const chunk: StreamingChunk = JSON.parse(line.slice(6));
              
              switch (chunk.type) {
                case 'start':
                  setStreamingState(prev => ({
                    ...prev,
                    isStreaming: true,
                    currentMessage: ''
                  }));
                  break;

                case 'content':
                  if (chunk.content) {
                    assistantMessage.content += chunk.content;
                    completeResponse.content = assistantMessage.content;
                    
                    setMessages(prev => 
                      prev.map(msg => 
                        msg.id === assistantMessage.id 
                          ? { ...msg, content: assistantMessage.content }
                          : msg
                      )
                    );
                    setStreamingState(prev => ({
                      ...prev,
                      currentMessage: assistantMessage.content
                    }));
                  }
                  break;

                case 'suggestions':
                  if (chunk.suggestions) {
                    assistantMessage.suggestions = chunk.suggestions as string[];
                    completeResponse.suggestions = (chunk.suggestions as string[]) || [];
                    
                    setMessages(prev => 
                      prev.map(msg => 
                        msg.id === assistantMessage.id 
                          ? { ...msg, suggestions: chunk.suggestions as string[] }
                          : msg
                      )
                    );
                  }
                  break;

                case 'actionItems':
                  if (chunk.actionItems) {
                    assistantMessage.actionItems = chunk.actionItems as string[];
                    completeResponse.actionItems = chunk.actionItems as string[];
                    
                    setMessages(prev => 
                      prev.map(msg => 
                        msg.id === assistantMessage.id 
                          ? { ...msg, actionItems: chunk.actionItems as string[] }
                          : msg
                      )
                    );
                  }
                  break;

                case 'complete':
                  assistantMessage.mood = chunk.mood as any;
                  assistantMessage.confidence = chunk.confidence;
                  assistantMessage.isStreaming = false;
                  
                  completeResponse.mood = chunk.mood || '';
                  completeResponse.confidence = chunk.confidence || 0;
                  
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === assistantMessage.id 
                        ? { 
                            ...msg, 
                            mood: chunk.mood as any,
                            confidence: chunk.confidence,
                            isStreaming: false
                          }
                        : msg
                    )
                  );

                  const responseTime = performance.now() - startTimeRef.current;
                  performanceMetrics.totalResponseTime += responseTime;
                  
                  // Update user context for better future predictions
                  updateUserContext(message, assistantMessage.content);

        // Cache the response for future use
                  cacheResponse(cacheKey, completeResponse);
                  
                  const optimizationLevel = responseTime < FAST_RESPONSE_THRESHOLD ? 'fast' : 
                                          responseTime < 5000 ? 'normal' : 'slow';

                  setStreamingState({
                    isStreaming: false,
                    currentMessage: assistantMessage.content,
                    error: null,
                    responseTime,
                    cacheHit: false,
                    optimizationLevel,
                    connectionStatus: 'connected'
                  });
                  break;

                case 'error':
                  throw new Error(chunk.error || 'Streaming error occurred');
              }
            } catch (parseError) {
              console.warn('Failed to parse streaming chunk:', parseError);
            }
          }
        }
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was cancelled
      }

      console.error('Streaming error:', error);
      
      // Retry logic for failed requests with smart retry
      if (retryCountRef.current < MAX_RETRY_ATTEMPTS) {
        retryCountRef.current++;
        console.log(`Retrying request (attempt ${retryCountRef.current}/${MAX_RETRY_ATTEMPTS})`);
        
        // Use smart retry with exponential backoff
        try {
          await smartRetry(
            () => sendMessage(message, userProfile),
            MAX_RETRY_ATTEMPTS - retryCountRef.current + 1,
            1000
          );
          return;
        } catch (retryError) {
          console.error('All retry attempts failed:', retryError);
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble right now. Could you try asking me again? 🤖",
        timestamp: new Date().toISOString(),
        mood: 'supportive',
        confidence: 0.5
      };

      setMessages(prev => {
        // Remove streaming message if it exists
        const filtered = prev.filter(msg => !msg.isStreaming);
        return [...filtered, errorMessage];
      });

      const responseTime = performance.now() - startTimeRef.current;
      performanceMetrics.totalResponseTime += responseTime;

      setStreamingState({
        isStreaming: false,
        currentMessage: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
        cacheHit: false,
        optimizationLevel: 'slow',
        connectionStatus: 'disconnected'
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, generateCacheKey, checkCache, cacheResponse]);

  const retryLastMessage = useCallback(async () => {
    if (!lastInputRef.current) return;
    
    // Remove the last assistant message if it was an error
    setMessages(prev => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg?.role === 'assistant' && streamingState.error) {
        return prev.slice(0, -1);
      }
      return prev;
    });

    await sendMessage(lastInputRef.current.message, lastInputRef.current.userProfile);
  }, [sendMessage, streamingState.error]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStreamingState({
      isStreaming: false,
      currentMessage: '',
      error: null,
      responseTime: 0
    });
    lastInputRef.current = null;
  }, []);

  return {
    messages,
    streamingState,
    sendMessage,
    isLoading,
    clearMessages,
    retryLastMessage,
    performanceStats
  };
}