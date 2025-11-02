import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trackErrorBoundary } from '@/lib/production-monitoring';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class ProductionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Track error in monitoring system
    trackErrorBoundary(error, errorInfo, errorInfo.componentStack || undefined);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Store error info in state
    this.setState({
      errorInfo
    });

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error);
      console.error('Error Info:', errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  copyErrorDetails = () => {
    const { error, errorInfo, errorId } = this.state;
    const errorDetails = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        alert('Error details copied to clipboard');
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = JSON.stringify(errorDetails, null, 2);
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Error details copied to clipboard');
      });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorId } = this.state;
      const isProduction = process.env.NODE_ENV === 'production';

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-red-800 dark:text-red-200">
                Something went wrong
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center text-gray-600 dark:text-gray-300">
                <p className="mb-2">
                  We're sorry, but something unexpected happened. Our team has been notified.
                </p>
                {errorId && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Error ID: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">{errorId}</code>
                  </p>
                )}
              </div>

              {/* Error details for development or when showDetails is true */}
              {(!isProduction || this.props.showDetails) && error && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Bug className="h-4 w-4" />
                    Error Details
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-red-600 dark:text-red-400 mb-2">
                      {error.name}: {error.message}
                    </div>
                    {error.stack && (
                      <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto text-gray-600 dark:text-gray-400">
                        {error.stack}
                      </pre>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={this.copyErrorDetails}
                    className="w-full"
                  >
                    Copy Error Details
                  </Button>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                
                <Button
                  variant="outline"
                  onClick={this.handleReload}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </Button>
                
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </div>

              {/* Help text */}
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>
                  If this problem persists, please contact support with the error ID above.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simplified error boundary for specific components
export function SimpleErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) {
  return (
    <ProductionErrorBoundary
      fallback={fallback || (
        <div className="flex items-center justify-center p-8 text-center">
          <div className="space-y-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Component Error
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This component encountered an error and couldn't render.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </Button>
          </div>
        </div>
      )}
    >
      {children}
    </ProductionErrorBoundary>
  );
}