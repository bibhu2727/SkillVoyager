'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Video,
  Mic,
  Brain,
  Target,
  TrendingUp,
  Play,
  Settings,
  Info,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LazyInterviewSimulator } from '@/components/lazy-interview-simulator';
import LazyInterviewResultsDashboard from '@/components/lazy-interview-results-dashboard';
import LazyInterviewHistoryDashboard from '@/components/lazy-interview-history-dashboard';
import type { JobRole, DifficultyLevel, InterviewSession } from '@/lib/interview-simulator';
import { interviewHistoryManager } from '@/lib/interview-history';
import { useAuth } from '@/contexts/auth-context';

type PageState = 'setup' | 'interview' | 'results' | 'history';

interface SetupConfig {
  jobRole: JobRole;
  difficulty: DifficultyLevel;
  duration: number; // in minutes
}

const JOB_ROLES: { value: JobRole; label: string; description: string }[] = [
  {
    value: 'Software Engineer',
    label: 'Software Engineer',
    description: 'Full-stack development, algorithms, system design'
  },
  {
    value: 'Frontend Developer',
    label: 'Frontend Developer',
    description: 'React, JavaScript, CSS, user experience'
  },
  {
    value: 'Backend Developer',
    label: 'Backend Developer',
    description: 'APIs, databases, server architecture'
  },
  {
    value: 'Data Scientist',
    label: 'Data Scientist',
    description: 'Machine learning, statistics, Python'
  },
  {
    value: 'Product Manager',
    label: 'Product Manager',
    description: 'Strategy, roadmaps, stakeholder management'
  },
  {
    value: 'DevOps Engineer',
    label: 'DevOps Engineer',
    description: 'CI/CD, cloud infrastructure, automation'
  },
  {
    value: 'UX Designer',
    label: 'UI/UX Designer',
    description: 'User research, prototyping, design systems'
  },
  {
    value: 'Marketing Manager',
    label: 'Marketing Manager',
    description: 'Campaigns, analytics, brand strategy'
  }
];

const DIFFICULTY_LEVELS: { value: DifficultyLevel; label: string; description: string; color: string }[] = [
  {
    value: 'entry',
    label: 'Entry Level',
    description: '0-2 years experience, fundamental concepts',
    color: 'bg-green-100 text-green-800'
  },
  {
    value: 'mid',
    label: 'Mid Level',
    description: '2-5 years experience, practical application',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    value: 'senior',
    label: 'Senior Level',
    description: '5+ years experience, leadership & architecture',
    color: 'bg-purple-100 text-purple-800'
  }
];

const FEATURES = [
  {
    icon: <Video className="w-5 h-5" />,
    title: 'Video Recording',
    description: 'Practice with real video recording like actual interviews'
  },
  {
    icon: <Mic className="w-5 h-5" />,
    title: 'Speech Analysis',
    description: 'Get feedback on pace, clarity, and filler word usage'
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'AI-Powered Questions',
    description: 'Dynamic questions tailored to your role and experience'
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Real-time Feedback',
    description: 'Live coaching during your practice session'
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Detailed Analysis',
    description: 'Comprehensive breakdown of your performance'
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Improvement Tips',
    description: 'Personalized recommendations for better interviews'
  }
];

