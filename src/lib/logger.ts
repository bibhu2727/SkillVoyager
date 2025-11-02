/**
 * Production-grade logging utility
 */

import { env, isProduction } from './env';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

const LOG_LEVEL_MAP: Record<string, LogLevel> = {
  error: LogLevel.ERROR,
  warn: LogLevel.WARN,
  info: LogLevel.INFO,
  debug: LogLevel.DEBUG,
};

class Logger {
  private currentLevel: LogLevel;
  private context: string;

  constructor(context: string = 'App') {
    this.context = context;
    this.currentLevel = LOG_LEVEL_MAP[env.LOG_LEVEL] ?? LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.currentLevel;
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.context}]`;
    
    if (data) {
      return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`;
    }
    
    return `${prefix} ${message}`;
  }

  private logToConsole(level: string, message: string, data?: any) {
    const formattedMessage = this.formatMessage(level, message, data);
    
    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'debug':
        console.debug(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }
  }

  private async logToExternalService(level: string, message: string, data?: any) {
    // In production, you might want to send logs to external services
    // like Sentry, LogRocket, or Vercel Analytics
    if (isProduction && level === 'error') {
      try {
        // Example: Send to external logging service
        // await fetch('/api/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     level,
        //     message,
        //     data,
        //     timestamp: new Date().toISOString(),
        //     context: this.context,
        //     userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        //     url: typeof window !== 'undefined' ? window.location.href : 'server',
        //   }),
        // });
      } catch (error) {
        // Fallback to console if external logging fails
        console.error('Failed to log to external service:', error);
      }
    }
  }

  error(message: string, data?: any) {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.logToConsole('error', message, data);
      this.logToExternalService('error', message, data);
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog(LogLevel.WARN)) {
      this.logToConsole('warn', message, data);
      this.logToExternalService('warn', message, data);
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog(LogLevel.INFO)) {
      this.logToConsole('info', message, data);
      this.logToExternalService('info', message, data);
    }
  }

  debug(message: string, data?: any) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.logToConsole('debug', message, data);
      this.logToExternalService('debug', message, data);
    }
  }

  // Specialized logging methods for common use cases
  apiRequest(method: string, url: string, duration?: number, status?: number) {
    const message = `API ${method} ${url}`;
    const data = { duration, status };
    
    if (status && status >= 400) {
      this.error(message, data);
    } else {
      this.info(message, data);
    }
  }

  performance(metric: string, value: number, unit: string = 'ms') {
    this.info(`Performance: ${metric}`, { value, unit });
  }

  userAction(action: string, userId?: string, metadata?: any) {
    this.info(`User Action: ${action}`, { userId, metadata });
  }

  interviewEvent(event: string, sessionId?: string, metadata?: any) {
    this.info(`Interview Event: ${event}`, { sessionId, metadata });
  }

  securityEvent(event: string, severity: 'low' | 'medium' | 'high', metadata?: any) {
    const message = `Security Event: ${event}`;
    const data = { severity, metadata };
    
    if (severity === 'high') {
      this.error(message, data);
    } else if (severity === 'medium') {
      this.warn(message, data);
    } else {
      this.info(message, data);
    }
  }
}

// Create logger instances for different parts of the application
export const logger = new Logger('App');
export const apiLogger = new Logger('API');
export const interviewLogger = new Logger('Interview');
export const performanceLogger = new Logger('Performance');
export const securityLogger = new Logger('Security');

// Helper function to create context-specific loggers
export const createLogger = (context: string) => new Logger(context);

// Error boundary logging helper
export const logError = (error: Error, context?: string, metadata?: any) => {
  const contextLogger = context ? createLogger(context) : logger;
  contextLogger.error(error.message, {
    stack: error.stack,
    name: error.name,
    metadata,
  });
};

// Performance monitoring helper
export const measurePerformance = async <T>(
  operation: string,
  fn: () => Promise<T> | T,
  context?: string
): Promise<T> => {
  const start = performance.now();
  const contextLogger = context ? createLogger(context) : performanceLogger;
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    contextLogger.performance(operation, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    contextLogger.error(`${operation} failed after ${duration}ms`, error);
    throw error;
  }
};

// Initialize logging in production
if (isProduction) {
  logger.info('Logger initialized', {
    level: env.LOG_LEVEL,
    environment: env.NODE_ENV,
  });
}