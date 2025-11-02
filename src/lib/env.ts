/**
 * Environment configuration entry point
 * This file should be imported early in the application lifecycle
 */

// Import and validate environment variables
export * from './env-validation';

// Re-export for convenience
export { env, isProduction, isDevelopment, getBaseUrl, getApiConfig, getMonitoringConfig } from './env-validation';