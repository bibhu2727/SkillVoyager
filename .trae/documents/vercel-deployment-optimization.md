# Vercel Deployment Optimization Guide

## 1. Production Configuration

### 1.1 Environment Variables Setup

```bash
# Production Environment Variables (.env.production)

# Firebase Configuration (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=skillvoyager-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=skillvoyager-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=skillvoyager-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Google AI Configuration
GOOGLE_AI_API_KEY=AIzaSyD...
GENKIT_ENV=prod

# Vercel Configuration
VERCEL_URL=skillvoyager.vercel.app
VERCEL_ENV=production
VERCEL_REGION=iad1

# Security
NEXTAUTH_SECRET=super-secure-32-char-secret-key
NEXTAUTH_URL=https://skillvoyager.vercel.app
ENCRYPTION_KEY=32-character-encryption-key-here
JWT_SECRET=jwt-secret-for-token-signing

# Performance
API_RATE_LIMIT=1000
API_TIMEOUT=30000
MAX_REQUEST_SIZE=50mb
CACHE_TTL=3600

# Monitoring
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=prj_analytics_id
NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ID=prj_speed_id
ENABLE_PERFORMANCE_MONITORING=true
LOG_LEVEL=warn
```

### 1.2 Vercel Configuration (vercel.json)

```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build:production",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "devCommand": "npm run dev",
  "regions": ["iad1", "sfo1", "lhr1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    },
    "src/ai/**/*.ts": {
      "maxDuration": 60
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=self, microphone=self, geolocation=(), payment=()"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://skillvoyager.vercel.app"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/analytics/:path*",
      "destination": "https://vitals.vercel-analytics.com/:path*"
    }
  ],
  "redirects": [
    {
      "source": "/interview",
      "destination": "/closed-door-interview",
      "permanent": true
    }
  ]
}
```

## 2. Performance Optimizations

### 2.1 Code Splitting & Lazy Loading

```typescript
// Optimized component loading
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load heavy components
const ClosedDoorSimulator = dynamic(
  () => import('@/components/closed-door-interview/closed-door-simulator'),
  {
    loading: () => <InterviewLoadingSkeleton />,
    ssr: false // Disable SSR for client-side only features
  }
);

const RealTimeTranscript = dynamic(
  () => import('@/components/closed-door-interview/real-time-transcript'),
  {
    loading: () => <TranscriptLoadingSkeleton />,
    ssr: false
  }
);

const AnalysisDashboard = dynamic(
  () => import('@/components/closed-door-interview/analysis-dashboard'),
  {
    loading: () => <AnalysisLoadingSkeleton />,
    ssr: false
  }
);

// Route-based code splitting
export default function ClosedDoorInterviewPage() {
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <InterviewContainer />
    </Suspense>
  );
}
```

### 2.2 Bundle Optimization

```typescript
// next.config.ts - Production optimizations
const nextConfig: NextConfig = {
  // Vercel-specific optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'recharts',
      'date-fns'
    ],
    webVitalsAttribution: ['CLS', 'LCP', 'FID', 'TTFB'],
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    }
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      }
    ]
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  output: 'standalone',
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          ai: {
            test: /[\\/]src[\\/]ai[\\/]/,
            name: 'ai-services',
            chunks: 'all',
          },
          interview: {
            test: /[\\/]src[\\/]components[\\/]closed-door-interview[\\/]/,
            name: 'interview-components',
            chunks: 'all',
          }
        }
      };
    }
    return config;
  }
};
```

### 2.3 Media Processing Optimization

```typescript
// Optimized media recorder configuration
export class OptimizedRecorder {
  private getOptimalRecorderOptions(): MediaRecorderOptions {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return {
      mimeType: this.getSupportedMimeType(),
      videoBitsPerSecond: isProduction ? 1500000 : 2500000, // Lower bitrate in prod
      audioBitsPerSecond: 128000,
      bitsPerSecond: isProduction ? 1628000 : 2628000
    };
  }

  private getSupportedMimeType(): string {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4'
    ];
    
    return types.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';
  }

  // Optimize audio processing for production
  private setupOptimizedAudioAnalysis(stream: MediaStream): void {
    const audioContext = new AudioContext({
      sampleRate: 16000, // Reduced sample rate for production
      latencyHint: 'interactive'
    });
    
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024; // Reduced FFT size for better performance
    analyser.smoothingTimeConstant = 0.8;
    
    // Implement efficient audio processing
    this.processAudioData(analyser);
  }
}
```

## 3. Error Handling & Reliability

### 3.1 Production Error Boundaries

```typescript
// Global error boundary for production
export class ProductionErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to production monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // Send to Vercel Analytics or external service
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(console.error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ProductionErrorFallback 
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}
```

