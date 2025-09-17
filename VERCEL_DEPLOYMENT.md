# 🚀 SkillVoyager Vercel Deployment Guide

## 📋 Prerequisites

Before deploying to Vercel, ensure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ Vercel account (free tier available)
- ✅ Firebase project setup
- ✅ Google AI API key

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

## 🔧 Environment Configuration

### 1. Copy Environment Template

```bash
cp .env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your actual values:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Google AI Configuration
GOOGLE_AI_API_KEY=your_google_ai_api_key
GENKIT_ENV=prod

# Application Configuration
NODE_ENV=production
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-app.vercel.app

# Vercel Configuration
VERCEL_URL=your-app.vercel.app
SITE_URL=https://your-app.vercel.app
```

## 🚀 Deployment Steps

### Method 1: Vercel CLI (Recommended)

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy to Preview**
   ```bash
   npm run deploy:vercel:preview
   ```

3. **Deploy to Production**
   ```bash
   npm run deploy:vercel
   ```

### Method 2: GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy automatically

## 🔐 Environment Variables Setup in Vercel

### Via Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all variables from `.env.example`

### Via Vercel CLI:
```bash
# Pull environment variables from Vercel
npm run vercel:env

# Or set them manually
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
```

## 🧪 Testing Your Deployment

### 1. Test Production Build Locally

```bash
npm run test:vercel
```

### 2. Check Build Logs

```bash
npm run vercel:logs
```

### 3. Performance Testing

- ✅ Lighthouse score > 90
- ✅ Core Web Vitals optimized
- ✅ Vercel Analytics enabled
- ✅ Speed Insights tracking

## 📊 Monitoring & Analytics

### Vercel Analytics
- Automatically enabled via `@vercel/analytics`
- View metrics in Vercel dashboard
- Track user interactions and performance

### Speed Insights
- Real-time performance monitoring
- Core Web Vitals tracking
- Automatic optimization suggestions

## 🔧 Custom Domain Setup

1. **Add Domain in Vercel**
   ```bash
   npm run vercel:domains
   ```

2. **Configure DNS**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel nameservers

3. **SSL Certificate**
   - Automatically provisioned by Vercel
   - HTTPS enforced by default

## 🛡️ Security Features

### Enabled Security Headers:
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ Referrer-Policy: origin-when-cross-origin
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Permissions-Policy configured

### Performance Optimizations:
- ✅ Static asset caching (1 year)
- ✅ Image optimization
- ✅ Bundle analysis
- ✅ Code splitting
- ✅ Edge functions for API routes

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures**
   ```bash
   # Check TypeScript errors
   npm run typecheck
   
   # Fix linting issues
   npm run lint:fix
   ```

2. **Environment Variables Not Working**
   - Ensure variables start with `NEXT_PUBLIC_` for client-side
   - Redeploy after adding new variables
   - Check Vercel dashboard for proper configuration

3. **API Routes Timeout**
   - Check function timeout settings in `vercel.json`
   - Optimize API response times
   - Use Edge Runtime for faster cold starts

### Debug Commands:

```bash
# View deployment logs
npm run vercel:logs

# Test build locally
npm run build:vercel

# Analyze bundle size
npm run build:analyze
```

## 📈 Performance Optimization

### Automatic Optimizations:
- ✅ Next.js Image Optimization
- ✅ Automatic Static Optimization
- ✅ Edge Caching
- ✅ Compression enabled
- ✅ Tree shaking
- ✅ Code splitting

### Manual Optimizations:
- ✅ Lazy loading components
- ✅ Dynamic imports
- ✅ Optimized images (WebP/AVIF)
- ✅ Minimal bundle size
- ✅ SEO optimized

## 🎯 Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] Authentication works
- [ ] API routes respond properly
- [ ] Environment variables configured
- [ ] Custom domain configured (if applicable)
- [ ] Analytics tracking active
- [ ] Performance metrics > 90
- [ ] Security headers active
- [ ] Sitemap generated
- [ ] Robots.txt configured

## 📞 Support

For deployment issues:
1. Check Vercel documentation
2. Review build logs
3. Test locally first
4. Contact Vercel support if needed

---

**🎉 Congratulations! Your SkillVoyager app is now live on Vercel!**

Visit your deployment at: `https://your-app.vercel.app`