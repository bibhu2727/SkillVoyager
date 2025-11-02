import { createLazyComponent, preloadComponent } from '@/lib/lazy-loading';

// Lazy load the main interview components
export const LazyClosedDoorSimulator = createLazyComponent(
  () => import('@/components/closed-door-interview/closed-door-simulator'),
  {
    loadingMessage: 'Loading interview simulator...',
    height: 'h-96',
    retryAttempts: 3
  }
);

export const LazyRealTimeTranscript = createLazyComponent(
  () => import('@/components/closed-door-interview/real-time-transcript'),
  {
    loadingMessage: 'Loading transcript component...',
    height: 'h-64',
    retryAttempts: 3
  }
);

export const LazyInterviewerSelection = createLazyComponent(
  () => import('@/components/closed-door-interview/interviewer-selection'),
  {
    loadingMessage: 'Loading interviewer selection...',
    height: 'h-80',
    retryAttempts: 3
  }
);



// Preload critical components
export const preloadInterviewComponents = () => {
  // Preload the most commonly used components
  preloadComponent(() => import('@/components/closed-door-interview/closed-door-simulator'));
  preloadComponent(() => import('@/components/closed-door-interview/interviewer-selection'));
  
  // Preload other components with delay
  setTimeout(() => {
    preloadComponent(() => import('@/components/closed-door-interview/real-time-transcript'));
  }, 2000);
};

// Component size estimates for bundle analysis
export const COMPONENT_SIZES = {
  'closed-door-simulator': '~45KB',
  'real-time-transcript': '~25KB',
  'interviewer-selection': '~20KB',
} as const;