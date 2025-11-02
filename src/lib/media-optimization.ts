/**
 * Media Optimization for Production
 * Handles audio/video recording, compression, and streaming optimizations
 */

import { productionMonitoring } from './production-monitoring';

interface MediaConfig {
  audio: {
    sampleRate: number;
    channelCount: number;
    bitRate: number;
    echoCancellation: boolean;
    noiseSuppression: boolean;
    autoGainControl: boolean;
  };
  video: {
    width: number;
    height: number;
    frameRate: number;
    bitRate: number;
    facingMode: 'user' | 'environment';
  };
  recording: {
    maxDuration: number; // in milliseconds
    chunkSize: number; // in milliseconds
    format: string;
    compression: boolean;
  };
}

interface MediaQualitySettings {
  quality: 'low' | 'medium' | 'high' | 'auto';
  adaptiveBitrate: boolean;
  networkOptimization: boolean;
}

class MediaOptimizer {
  private static instance: MediaOptimizer;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private config: MediaConfig;
  private qualitySettings: MediaQualitySettings;
  private networkMonitor: NetworkMonitor;

  private constructor() {
    this.config = this.getOptimalConfig();
    this.qualitySettings = this.getQualitySettings();
    this.networkMonitor = new NetworkMonitor();
    
    // Monitor network changes for adaptive quality
    this.networkMonitor.onNetworkChange((info) => {
      this.adaptToNetworkConditions(info);
    });
  }

  static getInstance(): MediaOptimizer {
    if (!MediaOptimizer.instance) {
      MediaOptimizer.instance = new MediaOptimizer();
    }
    return MediaOptimizer.instance;
  }

  private getOptimalConfig(): MediaConfig {
    // Detect device capabilities and network conditions
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = this.isLowEndDevice();
    
    return {
      audio: {
        sampleRate: isLowEnd ? 16000 : 44100,
        channelCount: 1, // Mono for interviews
        bitRate: isLowEnd ? 64000 : 128000,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      },
      video: {
        width: isMobile ? 640 : 1280,
        height: isMobile ? 480 : 720,
        frameRate: isLowEnd ? 15 : 30,
        bitRate: isLowEnd ? 500000 : 1500000,
        facingMode: 'user'
      },
      recording: {
        maxDuration: parseInt((import.meta as any).env?.VITE_MAX_RECORDING_DURATION) || 30 * 60 * 1000, // 30 minutes
        chunkSize: 10000, // 10 seconds
        format: 'webm',
        compression: true
      }
    };
  }

  private getQualitySettings(): MediaQualitySettings {
    const connection = (navigator as any).connection;
    const effectiveType = connection?.effectiveType || '4g';
    
    return {
      quality: this.getQualityFromConnection(effectiveType),
      adaptiveBitrate: true,
      networkOptimization: true
    };
  }

