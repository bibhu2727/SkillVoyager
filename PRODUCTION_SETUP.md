# Production Setup Guide

## Environment Variables Configuration

### Required Environment Variables for Vercel Deployment

Set these environment variables in your Vercel dashboard:

#### Core Application Variables
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### API Configuration
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-domain.vercel.app/api
```

#### Firebase Configuration (Required)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

#### Google AI Configuration (Required)
```bash
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

#### Optional AI Services
```bash
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

#### Performance & Analytics
```bash
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
```

#### Feature Flags
```bash
NEXT_PUBLIC_ENABLE_LAZY_LOADING=true
NEXT_PUBLIC_ENABLE_CODE_SPLITTING=true
```

#### Security Settings
```bash
NEXT_PUBLIC_ENABLE_CSP=true
NEXT_PUBLIC_ENABLE_HTTPS_ONLY=true
```

#### Media Configuration
```bash
NEXT_PUBLIC_MAX_RECORDING_DURATION=1800000
NEXT_PUBLIC_AUDIO_SAMPLE_RATE=44100
NEXT_PUBLIC_VIDEO_QUALITY=720p
```

## Deployment Steps

### 1. Build and Test Locally
```bash
npm run build
npm run start
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Configure Environment Variables in Vercel Dashboard
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add all the required environment variables listed above
4. Redeploy the application

### 4. Verify Deployment
- Check that the application loads correctly
- Test all major features (interview simulator, AI interactions)
- Verify analytics and error reporting are working
- Test performance optimizations (lazy loading, code splitting)

## Production Optimizations Included

### Performance
- ✅ Lazy loading for interview components
- ✅ Code splitting and bundle optimization
- ✅ Image optimization with WebP/AVIF support
- ✅ API caching and rate limiting
- ✅ Media compression and streaming

### Security
- ✅ Content Security Policy (CSP) headers
- ✅ Security headers (XSS protection, frame options, etc.)
- ✅ HTTPS-only configuration
- ✅ API rate limiting

### Monitoring
- ✅ Production error boundary with error tracking
- ✅ Performance monitoring and analytics
- ✅ User event tracking
- ✅ Component load time tracking

### Reliability
- ✅ Retry logic for API calls
- ✅ Graceful error handling
- ✅ Fallback UI components
- ✅ Media permission handling

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors: `npm run type-check`
   - Verify all imports are correct
   - Ensure environment variables are properly set

2. **Runtime Errors**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Ensure all required environment variables are set

3. **Performance Issues**
   - Enable bundle analyzer: `ANALYZE=true npm run build`
   - Check network tab for slow requests
   - Verify lazy loading is working correctly

4. **AI Service Errors**
   - Verify API keys are correctly set
   - Check API rate limits
   - Ensure proper error handling is in place

## Monitoring and Analytics

The application includes comprehensive monitoring:

- **Error Tracking**: Automatic error reporting with stack traces
- **Performance Metrics**: Page load times, component render times
- **User Analytics**: User interactions, feature usage
- **API Monitoring**: Request/response times, error rates

All monitoring data is sent to `/api/analytics` endpoint for processing.

## Security Considerations

- All API keys should be set as environment variables, never hardcoded
- Use HTTPS-only in production
- Implement proper CORS policies
- Regular security audits of dependencies
- Monitor for suspicious activity

## Performance Benchmarks

Target metrics for production:
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms
- Time to Interactive (TTI): < 3.5s