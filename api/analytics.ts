import type { VercelRequest, VercelResponse } from '@vercel/node';

interface AnalyticsData {
  performance: Array<{
    name: string;
    value: number;
    timestamp: number;
    metadata?: Record<string, any>;
  }>;
  errors: Array<{
    message: string;
    stack?: string;
    url: string;
    timestamp: number;
    userAgent: string;
    userId?: string;
    metadata?: Record<string, any>;
  }>;
  events: Array<{
    event: string;
    properties: Record<string, any>;
    timestamp: number;
    userId?: string;
    sessionId: string;
  }>;
  sessionId: string;
  userId?: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data: AnalyticsData = req.body;

    // Validate required fields
    if (!data.sessionId || !data.timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In production, you would send this data to your analytics service
    // For now, we'll just log it (in production, use a proper logging service)
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Data Received:', {
        sessionId: data.sessionId,
        userId: data.userId,
        performanceCount: data.performance.length,
        errorCount: data.errors.length,
        eventCount: data.events.length,
        timestamp: new Date(data.timestamp).toISOString()
      });

      // Log errors for debugging
      if (data.errors.length > 0) {
        console.error('Client Errors:', data.errors);
      }

      // Log performance metrics
      if (data.performance.length > 0) {
        console.log('Performance Metrics:', data.performance);
      }

      // Log user events
      if (data.events.length > 0) {
        console.log('User Events:', data.events);
      }
    }

    // Here you would typically:
    // 1. Send data to analytics service (Google Analytics, Mixpanel, etc.)
    // 2. Store in database for analysis
    // 3. Send errors to error tracking service (Sentry, Bugsnag, etc.)
    // 4. Process performance metrics for monitoring

    // Example integrations (uncomment and configure as needed):
    
    // Send errors to Sentry
    // if (data.errors.length > 0) {
    //   for (const error of data.errors) {
    //     Sentry.captureException(new Error(error.message), {
    //       extra: error.metadata,
    //       user: { id: error.userId },
    //       tags: { sessionId: data.sessionId }
    //     });
    //   }
    // }

    // Send events to analytics service
    // if (data.events.length > 0) {
    //   for (const event of data.events) {
    //     await analytics.track({
    //       userId: event.userId,
    //       event: event.event,
    //       properties: event.properties,
    //       timestamp: new Date(event.timestamp)
    //     });
    //   }
    // }

    // Store performance metrics
    // if (data.performance.length > 0) {
    //   await storePerformanceMetrics(data.performance);
    // }

    return res.status(200).json({ 
      success: true, 
      processed: {
        performance: data.performance.length,
        errors: data.errors.length,
        events: data.events.length
      }
    });

  } catch (error) {
    console.error('Analytics endpoint error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Rate limiting helper (implement as needed)
const rateLimitMap = new Map();

function isRateLimited(sessionId: string): boolean {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 10; // Max 10 requests per minute per session

  if (!rateLimitMap.has(sessionId)) {
    rateLimitMap.set(sessionId, { count: 1, resetTime: now + windowMs });
    return false;
  }

  const limit = rateLimitMap.get(sessionId);
  
  if (now > limit.resetTime) {
    rateLimitMap.set(sessionId, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (limit.count >= maxRequests) {
    return true;
  }

  limit.count++;
  return false;
}