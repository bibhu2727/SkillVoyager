import React, { Suspense, ComponentType, lazy } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { interviewLogger } from '@/lib/logger';

// Loading fallback component
export const LoadingFallback: React.FC<{ 
  message?: string; 
  height?: string;
  showSpinner?: boolean;
}> = ({ 
  message = 'Loading component...', 
  height = 'h-64',
  showSpinner = true 
}) => (
  <Card className={`w-full ${height} flex items-center justify-center`}>
    <CardContent className="flex flex-col items-center gap-3 p-6">
      {showSpinner && (
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      )}
      <p className="text-sm text-gray-600 text-center">{message}</p>
    </CardContent>
  </Card>
);

// Error boundary for lazy loaded components
interface LazyErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class LazyErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error; retry: () => void }> }>,
  LazyErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error; retry: () => void }> }>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): LazyErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    interviewLogger.error('Lazy loading error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

// Default error fallback
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <Card className="w-full h-64 flex items-center justify-center border-red-200">
    <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-red-500" />
      </div>
      <div>
        <h3 className="font-medium text-red-800 mb-1">Failed to load component</h3>
        <p className="text-sm text-red-600 mb-3">{error.message}</p>
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    </CardContent>
  </Card>
);

// Enhanced lazy loading wrapper with retry logic
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    fallback?: React.ComponentType;
    errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
    loadingMessage?: string;
    height?: string;
    retryAttempts?: number;
  } = {}
): React.ComponentType<React.ComponentProps<T>> {
  const {
    fallback,
    errorFallback,
    loadingMessage = 'Loading...',
    height = 'h-64',
    retryAttempts = 3
  } = options;

  // Create lazy component with retry logic
  let retryCount = 0;
  const createLazyWithRetry = (): React.LazyExoticComponent<T> => {
    return lazy(async () => {
      try {
        const module = await importFn();
        retryCount = 0; // Reset on success
        return module;
      } catch (error) {
        retryCount++;
        interviewLogger.error(`Lazy loading failed (attempt ${retryCount})`, {
          error: error instanceof Error ? error.message : String(error),
          retryCount,
        });

        if (retryCount < retryAttempts) {
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
          throw error; // Let React retry
        }

        throw new Error(`Failed to load component after ${retryAttempts} attempts`);
      }
    });
  };

  const LazyComponent = createLazyWithRetry();

  return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
    <LazyErrorBoundary fallback={errorFallback}>
      <Suspense 
        fallback={
          fallback ? (
            React.createElement(fallback, { ...props })
          ) : (
            <LoadingFallback 
              message={loadingMessage} 
              height={height}
            />
          )
        }
      >
      </Suspense>
    </LazyErrorBoundary>
  ));
}

// Preload utility for critical components
export const preloadComponent = (importFn: () => Promise<any>): void => {
  // Preload on idle or after a short delay
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      importFn().catch(error => {
        interviewLogger.error('Component preload failed', { error: error.message });
      });
    });
  } else {
    setTimeout(() => {
      importFn().catch(error => {
        interviewLogger.error('Component preload failed', { error: error.message });
      });
    }, 100);
  }
};

// Hook for component visibility-based loading
export const useIntersectionLoader = (
  importFn: () => Promise<any>,
  options: IntersectionObserverInit = {}
) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsVisible(true);
          importFn()
            .then(() => setIsLoaded(true))
            .catch(error => {
              interviewLogger.error('Intersection-based loading failed', { error: error.message });
            });
        }
      },
      { threshold: 0.1, ...options }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [importFn, isLoaded, options]);

  return { ref, isVisible, isLoaded };
};