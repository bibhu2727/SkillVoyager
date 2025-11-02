# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Configuration Files
- [x] **vercel.json** - Updated with production-ready settings
- [x] **next.config.js** - Optimized for production performance
- [x] **.env.production.example** - Template for production environment variables
- [x] **package.json** - Build scripts configured

### 2. Security Configuration
- [x] **Permissions Policy** - Fixed to allow camera=(self), microphone=(self)
- [x] **CORS Headers** - Configured for production domain
- [x] **Security Headers** - CSP, XSS protection, frame options
- [x] **HTTPS Enforcement** - Automatic on Vercel

### 3. Performance Optimizations
- [x] **Bundle Analysis** - Available via npm run build:analyze
- [x] **Code Splitting** - Automatic by Next.js routes
- [x] **Image Optimization** - Next.js Image component configured
- [x] **Caching Headers** - Static assets cached for 1 year
- [x] **Compression** - Enabled in next.config.js

### 4. Environment Variables Setup
- [ ] **Firebase Configuration** - Set in Vercel dashboard
- [ ] **Google AI API Key** - Set in Vercel dashboard
- [ ] **NextAuth Configuration** - Set in Vercel dashboard
- [ ] **Security Keys** - Set in Vercel dashboard

## 🚀 Deployment Commands

### Local Testing
```bash
# Test TypeScript compilation
npm run typecheck

# Run linting
npm run lint

# Test production build
npm run build:vercel

# Test production server locally
npm run start

# Analyze bundle size
npm run build:analyze
```

### Vercel Deployment
```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add GOOGLE_AI_API_KEY
vercel env add NEXTAUTH_SECRET
vercel env add ENCRYPTION_KEY
vercel env add JWT_SECRET
```

## 🔧 Environment Variables Configuration

### Required Variables
1. **NEXT_PUBLIC_FIREBASE_API_KEY**
2. **NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN**
3. **NEXT_PUBLIC_FIREBASE_PROJECT_ID**
4. **NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET**
5. **NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID**
6. **NEXT_PUBLIC_FIREBASE_APP_ID**
7. **GOOGLE_AI_API_KEY**
8. **NEXTAUTH_SECRET**
9. **NEXTAUTH_URL**
10. **ENCRYPTION_KEY**
11. **JWT_SECRET**

### Setting Variables in Vercel
```bash
# Via CLI
vercel env add VARIABLE_NAME

# Via Dashboard
# 1. Go to project settings
# 2. Navigate to Environment Variables
# 3. Add each variable for Production environment
```

## 📊 Performance Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Bundle Size
- **Initial Bundle**: < 200KB gzipped
- **Total JavaScript**: < 1MB
- **Images**: Optimized with Next.js Image

### Lighthouse Scores
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 90
- **SEO**: > 90

## 🧪 Testing Procedures

### 1. Local Build Test
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Test build
npm run build:vercel

# Check for errors
echo $?  # Should return 0 for success
```

### 2. Production Feature Test
- [ ] Homepage loads correctly
- [ ] Authentication flow works
- [ ] Camera/microphone permissions work
- [ ] Interview simulator functions
- [ ] Closed-door interview functions
- [ ] All API routes respond
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### 3. Performance Test
```bash
# Bundle analysis
npm run build:analyze

# Check bundle sizes in .next/analyze/
# Verify no unexpected large bundles
```

## 🔍 Troubleshooting

### Common Build Issues

#### 1. Environment Variable Errors
**Error**: "Environment validation failed"
**Solution**: 
- Check all required variables are set
- Verify variable names match exactly
- Ensure production values are different from development

#### 2. Bundle Size Too Large
**Error**: Build succeeds but performance is poor
**Solution**:
- Run `npm run build:analyze`
- Identify large dependencies
- Implement dynamic imports for heavy components
- Optimize images and assets

#### 3. Camera/Microphone Not Working
**Error**: "Permission denied" in production
**Solution**:
- Verify Permissions-Policy header allows camera=(self), microphone=(self)
- Ensure HTTPS is enabled (automatic on Vercel)
- Check browser permissions are granted

#### 4. API Routes Failing
**Error**: 500 errors on API routes
**Solution**:
- Check environment variables are set
- Verify serverless function timeout (max 30s on Hobby plan)
- Check logs in Vercel dashboard

### Debugging Commands
```bash
# Check Vercel logs
vercel logs

# Check environment variables
vercel env ls

# Check deployment status
vercel ls

# Check domain configuration
vercel domains ls
```

## 📈 Post-Deployment Monitoring

### 1. Analytics Setup
- [x] **Vercel Analytics** - Integrated in layout.tsx
- [x] **Speed Insights** - Integrated in layout.tsx
- [ ] **Custom Events** - Track user interactions

### 2. Performance Monitoring
- Monitor Core Web Vitals in Vercel dashboard
- Set up alerts for performance degradation
- Regular lighthouse audits

### 3. Error Monitoring
- Check Vercel function logs regularly
- Monitor error rates in analytics
- Set up error boundary reporting

## 🔄 Continuous Deployment

### GitHub Integration
1. Connect repository to Vercel
2. Enable automatic deployments
3. Set up preview deployments for PRs
4. Configure production branch (main/master)

### Deployment Workflow
```yaml
# Example GitHub Action (optional)
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🎯 Success Criteria

### Deployment Success
- [ ] Build completes without errors
- [ ] All pages load correctly
- [ ] Camera/microphone access works
- [ ] Performance scores meet targets
- [ ] Security headers are present
- [ ] Analytics tracking works

### User Experience
- [ ] Fast page loads (< 3s)
- [ ] Smooth interactions
- [ ] Mobile-friendly interface
- [ ] Cross-browser compatibility
- [ ] Accessible design

### Technical Performance
- [ ] Core Web Vitals in green
- [ ] Bundle size optimized
- [ ] API responses fast (< 1s)
- [ ] Error rate < 1%
- [ ] Uptime > 99.9%