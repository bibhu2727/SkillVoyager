/**
 * Production-grade environment variable validation
 * Ensures all required environment variables are present and valid
 */

import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Firebase configuration (optional in development, required for production)
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().default('dev-firebase-api-key'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().default('dev-project.firebaseapp.com'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().default('dev-project'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().default('dev-project.appspot.com'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().default('123456789'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().default('1:123456789:web:dev-app-id'),
  
  // Google AI configuration (optional in development)
  GOOGLE_AI_API_KEY: z.string().default('dev-google-ai-key'),
  GENKIT_ENV: z.enum(['dev', 'prod']).default('dev'),
  
  // NextAuth configuration (optional in development)
  NEXTAUTH_SECRET: z.string().default('dev-nextauth-secret-32-chars-long'),
  NEXTAUTH_URL: z.string().default('http://localhost:9002'),
  
  // Vercel configuration (optional, auto-populated by Vercel)
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
  VERCEL_REGION: z.string().optional(),
  
  // Analytics (optional)
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ID: z.string().optional(),
  
  // Security configuration (optional in development)
  ENCRYPTION_KEY: z.string().default('dev-encryption-key-32-chars-lng'),
  JWT_SECRET: z.string().default('dev-jwt-secret-32-chars-long-key'),
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
    // Parse environment variables with defaults
    const env = envSchema.parse(process.env);
    
    // In development mode, always use defaults and skip strict validation
    if (env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: Using default environment values');
      return env;
    }
    
    // Only enforce strict validation in production
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
        if (!value || value.includes('dev-') || value.includes('your_') || value.includes('_here') || value.includes('build-placeholder')) {
          throw new Error(`${varName} must be set to a real value in production`);
        }
      }
      
      // Ensure Google AI API key is set
      if (!env.GOOGLE_AI_API_KEY || env.GOOGLE_AI_API_KEY.includes('dev-') || env.GOOGLE_AI_API_KEY.includes('your_') || env.GOOGLE_AI_API_KEY.includes('build-placeholder')) {
        throw new Error('GOOGLE_AI_API_KEY must be set to a real value in production');
      }
      
      // Ensure NextAuth secret is properly set
      if (!env.NEXTAUTH_SECRET || env.NEXTAUTH_SECRET.includes('dev-') || env.NEXTAUTH_SECRET.includes('your_') || env.NEXTAUTH_SECRET.includes('build-placeholder')) {
        throw new Error('NEXTAUTH_SECRET must be set to a real value in production');
      }
      
      // Ensure encryption key is properly set
      if (!env.ENCRYPTION_KEY || env.ENCRYPTION_KEY.includes('dev-') || env.ENCRYPTION_KEY.includes('your_') || env.ENCRYPTION_KEY.includes('build-placeholder')) {
        throw new Error('ENCRYPTION_KEY must be set to a real value in production');
      }
      
      // Validate key lengths in production
      if (env.ENCRYPTION_KEY.length !== 32) {
        throw new Error('ENCRYPTION_KEY must be exactly 32 characters in production');
      }
      
      if (env.JWT_SECRET.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters in production');
      }
      
      if (env.NEXTAUTH_SECRET.length < 32) {
        throw new Error('NEXTAUTH_SECRET must be at least 32 characters in production');
      }
    }
    
    return env;
  } catch (error) {
    // In development, if validation fails, just use defaults and warn
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Environment validation failed in development, using defaults:', (error as Error).message);
      return envSchema.parse({});
    }
    
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