'use client';

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, AlertTriangle, RefreshCw } from 'lucide-react';
import { config } from '@/lib/config';
import { interviewLogger, measurePerformance } from '@/lib/logger';

export interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: number;
  speaker: 'interviewer' | 'candidate';
  speakerName: string;
  confidence: number;
  isInterim?: boolean;
}

interface RealTimeTranscriptProps {
  isRecording: boolean;
  currentSpeaker?: string;
  onTranscriptUpdate?: (entries: TranscriptEntry[]) => void;
}

export type RealTimeTranscriptRef = {
  addInterviewerQuestion: (question: string, interviewerName: string) => void;
  saveQuestionResponse: (questionNumber: number, response: string) => void;
  getQuestionResponses: () => { [key: string]: string };
};

// Error types for better error handling
type TranscriptError = {
  type: 'permission' | 'network' | 'audio' | 'browser' | 'unknown';
  message: string;
  recoverable: boolean;
};

const RealTimeTranscript = forwardRef<RealTimeTranscriptRef, RealTimeTranscriptProps>(({ 
  isRecording, 
  currentSpeaker = 'candidate',
  onTranscriptUpdate 
}, ref) => {
  const [transcriptEntries, setTranscriptEntries] = useState<TranscriptEntry[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [currentInterimText, setCurrentInterimText] = useState('');
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [questionResponses, setQuestionResponses] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<TranscriptError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized error handling with recovery strategies
  const handleError = useCallback((errorType: TranscriptError['type'], message: string, originalError?: any) => {
    const errorObj: TranscriptError = {
      type: errorType,
      message,
      recoverable: errorType !== 'browser' && retryCount < config.interview.retryAttempts
    };
    
    setError(errorObj);
    setIsListening(false);
    
    interviewLogger.error(`Transcript error: ${errorType}`, {
      message,
      retryCount,
      originalError: originalError?.toString(),
    });
    
    // Auto-retry for recoverable errors
    if (errorObj.recoverable && isRecording) {
      const delay = Math.min(config.interview.retryDelay * Math.pow(2, retryCount), 10000);
      retryTimeoutRef.current = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        initializeSpeechRecognition();
      }, delay);
    }
  }, [retryCount, isRecording]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Manual retry function
  const retryRecognition = useCallback(() => {
    clearError();
    setRetryCount(0);
    initializeSpeechRecognition();
  }, []);

  // Optimized transcript entry creation
  const createTranscriptEntry = useCallback((
    text: string,
    speaker: 'interviewer' | 'candidate',
    speakerName: string,
    confidence: number = 0.9
  ): TranscriptEntry => {
    return {
      id: `${speaker}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: text.replace(/\s+/g, ' ').trim(),
      timestamp: Date.now(),
      speaker,
      speakerName,
      confidence,
      isInterim: false
    };
  }, []);

  // Debounced transcript update to prevent excessive re-renders
  const updateTranscriptEntries = useCallback((newEntry: TranscriptEntry) => {
    setTranscriptEntries(prev => {
      const updated = [...prev, newEntry];
      // Limit entries to prevent memory issues
      const maxEntries = 1000;
      const trimmed = updated.length > maxEntries ? updated.slice(-maxEntries) : updated;
      
      // Debounce the callback to parent
      setTimeout(() => onTranscriptUpdate?.(trimmed), 100);
      
      return trimmed;
    });
  }, [onTranscriptUpdate]);

  // Initialize speech recognition with error handling
  const initializeSpeechRecognition = useCallback(async () => {
    try {
      setIsInitializing(true);
      clearError();
      
      // Check browser support
      if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        handleError('browser', 'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      // Request microphone permission first
      if (!permissionGranted) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          setPermissionGranted(true);
          interviewLogger.info('Microphone permission granted');
        } catch (permError) {
          handleError('permission', 'Microphone access is required for live transcription. Please allow microphone permissions and try again.');
          return;
        }
      }

      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Optimized recognition settings
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1; // Reduced for performance
      
      recognition.onstart = () => {
        setIsListening(true);
        setIsInitializing(false);
        clearError();
        interviewLogger.info('Speech recognition started');
      };

      recognition.onresult = (event: any) => {
        measurePerformance('transcript-processing', () => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const confidence = event.results[i][0].confidence || 0.9;

            if (event.results[i].isFinal) {
              const cleanedTranscript = transcript.replace(/\s+/g, ' ').trim();
              
              if (cleanedTranscript && cleanedTranscript.length > 1) {
                finalTranscript += cleanedTranscript;
                
                const newEntry = createTranscriptEntry(
                  cleanedTranscript,
                  'candidate',
                  'You',
                  confidence
                );

                updateTranscriptEntries(newEntry);

                // Update external recorder if available
                if (typeof window !== 'undefined' && (window as any).comprehensiveRecorder) {
                  (window as any).comprehensiveRecorder.addTranscriptEntry(cleanedTranscript, confidence);
                }
              }
            } else {
              interimTranscript += transcript;
            }
          }

          setCurrentInterimText(interimTranscript);
        }, 'transcript');
      };

      recognition.onerror = (event: any) => {
        const errorType = event.error;
        
        switch (errorType) {
          case 'not-allowed':
            handleError('permission', 'Microphone access denied. Please allow microphone permissions in your browser settings.');
            break;
          case 'network':
            handleError('network', 'Network error occurred. Please check your internet connection.');
            break;
          case 'audio-capture':
            handleError('audio', 'Audio capture failed. Please check your microphone connection.');
            break;
          case 'no-speech':
            // Don't treat no-speech as an error, just continue
            interviewLogger.debug('No speech detected, continuing...');
            return;
          case 'aborted':
            // Recognition was intentionally stopped
            return;
          default:
            handleError('unknown', `Speech recognition error: ${errorType}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setCurrentInterimText('');
        
        // Auto-restart if still recording and no error
        if (isRecording && !error && retryCount < config.interview.retryAttempts) {
          restartTimeoutRef.current = setTimeout(() => {
            try {
              recognition.start();
            } catch (restartError: any) {
              if (restartError.name !== 'InvalidStateError') {
                handleError('unknown', 'Failed to restart speech recognition');
              }
            }
          }, config.interview.transcriptUpdateInterval);
        }
      };

      recognitionRef.current = recognition;
      setSpeechRecognition(recognition);
      
    } catch (initError) {
      handleError('unknown', 'Failed to initialize speech recognition');
    } finally {
      setIsInitializing(false);
    }
  }, [permissionGranted, isRecording, error, retryCount, handleError, clearError, createTranscriptEntry, updateTranscriptEntries]);

  useEffect(() => {
    if (isRecording) {
      initializeSpeechRecognition();
    }
    
    return () => {
      // Cleanup on unmount or when recording stops
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [isRecording, initializeSpeechRecognition]);

  // Request microphone permission when component mounts
  useEffect(() => {
    const requestMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
        console.log('Microphone permission granted');
      } catch (error) {
        console.error('Microphone permission denied:', error);
      }
    };

    requestMicrophonePermission();
  }, []);

  // Start/stop speech recognition based on recording state
  useEffect(() => {
    if (speechRecognition && recognitionRef.current) {
      if (isRecording && !isListening && !isInitializing) {
        try {
          recognitionRef.current.start();
        } catch (error: any) {
          if (error.name !== 'InvalidStateError') {
            handleError('unknown', 'Failed to start speech recognition');
          }
        }
      } else if (!isRecording && isListening) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          interviewLogger.error('Failed to stop speech recognition', { error });
        }
      }
    }
  }, [isRecording, speechRecognition, isListening, isInitializing, handleError]);

  // Optimized auto-scroll with throttling
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollElement) {
          const { scrollTop, scrollHeight, clientHeight } = scrollElement;
          const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
          
          if (isNearBottom) {
            scrollElement.scrollTop = scrollHeight;
          }
        }
      }
    };

    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [transcriptEntries, currentInterimText]);

  // Optimized interviewer question addition
  const addInterviewerQuestion = useCallback((question: string, interviewerName: string) => {
    const newEntry = createTranscriptEntry(question, 'interviewer', interviewerName, 1.0);
    updateTranscriptEntries(newEntry);
  }, [createTranscriptEntry, updateTranscriptEntries]);

  // Memoized utility functions
  const formatTimestamp = useMemo(() => (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }, []);

  const getConfidenceColor = useMemo(() => (confidence: number): string => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }, []);

  // Memoized status badge component
  const StatusBadge = useMemo(() => {
    if (error) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Error: {error.message}</span>
          {error.recoverable && (
            <Button
              size="sm"
              variant="ghost"
              onClick={retryRecognition}
              className="h-6 px-2 text-red-800 hover:bg-red-200"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      );
    }

    if (isInitializing) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Initializing...</span>
        </div>
      );
    }

    if (isListening) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Listening</span>
        </div>
      );
    }

    if (isRecording) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span>Recording</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <span>Ready</span>
      </div>
    );
  }, [error, isInitializing, isListening, isRecording, retryRecognition]);

  // Memoized transcript entry component
  const TranscriptEntryComponent = useMemo(() => 
    ({ entry }: { entry: TranscriptEntry }) => (
      <div
        key={entry.id}
        className={`p-3 rounded-lg ${
          entry.speaker === 'interviewer' 
            ? 'bg-blue-50 border-l-4 border-blue-400' 
            : 'bg-gray-50 border-l-4 border-green-400'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-sm">
            {entry.speakerName}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{formatTimestamp(entry.timestamp)}</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${getConfidenceColor(entry.confidence)}`}
            >
              {Math.round(entry.confidence * 100)}%
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-800 leading-relaxed">{entry.text}</p>
      </div>
    ), [formatTimestamp, getConfidenceColor]);

  // Memoized transcript entries list
  const transcriptEntriesList = useMemo(() => 
    transcriptEntries.map(entry => (
      <TranscriptEntryComponent key={entry.id} entry={entry} />
    )), [transcriptEntries, TranscriptEntryComponent]);

  // Memoized interim text display
  const interimTextDisplay = useMemo(() => {
    if (!currentInterimText.trim()) return null;
    
    return (
      <div className="p-3 rounded-lg bg-yellow-50 border-l-4 border-yellow-400 opacity-70">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-sm text-yellow-700">You (speaking...)</span>
          <span className="text-xs text-gray-500">Live</span>
        </div>
        <p className="text-sm text-gray-800 leading-relaxed italic">
          {currentInterimText}
        </p>
      </div>
    );
  }, [currentInterimText]);

  const saveQuestionResponse = (questionNumber: number, response: string) => {
    const questionKey = `q${questionNumber}`;
    setQuestionResponses(prev => ({
      ...prev,
      [questionKey]: response
    }));
  };

  const getQuestionResponses = () => {
    return questionResponses;
  };

  // Expose method to parent component
  useImperativeHandle(ref, () => ({
    addInterviewerQuestion,
    saveQuestionResponse,
    getQuestionResponses
  }));

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Live Transcript</CardTitle>
          {StatusBadge}
        </div>
        {error && !error.recoverable && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            <p className="font-medium">Transcript unavailable</p>
            <p className="text-xs mt-1">
              {error.type === 'browser' 
                ? 'Please use Chrome, Edge, or Safari for speech recognition support.'
                : 'Please check your microphone and internet connection.'
              }
            </p>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-3 pr-4">
            {transcriptEntriesList}
            {interimTextDisplay}
            
            {transcriptEntries.length === 0 && !currentInterimText && !error && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">
                  {isRecording 
                    ? "Start speaking to see your words appear here..." 
                    : "Transcript will appear here when recording starts"
                  }
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

RealTimeTranscript.displayName = 'RealTimeTranscript';

export default RealTimeTranscript;