export default function InterviewSimulatorPage() {
  const { user } = useAuth();
  const [pageState, setPageState] = useState<PageState>('setup');
  const [config, setConfig] = useState<SetupConfig>({
    jobRole: 'Software Engineer',
    difficulty: 'mid',
    duration: 15
  });
  const [completedSession, setCompletedSession] = useState<InterviewSession | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean | null>(null);

  // Check browser compatibility and permissions
  React.useEffect(() => {
    checkBrowserSupport();
  }, []);

  const checkBrowserSupport = async () => {
    console.log('🔍 Starting browser support check...');
    console.log('🌐 Environment:', process.env.NODE_ENV);
    console.log('🔗 Current URL:', window.location.href);
    console.log('🔒 Is HTTPS:', window.location.protocol === 'https:');
    setIsPermissionGranted(null); // Set to loading state
    
    try {
      // Check for required APIs
      const hasMediaDevices = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
      const hasSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      
      console.log('📱 MediaDevices API supported:', hasMediaDevices);
      console.log('🎤 Speech Recognition supported:', hasSpeechRecognition);
      
      if (!hasMediaDevices) {
        console.error('❌ MediaDevices API not supported');
        setIsPermissionGranted(false);
        return;
      }
      
      // Check if we're in a secure context (required for getUserMedia)
      if (!window.isSecureContext) {
        console.error('❌ Not in secure context (HTTPS required for camera/microphone)');
        setIsPermissionGranted(false);
        return;
      }
      
      if (!hasSpeechRecognition) {
        console.warn('⚠️ Speech Recognition not supported, but continuing with video/audio only');
      }

      // Test permissions with more detailed logging and better error handling
      try {
        console.log('🔐 Requesting camera and microphone permissions...');
        
        // First try with both video and audio
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: { ideal: 1280, min: 640 },
              height: { ideal: 720, min: 480 }
            }, 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
        } catch (videoError) {
          console.warn('⚠️ Video + Audio failed, trying audio only:', videoError);
          // Fallback to audio only
          stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
        }
        
        console.log('✅ Stream obtained successfully');
        console.log('📹 Video tracks:', stream.getVideoTracks().length);
        console.log('🎵 Audio tracks:', stream.getAudioTracks().length);
        
        // Validate that we have at least audio
        if (stream.getAudioTracks().length === 0) {
          throw new Error('No audio tracks available');
        }
        
        // Check track states
        stream.getVideoTracks().forEach((track, index) => {
          console.log(`📹 Video track ${index}:`, track.label, 'State:', track.readyState);
        });
        
        stream.getAudioTracks().forEach((track, index) => {
          console.log(`🎵 Audio track ${index}:`, track.label, 'State:', track.readyState);
        });
        
        // Clean up
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('🛑 Stopped track:', track.label);
        });
        
        console.log('🎉 Camera and microphone permissions granted successfully!');
        setIsPermissionGranted(true);
        
      } catch (error: any) {
        console.error('❌ Permission error details:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error constraint:', error.constraint);
        console.error('Full error:', error);
        
        // More specific error handling
        if (error.name === 'NotAllowedError') {
          console.error('🚫 User denied permission or permissions were revoked');
        } else if (error.name === 'NotFoundError') {
          console.error('📷 No camera or microphone found');
        } else if (error.name === 'NotReadableError') {
          console.error('🔒 Device is already in use by another application');
        } else if (error.name === 'OverconstrainedError') {
          console.error('⚙️ Constraints cannot be satisfied');
        } else if (error.name === 'SecurityError') {
          console.error('🔐 Security error - likely HTTPS required or permissions policy blocked');
        }
        
        setIsPermissionGranted(false);
      }
    } catch (error) {
      console.error('💥 Browser support check failed:', error);
      setIsPermissionGranted(false);
    }
  };

  const handleStartInterview = () => {
    if (isPermissionGranted) {
      setPageState('interview');
    } else {
      checkBrowserSupport();
    }
  };

  const handleInterviewComplete = (session: InterviewSession) => {
    // Save to history if user is authenticated
    if (user?.id) {
      interviewHistoryManager.addInterviewSession(session, user.id);
    }
    
    setCompletedSession(session);
    setPageState('results');
  };

  const handleRetakeInterview = () => {
    setCompletedSession(null);
    setPageState('setup');
  };

  const handleViewHistory = () => {
    setPageState('history');
  };

  const handleDownloadReport = () => {
    if (!completedSession) return;
    
    // Create a simple text report
    const report = `
Interview Report - ${completedSession.jobRole} (${completedSession.difficulty})
${'='.repeat(60)}

Overall Score: ${completedSession.overallScore}/100
Completed: ${completedSession.completedAt?.toLocaleDateString()}
Questions Answered: ${completedSession.responses.length}

Detailed Results:
${completedSession.responses.map((response, index) => `
Question ${index + 1}:
- Response Length: ${response.response.split(' ').length} words
- Time Spent: ${response.timeSpent} seconds
${response.speechAnalysis ? `- Speech Clarity: ${response.speechAnalysis.clarity}%
- Words per Minute: ${response.speechAnalysis.wordsPerMinute}
- Filler Words: ${response.speechAnalysis.fillerWords}` : ''}
${response.aiAnalysis ? `- AI Feedback: ${response.aiAnalysis.feedback}` : ''}
`).join('')}
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareResults = () => {
    if (!completedSession) return;
    
    const shareText = `I just completed an AI-powered interview simulation for ${completedSession.jobRole} and scored ${completedSession.overallScore}/100! 🎯 #InterviewPractice #SkillVoyager`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Interview Simulation Results',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      // You could show a toast notification here
    }
  };

  // Setup Page
  if (pageState === 'setup') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Interview Simulator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice interviews with AI-powered questions, real-time feedback, and detailed performance analysis
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {FEATURES.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Setup Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Interview Setup
              </CardTitle>
              <CardDescription>
                Configure your practice interview session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Job Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Role</label>
                <Select 
                  value={config.jobRole} 
                  onValueChange={(value: JobRole) => setConfig(prev => ({ ...prev, jobRole: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-xs text-muted-foreground">{role.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience Level</label>
                <div className="grid grid-cols-1 gap-2">
                  {DIFFICULTY_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setConfig(prev => ({ ...prev, difficulty: level.value }))}
                      className={cn(
                        'p-3 rounded-lg border text-left transition-all',
                        config.difficulty === level.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-xs text-muted-foreground">{level.description}</div>
                        </div>
                        <Badge className={level.color}>
                          {level.label.split(' ')[0]}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Estimated Duration</label>
                <Select 
                  value={config.duration.toString()} 
                  onValueChange={(value) => setConfig(prev => ({ ...prev, duration: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 minutes (Quick practice)</SelectItem>
                    <SelectItem value="15">15 minutes (Standard)</SelectItem>
                    <SelectItem value="30">30 minutes (Comprehensive)</SelectItem>
                    <SelectItem value="45">45 minutes (Full interview)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* System Check & Start */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                System Check
              </CardTitle>
              <CardDescription>
                Ensure your system is ready for the interview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Permission Status */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {isPermissionGranted === null ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : isPermissionGranted ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm">
                    Camera & Microphone Access
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Speech Recognition Support</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">AI Analysis Ready</span>
                </div>
              </div>

              {/* Warnings/Info */}
              {isPermissionGranted === false && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Camera and microphone access is required for the interview simulator. 
                    Please grant permissions when prompted.
                  </AlertDescription>
                </Alert>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  For the best experience, use a quiet environment with good lighting. 
                  The interview will be recorded locally for analysis.
                </AlertDescription>
              </Alert>

              {/* Start Button */}
              <Button
                onClick={handleStartInterview}
                className="w-full h-12 text-lg"
                disabled={isPermissionGranted === false}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Interview
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              {isPermissionGranted === false && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Camera and microphone access required</p>
                      <p className="text-sm text-muted-foreground">
                        To start the interview simulator, please:
                      </p>
                      <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                        <li>Click the camera/microphone icon in your browser's address bar</li>
                        <li>Select "Allow" for both camera and microphone permissions</li>
                        <li>Refresh the page if needed</li>
                      </ol>
                      
                      {/* Production-specific troubleshooting */}
                      {typeof window !== 'undefined' && window.location.protocol !== 'https:' && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-yellow-800 text-xs">
                            ⚠️ <strong>HTTPS Required:</strong> Camera and microphone access requires a secure connection (HTTPS). 
                            This site must be accessed via HTTPS for the interview simulator to work.
                          </p>
                        </div>
                      )}
                      
                      {typeof window !== 'undefined' && !window.isSecureContext && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-yellow-800 text-xs">
                            ⚠️ <strong>Secure Context Required:</strong> This page is not in a secure context. 
                            Please ensure you're accessing the site via HTTPS.
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        <Button 
                          onClick={checkBrowserSupport} 
                          variant="outline" 
                          size="sm"
                        >
                          Check Permissions Again
                        </Button>
                        <Button 
                          onClick={() => window.location.reload()} 
                          variant="outline" 
                          size="sm"
                        >
                          Refresh Page
                        </Button>
                      </div>
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        <p className="font-medium">Debug Info:</p>
                        <p>• Browser: {typeof navigator !== 'undefined' ? navigator.userAgent.split(' ').slice(-2).join(' ') : 'Unknown'}</p>
                        <p>• HTTPS: {typeof window !== 'undefined' ? (window.location.protocol === 'https:' ? 'Yes' : 'No') : 'Unknown'}</p>
                        <p>• Secure Context: {typeof window !== 'undefined' ? (window.isSecureContext ? 'Yes' : 'No') : 'Unknown'}</p>
                        <p>• MediaDevices: {typeof navigator !== 'undefined' && navigator.mediaDevices ? 'Supported' : 'Not Supported'}</p>
                        <p>• Speech Recognition: {typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) ? 'Supported' : 'Not Supported'}</p>
                        <p>• Environment: {process.env.NODE_ENV || 'Unknown'}</p>
                        <p>• URL: {typeof window !== 'undefined' ? window.location.href : 'Unknown'}</p>
                        <p className="text-xs mt-1 text-muted-foreground">Check browser console (F12) for detailed error messages</p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              {isPermissionGranted === null && (
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      Checking browser compatibility and permissions...
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              {isPermissionGranted === true && (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <p className="font-medium">Ready to start!</p>
                    <p className="text-sm">Camera and microphone permissions granted successfully.</p>
                  </AlertDescription>
                </Alert>
              )}

              {/* Selected Configuration Summary */}
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Interview Configuration:</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>Role: <span className="font-medium text-foreground">
                    {JOB_ROLES.find(r => r.value === config.jobRole)?.label}
                  </span></div>
                  <div>Level: <span className="font-medium text-foreground">
                    {DIFFICULTY_LEVELS.find(d => d.value === config.difficulty)?.label}
                  </span></div>
                  <div>Duration: <span className="font-medium text-foreground">
                    ~{config.duration} minutes
                  </span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Interview Page
  if (pageState === 'interview') {
    return (
      <div className="container mx-auto px-4 py-8">
        <LazyInterviewSimulator
          jobRole={config.jobRole}
          difficulty={config.difficulty}
          duration={config.duration}
          onComplete={handleInterviewComplete}
        />
      </div>
    );
  }

  // Results Page
  if (pageState === 'results' && completedSession) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LazyInterviewResultsDashboard
          session={completedSession}
          onRetake={handleRetakeInterview}
          onShare={() => setPageState('history')}
        />
        
        {user && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={handleViewHistory}
            >
              <History className="w-4 h-4 mr-2" />
              View Interview History
            </Button>
          </div>
        )}
      </div>
    );
  }

  // History Page
  if (pageState === 'history') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Interview History</h1>
              <p className="text-muted-foreground mt-2">
                Track your progress and analyze your interview performance over time.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setPageState('setup')}
            >
              <Play className="w-4 h-4 mr-2" />
              New Interview
            </Button>
          </div>
          
          <LazyInterviewHistoryDashboard onStartNewInterview={() => setPageState('setup')} />
        </div>
      </div>
    );
  }

  return null;
}