### 3.2 API Error Handling

```typescript
// Production-ready API error handling
export async function handleApiRequest<T>(
  request: () => Promise<T>,
  options: {
    retries?: number;
    timeout?: number;
    fallback?: T;
  } = {}
): Promise<T> {
  const { retries = 3, timeout = 30000, fallback } = options;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const result = await Promise.race([
        request(),
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener('abort', () => {
            reject(new Error('Request timeout'));
          });
        })
      ]);
      
      clearTimeout(timeoutId);
      return result;
      
    } catch (error) {
      console.error(`API request attempt ${attempt} failed:`, error);
      
      if (attempt === retries) {
        if (fallback !== undefined) {
          console.warn('Using fallback value due to API failure');
          return fallback;
        }
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
  
  throw new Error('All retry attempts failed');
}
```

## 4. Security Implementation

### 4.1 Content Security Policy

```typescript
// Enhanced CSP for production
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://vitals.vercel-insights.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://lh3.googleusercontent.com",
      "media-src 'self' blob:",
      "connect-src 'self' https://generativelanguage.googleapis.com https://firestore.googleapis.com https://vitals.vercel-insights.com wss:",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
];
```

### 4.2 Rate Limiting

```typescript
// Production rate limiting
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 h'), // 100 requests per hour
  analytics: true,
});

export async function withRateLimit(
  request: Request,
  handler: () => Promise<Response>
): Promise<Response> {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Rate limit exceeded', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': new Date(reset).toISOString(),
      },
    });
  }

  const response = await handler();
  
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString());
  
  return response;
}
```

## 5. Monitoring & Analytics

### 5.1 Performance Monitoring

```typescript
// Production performance monitoring
export class ProductionMonitor {
  private static instance: ProductionMonitor;
  
  static getInstance(): ProductionMonitor {
    if (!ProductionMonitor.instance) {
      ProductionMonitor.instance = new ProductionMonitor();
    }
    return ProductionMonitor.instance;
  }

  // Track Core Web Vitals
  trackWebVitals(): void {
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(this.sendToAnalytics);
        getFID(this.sendToAnalytics);
        getFCP(this.sendToAnalytics);
        getLCP(this.sendToAnalytics);
        getTTFB(this.sendToAnalytics);
      });
    }
  }

  // Track interview-specific metrics
  trackInterviewMetrics(metrics: {
    sessionDuration: number;
    completionRate: number;
    errorCount: number;
    performanceScore: number;
  }): void {
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...metrics,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        })
      }).catch(console.error);
    }
  }

  private sendToAnalytics = (metric: any): void => {
    if (process.env.NODE_ENV === 'production') {
      // Send to Vercel Analytics
      if (window.va) {
        window.va('track', metric.name, {
          value: metric.value,
          id: metric.id,
          delta: metric.delta
        });
      }
    }
  };
}
```

### 5.2 Error Tracking

```typescript
// Production error tracking
export class ErrorTracker {
  static trackError(error: Error, context?: Record<string, any>): void {
    if (process.env.NODE_ENV === 'production') {
      const errorData = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        context: context || {}
      };

      // Send to monitoring service
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      }).catch(console.error);
    }
  }

  static trackInterviewError(
    phase: 'setup' | 'selection' | 'interview' | 'results',
    error: Error,
    sessionId?: string
  ): void {
    this.trackError(error, {
      interviewPhase: phase,
      sessionId,
      feature: 'closed-door-interview'
    });
  }
}
```

## 6. Deployment Checklist

### 6.1 Pre-deployment Verification

* [ ] All environment variables configured in Vercel dashboard

* [ ] Firebase project configured for production

* [ ] Google AI API keys activated and quota verified

* [ ] Security headers implemented and tested

* [ ] Rate limiting configured and tested

* [ ] Error boundaries implemented across all components

* [ ] Performance monitoring integrated

* [ ] Bundle size optimized (< 500KB initial load)

* [ ] Core Web Vitals targets met (LCP < 2.5s, FID < 100ms, CLS < 0.1)

* [ ] Cross-browser compatibility verified

* [ ] Mobile responsiveness tested

* [ ] Accessibility compliance verified (WCAG 2.1 AA)

### 6.2 Post-deployment Monitoring

* [ ] Monitor error rates and response times

* [ ] Track user engagement and completion rates

* [ ] Monitor API usage and costs

* [ ] Verify security headers are active

* [ ] Check performance metrics regularly

* [ ] Monitor Firebase usage and quotas

* [ ] Track Core Web Vitals in production

* [ ] Verify backup and recovery procedures