  private getQualityFromConnection(effectiveType: string): 'low' | 'medium' | 'high' | 'auto' {
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'low';
      case '3g':
        return 'medium';
      case '4g':
      default:
        return 'high';
    }
  }

  private isLowEndDevice(): boolean {
    // Simple heuristic for low-end device detection
    const memory = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency;
    
    return (memory && memory < 4) || (cores && cores < 4);
  }

  async requestMediaPermissions(includeVideo: boolean = false): Promise<MediaStream> {
    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          sampleRate: this.config.audio.sampleRate,
          channelCount: this.config.audio.channelCount,
          echoCancellation: this.config.audio.echoCancellation,
          noiseSuppression: this.config.audio.noiseSuppression,
          autoGainControl: this.config.audio.autoGainControl
        }
      };

      if (includeVideo) {
        constraints.video = {
          width: { ideal: this.config.video.width },
          height: { ideal: this.config.video.height },
          frameRate: { ideal: this.config.video.frameRate },
          facingMode: this.config.video.facingMode
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.stream = stream;

      // Track permission grant
      productionMonitoring.trackMediaPermission('microphone', true);
      if (includeVideo) {
        productionMonitoring.trackMediaPermission('camera', true);
      }

      return stream;
    } catch (error) {
      // Track permission denial
      productionMonitoring.trackMediaPermission('microphone', false);
      if (includeVideo) {
        productionMonitoring.trackMediaPermission('camera', false);
      }
      
      productionMonitoring.trackError(error as Error, {
        context: 'media_permission_request',
        includeVideo
      });
      
      throw error;
    }
  }

  async startRecording(stream: MediaStream): Promise<void> {
    try {
      // Clear previous chunks
      this.recordedChunks = [];

      // Determine optimal MIME type
      const mimeType = this.getSupportedMimeType();
      
      const options: MediaRecorderOptions = {
        mimeType,
        audioBitsPerSecond: this.config.audio.bitRate,
        videoBitsPerSecond: this.config.video.bitRate
      };

      this.mediaRecorder = new MediaRecorder(stream, options);

      // Handle data available
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
          
          // Compress chunks if enabled
          if (this.config.recording.compression) {
            this.compressChunk(event.data);
          }
        }
      };

      // Handle recording stop
      this.mediaRecorder.onstop = () => {
        productionMonitoring.trackEvent('recording_stopped', {
          duration: this.getRecordingDuration(),
          chunks: this.recordedChunks.length,
          totalSize: this.getTotalSize()
        });
      };

      // Handle errors
      this.mediaRecorder.onerror = (event) => {
        productionMonitoring.trackError(new Error('MediaRecorder error'), {
          context: 'media_recording',
          event
        });
      };

      // Start recording with time slicing
      this.mediaRecorder.start(this.config.recording.chunkSize);

      // Set up automatic stop after max duration
      setTimeout(() => {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          this.stopRecording();
        }
      }, this.config.recording.maxDuration);

      productionMonitoring.trackEvent('recording_started', {
        mimeType,
        audioBitRate: this.config.audio.bitRate,
        videoBitRate: this.config.video.bitRate
      });

    } catch (error) {
      productionMonitoring.trackError(error as Error, {
        context: 'start_recording'
      });
      throw error;
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        try {
          const blob = new Blob(this.recordedChunks, {
            type: this.getSupportedMimeType()
          });
          
          // Optimize blob if needed
          this.optimizeRecording(blob).then(resolve).catch(reject);
        } catch (error) {
          reject(error);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  private getSupportedMimeType(): string {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm',
      'audio/webm;codecs=opus',
      'audio/webm',
      'video/mp4',
      'audio/mp4'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'video/webm'; // Fallback
  }

  private async optimizeRecording(blob: Blob): Promise<Blob> {
    if (!this.config.recording.compression) {
      return blob;
    }

    try {
      // Simple compression using canvas for video frames
      // In production, you might want to use a more sophisticated compression library
      return blob; // Placeholder - implement actual compression
    } catch (error) {
      productionMonitoring.trackError(error as Error, {
        context: 'recording_optimization'
      });
      return blob; // Return original if compression fails
    }
  }

  private compressChunk(chunk: Blob): void {
    // Implement chunk compression if needed
    // This could involve streaming compression or buffering
  }

  private getRecordingDuration(): number {
    // Calculate recording duration
    return this.recordedChunks.length * this.config.recording.chunkSize;
  }

  private getTotalSize(): number {
    return this.recordedChunks.reduce((total, chunk) => total + chunk.size, 0);
  }

  private adaptToNetworkConditions(networkInfo: any): void {
    if (!this.qualitySettings.adaptiveBitrate) return;

    const effectiveType = networkInfo.effectiveType;
    const newQuality = this.getQualityFromConnection(effectiveType);

    if (newQuality !== this.qualitySettings.quality) {
      this.qualitySettings.quality = newQuality;
      this.updateRecordingQuality(newQuality);
      
      productionMonitoring.trackEvent('quality_adaptation', {
        oldQuality: this.qualitySettings.quality,
        newQuality,
        effectiveType,
        downlink: networkInfo.downlink
      });
    }
  }

  private updateRecordingQuality(quality: 'low' | 'medium' | 'high' | 'auto'): void {
    // Adjust recording parameters based on quality
    switch (quality) {
      case 'low':
        this.config.audio.bitRate = 64000;
        this.config.video.bitRate = 500000;
        this.config.video.frameRate = 15;
        break;
      case 'medium':
        this.config.audio.bitRate = 96000;
        this.config.video.bitRate = 1000000;
        this.config.video.frameRate = 24;
        break;
      case 'high':
        this.config.audio.bitRate = 128000;
        this.config.video.bitRate = 1500000;
        this.config.video.frameRate = 30;
        break;
    }
  }

  cleanup(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    this.recordedChunks = [];
    this.mediaRecorder = null;
  }

  // Audio processing utilities
  async processAudioForSpeechRecognition(audioBlob: Blob): Promise<Blob> {
    try {
      // Convert to optimal format for speech recognition
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioContext = new AudioContext({
        sampleRate: 16000 // Optimal for speech recognition
      });
      
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Process audio (noise reduction, normalization, etc.)
      const processedBuffer = this.processAudioBuffer(audioBuffer);
      
      // Convert back to blob
      const processedBlob = await this.audioBufferToBlob(processedBuffer);
      
      return processedBlob;
    } catch (error) {
      productionMonitoring.trackError(error as Error, {
        context: 'audio_processing'
      });
      return audioBlob; // Return original if processing fails
    }
  }

  private processAudioBuffer(buffer: AudioBuffer): AudioBuffer {
    // Implement audio processing (noise reduction, normalization, etc.)
    // This is a placeholder - implement actual audio processing
    return buffer;
  }

  private async audioBufferToBlob(buffer: AudioBuffer): Promise<Blob> {
    // Convert AudioBuffer to Blob
    // This is a placeholder - implement actual conversion
    return new Blob();
  }
}

// Network monitoring utility
class NetworkMonitor {
  private callbacks: ((info: any) => void)[] = [];

  constructor() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', () => {
        this.notifyCallbacks(this.getNetworkInfo());
      });
    }
  }

  onNetworkChange(callback: (info: any) => void): void {
    this.callbacks.push(callback);
  }

  private getNetworkInfo(): any {
    const connection = (navigator as any).connection;
    return {
      effectiveType: connection?.effectiveType || '4g',
      downlink: connection?.downlink || 10,
      rtt: connection?.rtt || 100,
      saveData: connection?.saveData || false
    };
  }

  private notifyCallbacks(info: any): void {
    this.callbacks.forEach(callback => callback(info));
  }
}

// Export singleton instance
export const mediaOptimizer = MediaOptimizer.getInstance();

// Utility functions
export async function optimizedMediaRequest(includeVideo: boolean = false): Promise<MediaStream> {
  return mediaOptimizer.requestMediaPermissions(includeVideo);
}

export async function startOptimizedRecording(stream: MediaStream): Promise<void> {
  return mediaOptimizer.startRecording(stream);
}

export async function stopOptimizedRecording(): Promise<Blob> {
  return mediaOptimizer.stopRecording();
}

export function cleanupMedia(): void {
  mediaOptimizer.cleanup();
}