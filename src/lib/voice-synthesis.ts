export interface VoiceConfig {
  voiceId: string;
  rate: number;
  pitch: number;
  volume: number;
  lang: string;
}

export interface SpeechSynthesisManager {
  speak: (text: string, voiceConfig: VoiceConfig) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  getAvailableVoices: () => SpeechSynthesisVoice[];
  isSupported: () => boolean;
}

class VoiceSynthesisService implements SpeechSynthesisManager {
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
    
    // Handle voice loading for different browsers
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices(): void {
    this.voices = this.synthesis.getVoices();
  }

  public isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public async speak(text: string, voiceConfig: VoiceConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      // Stop any current speech to prevent conflicts
      if (this.currentUtterance) {
        this.stop();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = this.findVoiceByConfig(voiceConfig);
      
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = voiceConfig.rate;
      utterance.pitch = voiceConfig.pitch;
      utterance.volume = voiceConfig.volume;
      utterance.lang = voiceConfig.lang;

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        this.currentUtterance = null;
        
        // Handle different error types gracefully
        if (event.error === 'interrupted' || event.error === 'canceled') {
          console.log('Speech was interrupted or canceled');
          resolve(); // Don't reject for interruptions
        } else if (event.error === 'network') {
          console.error('Network error during speech synthesis');
          reject(new Error(`Speech synthesis network error: ${event.error}`));
        } else {
          reject(new Error(`Speech synthesis error: ${event.error}`));
        }
      };

      utterance.onstart = () => {
        console.log('Speech synthesis started');
      };

      // Add additional error handling for AbortError
      try {
        this.currentUtterance = utterance;
        
        // Check if synthesis is available before speaking
        if (!this.synthesis || !this.isSupported()) {
          reject(new Error('Speech synthesis not supported'));
          return;
        }

        // Ensure we're not already speaking before starting new speech
        if (this.synthesis.speaking) {
          this.synthesis.cancel();
          // Small delay to ensure cancellation is processed
          setTimeout(() => {
            this.synthesis.speak(utterance);
          }, 50);
        } else {
          this.synthesis.speak(utterance);
        }
      } catch (error: any) {
        this.currentUtterance = null;
        if (error.name === 'AbortError') {
          console.log('Speech synthesis was aborted, likely due to media removal');
          resolve(); // Don't treat AbortError as a failure
        } else {
          reject(error);
        }
      }
    });
  }

  public stop(): void {
    try {
      if (this.synthesis && this.synthesis.speaking) {
        this.synthesis.cancel();
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Speech synthesis stop was aborted');
      } else {
        console.error('Error stopping speech synthesis:', error);
      }
    }
    this.currentUtterance = null;
  }

  public pause(): void {
    try {
      if (this.synthesis && this.synthesis.speaking && !this.synthesis.paused) {
        this.synthesis.pause();
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Speech synthesis pause was aborted');
      } else {
        console.error('Error pausing speech synthesis:', error);
      }
    }
  }

  public resume(): void {
    try {
      if (this.synthesis && this.synthesis.paused) {
        this.synthesis.resume();
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Speech synthesis resume was aborted');
      } else {
        console.error('Error resuming speech synthesis:', error);
      }
    }
  }

  private findVoiceByConfig(config: VoiceConfig): SpeechSynthesisVoice | null {
    // First try to find exact match by voiceId
    let voice = this.voices.find(v => v.name.toLowerCase().includes(config.voiceId.toLowerCase()));
    
    if (!voice) {
      // Fallback to gender-based selection
      if (config.voiceId.includes('female')) {
        voice = this.voices.find(v => 
          v.name.toLowerCase().includes('female') || 
          v.name.toLowerCase().includes('woman') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('karen') ||
          v.name.toLowerCase().includes('victoria')
        );
      } else if (config.voiceId.includes('male')) {
        voice = this.voices.find(v => 
          v.name.toLowerCase().includes('male') || 
          v.name.toLowerCase().includes('man') ||
          v.name.toLowerCase().includes('daniel') ||
          v.name.toLowerCase().includes('alex') ||
          v.name.toLowerCase().includes('fred')
        );
      }
    }

    // Final fallback to first available voice with matching language
    if (!voice) {
      voice = this.voices.find(v => v.lang.startsWith(config.lang)) || this.voices[0];
    }

    return voice || null;
  }
}

// Voice configurations for different interviewer personalities
export const VOICE_CONFIGS: Record<string, VoiceConfig> = {
  female_professional_1: {
    voiceId: 'female_professional',
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    lang: 'en-US'
  },
  male_authoritative_1: {
    voiceId: 'male_authoritative',
    rate: 0.8,
    pitch: 0.8,
    volume: 0.9,
    lang: 'en-US'
  },
  female_warm_1: {
    voiceId: 'female_warm',
    rate: 1.0,
    pitch: 1.1,
    volume: 0.8,
    lang: 'en-US'
  },
  male_innovative_1: {
    voiceId: 'male_innovative',
    rate: 1.1,
    pitch: 1.0,
    volume: 0.8,
    lang: 'en-US'
  }
};

// Singleton instance
export const voiceSynthesis = new VoiceSynthesisService();

// Utility function to speak with interviewer's voice
export async function speakAsInterviewer(text: string, voiceId: string): Promise<void> {
  const config = VOICE_CONFIGS[voiceId] || VOICE_CONFIGS.female_professional_1;
  return voiceSynthesis.speak(text, config);
}