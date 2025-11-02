// Speech Analysis Utilities for Interview Simulator

import type { SpeechAnalysis } from './interview-simulator';

// Web Speech API types
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
  grammars: any;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: any) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
    };
  }
}

// Common filler words to detect
const FILLER_WORDS = [
  'um', 'uh', 'er', 'ah', 'like', 'you know', 'so', 'well',
  'actually', 'basically', 'literally', 'obviously', 'right',
  'okay', 'alright', 'I mean', 'kind of', 'sort of'
];

// Confidence keywords that indicate strong responses
const CONFIDENCE_INDICATORS = [
  'definitely', 'certainly', 'absolutely', 'clearly', 'specifically',
  'exactly', 'precisely', 'obviously', 'undoubtedly', 'confident'
];

// Uncertainty indicators
const UNCERTAINTY_INDICATORS = [
  'maybe', 'perhaps', 'possibly', 'might', 'could be', 'I think',
  'I guess', 'probably', 'not sure', 'I believe'
];

export class SpeechAnalyzer {
  private recognition: SpeechRecognition | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private isRecording = false;
  private startTime = 0;
  private transcript = '';
  private currentTranscript = '';
  private confidenceScores: number[] = [];
  private volumeLevels: number[] = [];
  private pauseTimestamps: number[] = [];
  private lastSpeechTime = 0;

  constructor() {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;
      }
    }
  }

  async startRecording(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported in this browser');
    }

    try {
      // Initialize audio context for volume analysis
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.microphone.connect(this.analyser);

      // Reset tracking variables
      this.transcript = '';
      this.currentTranscript = '';
      this.confidenceScores = [];
      this.volumeLevels = [];
      this.pauseTimestamps = [];
      this.startTime = Date.now();
      this.lastSpeechTime = this.startTime;
      this.isRecording = true;

      // Start volume monitoring
      this.monitorVolume();

      // Set up speech recognition callbacks
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            this.confidenceScores.push(result[0].confidence);
            this.lastSpeechTime = Date.now();
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        if (finalTranscript) {
          this.transcript += finalTranscript;
        }
        
        // Update transcript with interim results for real-time feedback
        // Store the final transcript separately and append interim for current analysis
        this.currentTranscript = this.transcript + interimTranscript;
      };

      this.recognition.onend = () => {
        if (this.isRecording) {
          // Restart recognition if still recording
          this.recognition?.start();
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        // Handle specific error types
        if (event.error === 'network') {
          console.warn('Network error in speech recognition. Retrying...');
          // Retry after a short delay if still recording
          setTimeout(() => {
            if (this.recognition && this.isRecording) {
              try {
                this.recognition.start();
              } catch (retryError) {
                console.error('Failed to restart speech recognition:', retryError);
              }
            }
          }, 2000);
        } else if (event.error === 'no-speech') {
          console.warn('No speech detected. Speech recognition will restart automatically.');
        } else if (event.error === 'audio-capture') {
          console.error('Audio capture error. Please check microphone permissions.');
          this.isRecording = false;
        } else if (event.error === 'not-allowed') {
          console.error('Speech recognition not allowed. Please grant microphone permissions.');
          this.isRecording = false;
        } else if (event.error === 'service-not-allowed') {
          console.error('Speech recognition service not allowed.');
          this.isRecording = false;
        }
      };

      // Start speech recognition
      this.recognition.start();

      // Monitor for pauses
      this.monitorPauses();

    } catch (error) {
      throw new Error(`Failed to start recording: ${error}`);
    }
  }

  stopRecording(): SpeechAnalysis {
    this.isRecording = false;
    
    if (this.recognition) {
      this.recognition.stop();
    }

    if (this.audioContext) {
      this.audioContext.close();
    }

    const endTime = Date.now();
    const duration = (endTime - this.startTime) / 1000; // in seconds

    return this.analyzeSpeech(duration);
  }

  private monitorVolume() {
    if (!this.analyser || !this.isRecording) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const checkVolume = () => {
      if (!this.isRecording) return;
      
      this.analyser!.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const sum = dataArray.reduce((acc, value) => acc + value, 0);
      const average = sum / bufferLength;
      this.volumeLevels.push(average);
      
      setTimeout(checkVolume, 100); // Check every 100ms
    };
    
    checkVolume();
  }

  private monitorPauses() {
    const checkPauses = () => {
      if (!this.isRecording) return;
      
      const now = Date.now();
      const timeSinceLastSpeech = now - this.lastSpeechTime;
      
      // If more than 1 second of silence, record as a pause
      if (timeSinceLastSpeech > 1000) {
        this.pauseTimestamps.push(timeSinceLastSpeech);
        this.lastSpeechTime = now; // Reset to avoid multiple recordings of same pause
      }
      
      setTimeout(checkPauses, 500); // Check every 500ms
    };
    
    setTimeout(checkPauses, 1000); // Start checking after 1 second
  }

  private analyzeSpeech(duration: number): SpeechAnalysis {
    const words = this.transcript.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const wordsPerMinute = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;

    // Count filler words
    const fillerWordCount = this.countFillerWords(this.transcript);

    // Calculate pause frequency (pauses per minute)
    const pauseFrequency = duration > 0 ? Math.round((this.pauseTimestamps.length / duration) * 60) : 0;

    // Calculate clarity score based on confidence and filler words
    const avgConfidence = this.confidenceScores.length > 0 
      ? this.confidenceScores.reduce((sum, score) => sum + score, 0) / this.confidenceScores.length
      : 0.5;
    
    const fillerWordPenalty = Math.min(fillerWordCount * 5, 30); // Max 30 point penalty
    const clarity = Math.max(0, Math.min(100, (avgConfidence * 100) - fillerWordPenalty));

    // Calculate average volume
    const avgVolume = this.volumeLevels.length > 0
      ? this.volumeLevels.reduce((sum, level) => sum + level, 0) / this.volumeLevels.length
      : 50;
    const volume = Math.min(100, (avgVolume / 128) * 100); // Normalize to 0-100

    // Determine tone based on speech patterns
    const tone = this.determineTone(this.transcript, wordsPerMinute, pauseFrequency);

    return {
      wordsPerMinute,
      pauseFrequency,
      fillerWords: fillerWordCount,
      clarity: Math.round(clarity),
      volume: Math.round(volume),
      tone
    };
  }

  private countFillerWords(transcript: string): number {
    const lowerTranscript = transcript.toLowerCase();
    return FILLER_WORDS.reduce((count, filler) => {
      const regex = new RegExp(`\\b${filler}\\b`, 'g');
      const matches = lowerTranscript.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
  }

  private determineTone(
    transcript: string, 
    wordsPerMinute: number, 
    pauseFrequency: number
  ): 'confident' | 'nervous' | 'monotone' | 'enthusiastic' {
    const lowerTranscript = transcript.toLowerCase();
    
    // Count confidence and uncertainty indicators
    const confidenceCount = CONFIDENCE_INDICATORS.reduce((count, indicator) => {
      return count + (lowerTranscript.includes(indicator) ? 1 : 0);
    }, 0);
    
    const uncertaintyCount = UNCERTAINTY_INDICATORS.reduce((count, indicator) => {
      return count + (lowerTranscript.includes(indicator) ? 1 : 0);
    }, 0);

    // Determine tone based on speech patterns
    if (wordsPerMinute > 180 && pauseFrequency < 10) {
      return 'enthusiastic';
    } else if (confidenceCount > uncertaintyCount && pauseFrequency < 15) {
      return 'confident';
    } else if (uncertaintyCount > confidenceCount || pauseFrequency > 25) {
      return 'nervous';
    } else {
      return 'monotone';
    }
  }

  // Get current transcript (for real-time display)
  getCurrentTranscript(): string {
    return this.currentTranscript;
  }

  // Check if speech recognition is supported
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 
           ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }
}

