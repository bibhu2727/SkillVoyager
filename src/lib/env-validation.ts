/**
 * Production-grade environment variable validation
 * Ensures all required environment variables are present and valid
 */

import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Firebase configuration (required for production)
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API key is required'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase auth domain is required'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase project ID is required'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase storage bucket is required'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase messaging sender ID is required'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase app ID is required'),
  
  // Google AI configuration
  GOOGLE_AI_API_KEY: z.string().min(1, 'Google AI API key is required'),
  GENKIT_ENV: z.enum(['dev', 'prod']).default('prod'),
  
  // NextAuth configuration
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('NextAuth URL must be a valid URL'),
  
  // Vercel configuration (optional, auto-populated by Vercel)
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
  VERCEL_REGION: z.string().optional(),
  
  // Analytics (optional)
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ID: z.string().optional(),
  
  // Security configuration
  ENCRYPTION_KEY: z.string().length(32, 'Encryption key must be exactly 32 characters'),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  CORS_ORIGIN: z.string().url('CORS origin must be a valid URL').optional(),
  
  // API configuration
  API_RATE_LIMIT: z.coerce.number().min(1).max(1000).default(100),
  API_TIMEOUT: z.coerce.number().min(1000).max(60000).default(30000),
  MAX_REQUEST_SIZE: z.string().default('10mb'),
  
  // Performance monitoring
  ENABLE_PERFORMANCE_MONITORING: z.coerce.boolean().default(true),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  CACHE_TTL: z.coerce.number().min(60).max(86400).default(3600),
  
  // Telemetry
  NEXT_TELEMETRY_DISABLED: z.coerce.boolean().default(true),
});

export type Env = z.infer<typeof envSchema>;

// Check if we're in build mode (when Next.js is building the app)
const isBuildTime = process.env.NODE_ENV === 'production' && (
  !process.env.VERCEL_URL || 
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.npm_lifecycle_event === 'build' ||
  process.env.npm_lifecycle_event === 'build:vercel'
);

// Validate environment variables
function validateEnv(): Env {
  try {
    // During build time, use more lenient validation
    if (isBuildTime) {
      // Create a minimal environment for build process
      const buildEnv = {
        ...process.env,
        NODE_ENV: 'production',
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'build-placeholder',
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'build-placeholder.firebaseapp.com',
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'build-placeholder',
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'build-placeholder.appspot.com',
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
        NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:build-placeholder',
        GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY || 'build-placeholder-key',
        GENKIT_ENV: 'prod' as const,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'build-placeholder-secret-32-chars-long',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://build-placeholder.vercel.app',
        ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'build-placeholder-32-chars-long!',
        JWT_SECRET: process.env.JWT_SECRET || 'build-placeholder-jwt-secret-32-chars'
      };
      
      return envSchema.parse(buildEnv);
    }
    
    const env = envSchema.parse(process.env);
    
    // Additional production-specific validations (only at runtime, not build time)
    if (env.NODE_ENV === 'production' && !isBuildTime) {
      // Ensure all Firebase config is present in production
      const requiredFirebaseVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID',
      ];
      
      for (const varName of requiredFirebaseVars) {
        const value = process.env[varName];
        if (!value || value.includes('your_') || value.includes('_here') || value.includes('build-placeholder')) {
          throw new Error(`${varName} must be set to a real value in production`);
        }
      }
      
      // Ensure Google AI API key is set
      if (!env.GOOGLE_AI_API_KEY || env.GOOGLE_AI_API_KEY.includes('your_') || env.GOOGLE_AI_API_KEY.includes('build-placeholder')) {
        throw new Error('GOOGLE_AI_API_KEY must be set to a real value in production');
      }
      
      // Ensure NextAuth secret is properly set
      if (!env.NEXTAUTH_SECRET || env.NEXTAUTH_SECRET.includes('your_') || env.NEXTAUTH_SECRET.includes('build-placeholder')) {
        throw new Error('NEXTAUTH_SECRET must be set to a real value in production');
      }
      
      // Ensure encryption key is properly set
      if (!env.ENCRYPTION_KEY || env.ENCRYPTION_KEY.includes('your_') || env.ENCRYPTION_KEY.includes('build-placeholder')) {
        throw new Error('ENCRYPTION_KEY must be set to a real value in production');
      }
    }
    
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        (err) => `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(
        `Environment validation failed:\n${errorMessages.join('\n')}`
      );
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// Helper function to check if we're in production
export const isProduction = env.NODE_ENV === 'production';

// Helper function to check if we're in development
export const isDevelopment = env.NODE_ENV === 'development';

// Helper function to get the base URL
export const getBaseUrl = () => {
  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }
  if (env.NEXTAUTH_URL) {
    return env.NEXTAUTH_URL;
  }
  return isDevelopment ? 'http://localhost:3000' : 'https://localhost:3000';
};

// Helper function to get API configuration
export const getApiConfig = () => ({
  rateLimit: env.API_RATE_LIMIT,
  timeout: env.API_TIMEOUT,
  maxRequestSize: env.MAX_REQUEST_SIZE,
});

// Helper function to get monitoring configuration
export const getMonitoringConfig = () => ({
  enabled: env.ENABLE_PERFORMANCE_MONITORING,
  logLevel: env.LOG_LEVEL,
  cacheTtl: env.CACHE_TTL,
});

// Log environment status (only in development)
if (isDevelopment) {
  console.log('✅ Environment variables validated successfully');
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`🔧 Base URL: ${getBaseUrl()}`);
}