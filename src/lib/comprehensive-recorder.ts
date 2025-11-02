export interface RecordingMetrics {
  audio: {
    volume: number;
    clarity: number;
    speechRate: number;
    pauseCount: number;
    fillerWords: number;
  };
  video: {
    eyeContact: number;
    headMovement: number;
    facialExpressions: string[];
    posture: string;
    gestureCount: number;
  };
  behavioral: {
    confidenceLevel: number;
    nervousness: number;
    engagement: number;
    professionalism: number;
  };
  transcript: {
    text: string;
    timestamp: number;
    confidence: number;
  }[];
}

export interface RecordingSession {
  id: string;
  startTime: number;
  endTime?: number;
  metrics: RecordingMetrics;
  videoBlob?: Blob;
  audioBlob?: Blob;
}

class ComprehensiveRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private videoStream: MediaStream | null = null;
  private audioStream: MediaStream | null = null;
  private isRecording = false;
  private recordingSession: RecordingSession | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private canvasContext: CanvasRenderingContext2D | null = null;
  
  // Eye tracking and face detection
  private faceDetectionInterval: number | null = null;
  private eyeTrackingData: Array<{x: number, y: number, timestamp: number}> = [];
  
  // Audio analysis
  private audioAnalysisInterval: number | null = null;
  private volumeHistory: number[] = [];
  private speechEvents: Array<{type: 'speech' | 'pause', timestamp: number, duration: number}> = [];

  constructor() {
    this.setupCanvas();
  }

  private setupCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 640;
    this.canvas.height = 480;
    this.canvasContext = this.canvas.getContext('2d');
  }

  public async startRecording(): Promise<string> {
    try {
      // Request permissions for video and audio
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      this.videoStream = stream;
      this.audioStream = stream;

      // Setup video element for face detection
      this.setupVideoElement(stream);

      // Setup audio analysis
      await this.setupAudioAnalysis(stream);

      // Setup media recorder
      this.setupMediaRecorder(stream);

      // Initialize recording session
      this.recordingSession = {
        id: `recording_${Date.now()}`,
        startTime: Date.now(),
        metrics: this.initializeMetrics()
      };

      // Start recording
      this.mediaRecorder?.start();
      this.isRecording = true;

      // Start analysis intervals
      this.startAnalysisIntervals();

      console.log('Comprehensive recording started');
      return this.recordingSession.id;

    } catch (error) {
      console.error('Failed to start recording:', error);
      throw new Error(`Recording failed: ${error}`);
    }
  }

  public async stopRecording(): Promise<RecordingSession | null> {
    if (!this.isRecording || !this.recordingSession) {
      return null;
    }

    return new Promise((resolve) => {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && this.recordingSession) {
            this.recordingSession.videoBlob = event.data;
          }
        };

        this.mediaRecorder.onstop = () => {
          this.cleanup();
          if (this.recordingSession) {
            this.recordingSession.endTime = Date.now();
            this.finalizeMetrics();
          }
          resolve(this.recordingSession);
        };

        this.mediaRecorder.stop();
      } else {
        this.cleanup();
        resolve(this.recordingSession);
      }

      this.isRecording = false;
    });
  }

  private setupVideoElement(stream: MediaStream): void {
    this.videoElement = document.createElement('video');
    this.videoElement.srcObject = stream;
    this.videoElement.autoplay = true;
    this.videoElement.muted = true;
    this.videoElement.style.display = 'none';
    document.body.appendChild(this.videoElement);
  }

  private async setupAudioAnalysis(stream: MediaStream): Promise<void> {
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    source.connect(this.analyser);
  }

  private setupMediaRecorder(stream: MediaStream): void {
    const options = {
      mimeType: 'video/webm;codecs=vp9,opus',
      videoBitsPerSecond: 2500000,
      audioBitsPerSecond: 128000
    };

    this.mediaRecorder = new MediaRecorder(stream, options);
  }

  private initializeMetrics(): RecordingMetrics {
    return {
      audio: {
        volume: 0,
        clarity: 0,
        speechRate: 0,
        pauseCount: 0,
        fillerWords: 0
      },
      video: {
        eyeContact: 0,
        headMovement: 0,
        facialExpressions: [],
        posture: 'neutral',
        gestureCount: 0
      },
      behavioral: {
        confidenceLevel: 0,
        nervousness: 0,
        engagement: 0,
        professionalism: 0
      },
      transcript: []
    };
  }

  private startAnalysisIntervals(): void {
    // Audio analysis every 100ms
    this.audioAnalysisInterval = window.setInterval(() => {
      this.analyzeAudio();
    }, 100);

    // Face detection every 200ms
    this.faceDetectionInterval = window.setInterval(() => {
      this.analyzeFace();
    }, 200);
  }

  private analyzeAudio(): void {
    if (!this.analyser || !this.recordingSession) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    // Calculate volume (RMS)
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / bufferLength);
    const volume = (rms / 255) * 100;

    this.volumeHistory.push(volume);
    
    // Keep only last 100 samples for performance
    if (this.volumeHistory.length > 100) {
      this.volumeHistory.shift();
    }

    // Update real-time metrics
    this.recordingSession.metrics.audio.volume = volume;
    this.recordingSession.metrics.audio.clarity = Math.min(100, volume * 1.2); // Simulate clarity based on volume
    
    // Detect speech vs pause (simple threshold-based)
    const speechThreshold = 20;
    const isSpeaking = volume > speechThreshold;
    const now = Date.now();
    
    if (isSpeaking && this.speechEvents.length === 0 || 
        isSpeaking && this.speechEvents[this.speechEvents.length - 1]?.type === 'pause') {
      this.speechEvents.push({ type: 'speech', timestamp: now, duration: 0 });
    } else if (!isSpeaking && this.speechEvents.length > 0 && 
               this.speechEvents[this.speechEvents.length - 1]?.type === 'speech') {
      this.speechEvents.push({ type: 'pause', timestamp: now, duration: 0 });
    }
  }

  private analyzeFace(): void {
    if (!this.videoElement || !this.canvasContext || !this.recordingSession) return;

    try {
      // Draw current video frame to canvas
      this.canvasContext.drawImage(this.videoElement, 0, 0, this.canvas!.width, this.canvas!.height);
      
      // Simulate face detection (in real implementation, you'd use a library like MediaPipe or face-api.js)
      const faceData = this.simulateFaceDetection();
      
      // Update eye tracking
      this.eyeTrackingData.push({
        x: faceData.eyeX,
        y: faceData.eyeY,
        timestamp: Date.now()
      });

      // Update video metrics
      this.recordingSession.metrics.video.eyeContact = faceData.eyeContact;
      this.recordingSession.metrics.video.headMovement = faceData.headMovement;
      this.recordingSession.metrics.video.posture = faceData.posture;
      
      // Analyze facial expressions
      if (faceData.expression && !this.recordingSession.metrics.video.facialExpressions.includes(faceData.expression)) {
        this.recordingSession.metrics.video.facialExpressions.push(faceData.expression);
      }

    } catch (error) {
      console.warn('Face analysis error:', error);
    }
  }

  private simulateFaceDetection() {
    // Enhanced simulation with more realistic values
    const baseEyeContact = 60 + Math.random() * 30; // 60-90% base range
    const headMovement = Math.random() * 5; // 0-5 units of movement
    const postures = ['good', 'slouching', 'leaning'];
    const expressions = ['neutral', 'confident', 'nervous', 'focused', 'engaged'];
    
    return {
      eyeX: 320 + (Math.random() - 0.5) * 100, // Center with some variation
      eyeY: 240 + (Math.random() - 0.5) * 50,
      eyeContact: Math.min(100, Math.max(0, baseEyeContact + (Math.random() - 0.5) * 20)),
      headMovement: headMovement,
      posture: postures[Math.floor(Math.random() * postures.length)],
      expression: expressions[Math.floor(Math.random() * expressions.length)]
    };
  }

  private finalizeMetrics(): void {
    if (!this.recordingSession) return;

    const metrics = this.recordingSession.metrics;
    
    // Calculate final audio metrics
    if (this.volumeHistory.length > 0) {
      metrics.audio.volume = this.volumeHistory.reduce((sum, vol) => sum + vol, 0) / this.volumeHistory.length;
    }
    metrics.audio.pauseCount = this.speechEvents.filter(event => event.type === 'pause').length;
    
    // Calculate speech rate (words per minute estimate)
    const speechDuration = this.speechEvents
      .filter(event => event.type === 'speech')
      .reduce((sum, event) => sum + event.duration, 0);
    metrics.audio.speechRate = speechDuration > 0 ? (speechDuration / 1000) * 60 : 120; // Default to 120 WPM

    // Enhanced behavioral metrics calculation
    const eyeContactScore = metrics.video.eyeContact;
    const volumeScore = Math.min(100, metrics.audio.volume);
    const clarityScore = metrics.audio.clarity;
    
    // Calculate confidence based on multiple factors
    metrics.behavioral.confidenceLevel = Math.round(
      (eyeContactScore * 0.4 + volumeScore * 0.3 + clarityScore * 0.3)
    );
    
    // Nervousness is inverse of confidence with some randomness
    metrics.behavioral.nervousness = Math.max(0, 
      100 - metrics.behavioral.confidenceLevel + (Math.random() - 0.5) * 20
    );
    
    // Engagement based on eye contact and speech activity
    const speechActivity = this.speechEvents.filter(e => e.type === 'speech').length;
    metrics.behavioral.engagement = Math.round(
      (eyeContactScore * 0.6 + Math.min(100, speechActivity * 10) * 0.4)
    );
    
    // Professionalism as average of confidence and engagement
    metrics.behavioral.professionalism = Math.round(
      (metrics.behavioral.confidenceLevel + metrics.behavioral.engagement) / 2
    );

    // Ensure all values are within 0-100 range
    Object.keys(metrics.behavioral).forEach(key => {
      metrics.behavioral[key as keyof typeof metrics.behavioral] = Math.min(100, Math.max(0, 
        metrics.behavioral[key as keyof typeof metrics.behavioral] as number
      ));
    });
  }

  private cleanup(): void {
    // Clear intervals
    if (this.audioAnalysisInterval) {
      clearInterval(this.audioAnalysisInterval);
      this.audioAnalysisInterval = null;
    }

    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval);
      this.faceDetectionInterval = null;
    }

    // Stop streams
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Remove video element
    if (this.videoElement) {
      document.body.removeChild(this.videoElement);
      this.videoElement = null;
    }

    // Reset data
    this.eyeTrackingData = [];
    this.volumeHistory = [];
    this.speechEvents = [];
  }

  public getRecordingSession(): RecordingSession | null {
    return this.recordingSession;
  }

  public isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  // Add transcript entry
  public addTranscriptEntry(text: string, confidence: number): void {
    if (this.recordingSession) {
      this.recordingSession.metrics.transcript.push({
        text,
        timestamp: Date.now(),
        confidence
      });
    }
  }
}

// Singleton instance
export const comprehensiveRecorder = new ComprehensiveRecorder();

// Utility functions
export function formatRecordingDuration(startTime: number, endTime?: number): string {
  const duration = (endTime || Date.now()) - startTime;
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function calculateOverallScore(metrics: RecordingMetrics): number {
  const audioScore = (metrics.audio.volume + (100 - metrics.audio.fillerWords)) / 2;
  const videoScore = (metrics.video.eyeContact + (metrics.video.posture === 'good' ? 100 : 50)) / 2;
  const behavioralScore = (metrics.behavioral.confidenceLevel + metrics.behavioral.engagement + metrics.behavioral.professionalism) / 3;
  
  return (audioScore + videoScore + behavioralScore) / 3;
}