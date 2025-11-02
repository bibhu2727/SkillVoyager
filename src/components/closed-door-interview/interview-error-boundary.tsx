'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, ArrowLeft, Mic, Video } from 'lucide-react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
  onBack?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

class InterviewErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Interview Error:', error, errorInfo);
    
    // Log interview-specific errors
    if (process.env.NODE_ENV === 'production') {
      this.logInterviewError(error, errorInfo);
    }
  }

  private logInterviewError = (error: Error, errorInfo: ErrorInfo) => {
    const errorData = {
      type: 'interview_error',
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      retryCount: this.state.retryCount,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      permissions: this.checkPermissions(),
    };

    console.error('Interview Error Data:', errorData);
  };

  private checkPermissions = () => {
    if (typeof navigator === 'undefined') return {};
    
    return {
      camera: 'mediaDevices' in navigator,
      microphone: 'mediaDevices' in navigator,
      speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    };
  };

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({ 
        hasError: false, 
        error: undefined,
        retryCount: prevState.retryCount + 1 
      }));
      this.props.onReset?.();
    }
  };

  private handleBack = () => {
    this.setState({ hasError: false, error: undefined, retryCount: 0 });
    this.props.onBack?.();
  };

  private getErrorMessage = () => {
    const error = this.state.error;
    if (!error) return 'An unexpected error occurred during the interview.';

    // Provide user-friendly messages for common errors
    if (error.message.includes('camera') || error.message.includes('video')) {
      return 'Camera access is required for the interview. Please check your camera permissions and try again.';
    }
    
    if (error.message.includes('microphone') || error.message.includes('audio')) {
      return 'Microphone access is required for the interview. Please check your microphone permissions and try again.';
    }
    
    if (error.message.includes('speech') || error.message.includes('recognition')) {
      return 'Speech recognition is not available in your browser. Please try using Chrome or Edge for the best experience.';
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }

    return 'An unexpected error occurred during the interview. Please try again.';
  };

  private getErrorSuggestions = () => {
    const error = this.state.error;
    if (!error) return [];

    const suggestions = [];

    if (error.message.includes('camera') || error.message.includes('video')) {
      suggestions.push('Check camera permissions in your browser settings');
      suggestions.push('Ensure no other applications are using your camera');
      suggestions.push('Try refreshing the page and allowing camera access');
    }
    
    if (error.message.includes('microphone') || error.message.includes('audio')) {
      suggestions.push('Check microphone permissions in your browser settings');
      suggestions.push('Ensure your microphone is connected and working');
      suggestions.push('Try refreshing the page and allowing microphone access');
    }
    
    if (error.message.includes('speech') || error.message.includes('recognition')) {
      suggestions.push('Use Chrome or Edge browser for better speech recognition support');
      suggestions.push('Ensure you have a stable internet connection');
      suggestions.push('Speak clearly and at a moderate pace');
    }

    return suggestions;
  };

  render() {
    if (this.state.hasError) {
      const canRetry = this.state.retryCount < this.maxRetries;
      const errorMessage = this.getErrorMessage();
      const suggestions = this.getErrorSuggestions();

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl">Interview Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {errorMessage}
              </p>

              {suggestions.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Troubleshooting Tips:
                  </h4>
                  <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-xs font-mono text-red-800 dark:text-red-200 break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={this.handleBack} 
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                {canRetry && (
                  <Button 
                    onClick={this.handleRetry} 
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again ({this.maxRetries - this.state.retryCount} left)
                  </Button>
                )}
              </div>

              {!canRetry && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    Maximum retry attempts reached. Please refresh the page or contact support.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default InterviewErrorBoundary;