// Utility function to analyze pre-recorded text (fallback)
export function analyzeTextSpeech(
  text: string, 
  duration: number, 
  estimatedWPM: number = 150
): SpeechAnalysis {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const wordsPerMinute = duration > 0 ? Math.round((wordCount / duration) * 60) : estimatedWPM;

  // Estimate speech patterns from text
  const fillerWordCount = FILLER_WORDS.reduce((count, filler) => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = text.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);

  // Estimate pauses from punctuation and sentence structure
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const pauseFrequency = sentences.length > 1 ? Math.round((sentences.length / duration) * 60) : 5;

  // Calculate clarity based on text quality
  const avgWordsPerSentence = wordCount / Math.max(sentences.length, 1);
  const clarity = Math.max(30, Math.min(100, 100 - (fillerWordCount * 5) + (avgWordsPerSentence > 10 ? 10 : 0)));

  // Determine tone from text content
  const lowerText = text.toLowerCase();
  const confidenceCount = CONFIDENCE_INDICATORS.reduce((count, indicator) => {
    return count + (lowerText.includes(indicator) ? 1 : 0);
  }, 0);
  
  const uncertaintyCount = UNCERTAINTY_INDICATORS.reduce((count, indicator) => {
    return count + (lowerText.includes(indicator) ? 1 : 0);
  }, 0);

  let tone: 'confident' | 'nervous' | 'monotone' | 'enthusiastic' = 'monotone';
  if (wordsPerMinute > 180) {
    tone = 'enthusiastic';
  } else if (confidenceCount > uncertaintyCount) {
    tone = 'confident';
  } else if (uncertaintyCount > confidenceCount) {
    tone = 'nervous';
  }

  return {
    wordsPerMinute,
    pauseFrequency,
    fillerWords: fillerWordCount,
    clarity: Math.round(clarity),
    volume: 75, // Default volume for text analysis
    tone
  };
}

// Export utility functions
export {
  FILLER_WORDS,
  CONFIDENCE_INDICATORS,
  UNCERTAINTY_INDICATORS
};