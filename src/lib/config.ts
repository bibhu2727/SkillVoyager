/**
 * Application configuration for production deployment
 */

import { env, isProduction, getBaseUrl, getApiConfig, getMonitoringConfig } from './env';

// Application configuration
export const config = {
  // Environment
  env: env.NODE_ENV,
  isProduction,
  baseUrl: getBaseUrl(),
  
  // Firebase configuration
  firebase: {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  
  // Google AI configuration
  googleAI: {
    apiKey: env.GOOGLE_AI_API_KEY,
    environment: env.GENKIT_ENV,
  },
  
  // Authentication configuration
  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL,
    jwtSecret: env.JWT_SECRET,
  },
  
  // Security configuration
  security: {
    encryptionKey: env.ENCRYPTION_KEY,
    corsOrigin: env.CORS_ORIGIN || getBaseUrl(),
  },
  
  // API configuration
  api: getApiConfig(),
  
  // Monitoring configuration
  monitoring: getMonitoringConfig(),
  
  // Analytics configuration
  analytics: {
    vercelAnalyticsId: env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
    speedInsightsId: env.NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ID,
  },
  
  // Interview feature configuration
  interview: {
    maxDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
    maxFileSize: 100 * 1024 * 1024, // 100MB in bytes
    supportedVideoFormats: ['webm', 'mp4'],
    supportedAudioFormats: ['webm', 'mp3', 'wav'],
    transcriptUpdateInterval: 1000, // 1 second
    analysisDebounceTime: 2000, // 2 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
  
  // Performance configuration
  performance: {
    enableServiceWorker: isProduction,
    enableCompression: isProduction,
    enableCaching: isProduction,
    cacheMaxAge: env.CACHE_TTL,
    enableLazyLoading: true,
    enableImageOptimization: true,
  },
  
  // Feature flags
  features: {
    enableRealTimeTranscript: true,
    enableVideoAnalysis: true,
    enablePerformanceMetrics: true,
    enableErrorReporting: isProduction,
    enableDebugMode: !isProduction,
  },
  
  // Vercel configuration
  vercel: {
    url: env.VERCEL_URL,
    environment: env.VERCEL_ENV,
    region: env.VERCEL_REGION,
  },
} as const;

// Type-safe configuration access
export type Config = typeof config;

// Helper functions for common configuration access
export const getFirebaseConfig = () => config.firebase;
export const getGoogleAIConfig = () => config.googleAI;
export const getAuthConfig = () => config.auth;
export const getSecurityConfig = () => config.security;
export const getInterviewConfig = () => config.interview;
export const getPerformanceConfig = () => config.performance;
export const getFeatureFlags = () => config.features;

// Validation helper
export const validateConfig = () => {
  const requiredConfigs = [
    'firebase.apiKey',
    'firebase.projectId',
    'googleAI.apiKey',
    'auth.secret',
  ];
  
  const missingConfigs: string[] = [];
  
  for (const configPath of requiredConfigs) {
    const keys = configPath.split('.');
    let current: any = config;
    
    for (const key of keys) {
      current = current?.[key];
      if (current === undefined || current === null || current === '') {
        missingConfigs.push(configPath);
        break;
      }
    }
  }
  
  if (missingConfigs.length > 0) {
    throw new Error(
      `Missing required configuration: ${missingConfigs.join(', ')}`
    );
  }
  
  return true;
};

// Initialize configuration validation in production only
if (isProduction) {
  try {
    validateConfig();
    console.log('✅ Configuration validated successfully');
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    process.exit(1);
  }
} else {
  console.log('🔧 Development mode: Skipping configuration validation');
}