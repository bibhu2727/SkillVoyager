export interface SpeechMetrics {
  wordsPerMinute: number;
  pauseFrequency: number;
  fillerWords: number;
  clarity: number;
  volume: number;
  confidence: number;
  articulation: number;
}

export interface BodyLanguageMetrics {
  eyeContact: number;
  posture: number;
  facialExpression: number;
  handGestures: number;
  headMovement: number;
  overallEngagement: number;
}

export interface PerformanceMetrics {
  responseTime: number;
  answerCompleteness: number;
  relevance: number;
  technicalAccuracy: number;
  communicationSkills: number;
  problemSolvingApproach: number;
}

export interface InterviewAnalytics {
  sessionId: string;
  timestamp: Date;
  speechMetrics: SpeechMetrics;
  bodyLanguageMetrics: BodyLanguageMetrics;
  performanceMetrics: PerformanceMetrics;
  overallScore: number;
  recommendations: string[];
  strengths: string[];
  areasForImprovement: string[];
}

export class InterviewTracker {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private isTracking = false;
  private speechStartTime: number | null = null;
  private currentMetrics: Partial<InterviewAnalytics> = {};

  constructor() {
    this.initializeAudioAnalysis();
  }

  private async initializeAudioAnalysis() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(new ArrayBuffer(bufferLength));
    } catch (error) {
      console.error('Error initializing audio analysis:', error);
    }
  }

  public startTracking(mediaStream: MediaStream) {
    if (!this.audioContext || !this.analyser) return;

    try {
      const source = this.audioContext.createMediaStreamSource(mediaStream);
      source.connect(this.analyser);
      this.isTracking = true;
      this.startAnalysisLoop();
    } catch (error) {
      console.error('Error starting tracking:', error);
    }
  }

  public stopTracking() {
    this.isTracking = false;
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  private startAnalysisLoop() {
    if (!this.isTracking || !this.analyser || !this.dataArray) return;

    const analyze = () => {
      if (!this.isTracking) return;

      this.analyser!.getByteFrequencyData(this.dataArray!);
      const speechMetrics = this.analyzeSpeechMetrics();
      
      // Store the metrics for later use
      if (!this.currentMetrics.speechMetrics) {
        this.currentMetrics.speechMetrics = speechMetrics;
      }
      
      requestAnimationFrame(analyze);
    };

    analyze();
  }

  private analyzeSpeechMetrics(): SpeechMetrics {
    if (!this.dataArray) {
      return this.getDefaultSpeechMetrics();
    }

    // Calculate volume level
    const volume = this.dataArray.reduce((sum, value) => sum + value, 0) / this.dataArray.length;
    
    // Detect speech activity
    const isSpeaking = volume > 30; // Threshold for speech detection
    
    if (isSpeaking && !this.speechStartTime) {
      this.speechStartTime = Date.now();
    } else if (!isSpeaking && this.speechStartTime) {
      this.speechStartTime = null;
    }

    // Simulate advanced speech analysis (in real implementation, use ML models)
    const speechMetrics: SpeechMetrics = {
      wordsPerMinute: this.calculateWPM(),
      pauseFrequency: this.calculatePauseFrequency(),
      fillerWords: this.detectFillerWords(),
      clarity: this.calculateClarity(volume),
      volume: Math.min(100, (volume / 128) * 100),
      confidence: this.calculateConfidence(volume),
      articulation: this.calculateArticulation()
    };

    return speechMetrics;
  }

  private calculateWPM(): number {
    // Simulate WPM calculation based on speech activity
    return Math.floor(Math.random() * 50) + 120; // 120-170 WPM range
  }

  private calculatePauseFrequency(): number {
    // Simulate pause detection
    return Math.floor(Math.random() * 10) + 5; // 5-15 pauses per minute
  }

  private detectFillerWords(): number {
    // Simulate filler word detection
    return Math.floor(Math.random() * 8); // 0-8 filler words
  }

  private calculateClarity(volume: number): number {
    // Higher volume generally indicates better clarity
    return Math.min(100, (volume / 100) * 80 + Math.random() * 20);
  }

  private calculateConfidence(volume: number): number {
    // Confidence based on volume consistency and speech patterns
    const baseConfidence = Math.min(100, (volume / 80) * 70);
    return baseConfidence + Math.random() * 30;
  }

  private calculateArticulation(): number {
    // Simulate articulation analysis
    return Math.floor(Math.random() * 30) + 70; // 70-100 range
  }

  public analyzeBodyLanguage(videoElement: HTMLVideoElement): BodyLanguageMetrics {
    // Simulate computer vision analysis
    // In real implementation, this would use ML models like MediaPipe or TensorFlow.js
    
    const mockMetrics: BodyLanguageMetrics = {
      eyeContact: Math.random() * 100,
      posture: Math.random() * 100,
      facialExpression: Math.random() * 100,
      handGestures: Math.random() * 100,
      headMovement: Math.random() * 100,
      overallEngagement: 0
    };

    // Calculate overall engagement
    mockMetrics.overallEngagement = (
      mockMetrics.eyeContact +
      mockMetrics.posture +
      mockMetrics.facialExpression +
      mockMetrics.handGestures +
      mockMetrics.headMovement
    ) / 5;

    return mockMetrics;
  }

  public analyzeResponse(response: string, questionType: string): PerformanceMetrics {
    const words = response.split(' ').filter(word => word.length > 0);
    const responseLength = words.length;

    const performanceMetrics: PerformanceMetrics = {
      responseTime: this.calculateResponseTime(),
      answerCompleteness: this.calculateCompleteness(responseLength),
      relevance: this.calculateRelevance(response, questionType),
      technicalAccuracy: this.calculateTechnicalAccuracy(response, questionType),
      communicationSkills: this.calculateCommunicationSkills(response),
      problemSolvingApproach: this.calculateProblemSolvingScore(response, questionType)
    };

    return performanceMetrics;
  }

  private calculateResponseTime(): number {
    // Simulate response time calculation (in seconds)
    return Math.random() * 10 + 5; // 5-15 seconds
  }

  private calculateCompleteness(wordCount: number): number {
    // Score based on response length
    if (wordCount < 20) return 30;
    if (wordCount < 50) return 60;
    if (wordCount < 100) return 85;
    return 95;
  }

  private calculateRelevance(response: string, questionType: string): number {
    // Simulate relevance analysis based on keywords
    const keywords = this.getKeywordsForQuestionType(questionType);
    const responseWords = response.toLowerCase().split(' ');
    
    const matchCount = keywords.filter(keyword => 
      responseWords.some(word => word.includes(keyword))
    ).length;

    return Math.min(100, (matchCount / keywords.length) * 100);
  }

  private calculateTechnicalAccuracy(response: string, questionType: string): number {
    // Simulate technical accuracy assessment
    if (questionType === 'technical') {
      return Math.random() * 40 + 60; // 60-100 for technical questions
    }
    return Math.random() * 30 + 70; // 70-100 for non-technical
  }

  private calculateCommunicationSkills(response: string): number {
    // Analyze communication based on structure and clarity
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = response.length / sentences.length;
    
    let score = 70;
    
    // Bonus for good sentence structure
    if (avgSentenceLength > 10 && avgSentenceLength < 30) score += 15;
    
    // Bonus for using transition words
    const transitionWords = ['however', 'therefore', 'additionally', 'furthermore', 'moreover'];
    if (transitionWords.some(word => response.toLowerCase().includes(word))) score += 10;
    
    return Math.min(100, score + Math.random() * 5);
  }

  private calculateProblemSolvingScore(response: string, questionType: string): number {
    if (questionType !== 'problem_solving') return 0;
    
    // Look for problem-solving indicators
    const indicators = ['approach', 'solution', 'analyze', 'consider', 'evaluate', 'implement'];
    const responseWords = response.toLowerCase();
    
    const indicatorCount = indicators.filter(indicator => 
      responseWords.includes(indicator)
    ).length;
    
    return Math.min(100, (indicatorCount / indicators.length) * 100);
  }

  private getKeywordsForQuestionType(questionType: string): string[] {
    const keywordMap: { [key: string]: string[] } = {
      'technical': ['code', 'algorithm', 'data', 'system', 'design', 'implementation'],
      'behavioral': ['team', 'leadership', 'challenge', 'experience', 'situation', 'result'],
      'problem_solving': ['problem', 'solution', 'approach', 'analyze', 'solve', 'method'],
      'communication': ['explain', 'communicate', 'present', 'discuss', 'collaborate'],
      'leadership': ['lead', 'manage', 'team', 'decision', 'responsibility', 'delegate']
    };
    
    return keywordMap[questionType] || [];
  }

  private getDefaultSpeechMetrics(): SpeechMetrics {
    return {
      wordsPerMinute: 0,
      pauseFrequency: 0,
      fillerWords: 0,
      clarity: 0,
      volume: 0,
      confidence: 0,
      articulation: 0
    };
  }

  public generateRecommendations(analytics: InterviewAnalytics): string[] {
    const recommendations: string[] = [];
    
    // Speech recommendations
    if (analytics.speechMetrics.wordsPerMinute < 120) {
      recommendations.push("Try to speak a bit faster to maintain engagement");
    }
    if (analytics.speechMetrics.fillerWords > 5) {
      recommendations.push("Reduce filler words like 'um' and 'uh' for clearer communication");
    }
    if (analytics.speechMetrics.volume < 50) {
      recommendations.push("Speak with more volume and projection");
    }

    // Body language recommendations
    if (analytics.bodyLanguageMetrics.eyeContact < 70) {
      recommendations.push("Maintain more eye contact with the interviewer");
    }
    if (analytics.bodyLanguageMetrics.posture < 70) {
      recommendations.push("Sit up straight and maintain good posture");
    }

    // Performance recommendations
    if (analytics.performanceMetrics.responseTime > 10) {
      recommendations.push("Try to respond more quickly to show confidence");
    }
    if (analytics.performanceMetrics.answerCompleteness < 70) {
      recommendations.push("Provide more detailed and complete answers");
    }

    return recommendations;
  }

  public identifyStrengths(analytics: InterviewAnalytics): string[] {
    const strengths: string[] = [];
    
    if (analytics.speechMetrics.clarity > 80) {
      strengths.push("Excellent speech clarity");
    }
    if (analytics.bodyLanguageMetrics.eyeContact > 80) {
      strengths.push("Strong eye contact and engagement");
    }
    if (analytics.performanceMetrics.communicationSkills > 85) {
      strengths.push("Outstanding communication skills");
    }
    if (analytics.performanceMetrics.technicalAccuracy > 85) {
      strengths.push("Strong technical knowledge");
    }

    return strengths;
  }

  public calculateOverallScore(analytics: Partial<InterviewAnalytics>): number {
    if (!analytics.speechMetrics || !analytics.bodyLanguageMetrics || !analytics.performanceMetrics) {
      return 0;
    }

    const speechScore = (
      analytics.speechMetrics.clarity +
      analytics.speechMetrics.confidence +
      analytics.speechMetrics.articulation
    ) / 3;

    const bodyScore = analytics.bodyLanguageMetrics.overallEngagement;

    const performanceScore = (
      analytics.performanceMetrics.answerCompleteness +
      analytics.performanceMetrics.relevance +
      analytics.performanceMetrics.communicationSkills
    ) / 3;

    return (speechScore * 0.3 + bodyScore * 0.3 + performanceScore * 0.4);
  }
}