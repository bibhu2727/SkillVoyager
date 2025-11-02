'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Square, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  Volume2, 
  VolumeX,
  Users,
  MessageSquare,
  UserCheck,
  Activity
} from 'lucide-react';
import { AIInterviewer, createInterviewerPanel, InterviewerPanel } from '@/lib/ai-interviewers';
import { panelInterviewManager, PanelInterviewSession } from '@/lib/panel-interview-manager';
import { comprehensiveRecorder, RecordingSession } from '@/lib/comprehensive-recorder';
import { voiceSynthesis } from '@/lib/voice-synthesis';
import RealTimeTranscript from './real-time-transcript';
import AnalysisDashboard from './analysis-dashboard';
import { cn } from '@/lib/utils';

interface ClosedDoorSimulatorProps {
  onComplete?: (session: PanelInterviewSession) => void;
}

export default function ClosedDoorSimulator({ onComplete }: ClosedDoorSimulatorProps) {
  // Core state management
  const [interviewerPanel, setInterviewerPanel] = useState<InterviewerPanel | null>(null);
  const [session, setSession] = useState<PanelInterviewSession | null>(null);
  const [recordingSession, setRecordingSession] = useState<RecordingSession | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentInterviewer, setCurrentInterviewer] = useState<AIInterviewer | null>(null);
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currentTab, setCurrentTab] = useState('interview');

  // Media state
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Add the missing transcriptRef
  const transcriptRef = useRef<any>(null);

  // Initialize interview components
  useEffect(() => {
    const panel = createInterviewerPanel();
    setInterviewerPanel(panel);
  }, []);

  // Cleanup media stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  const startInterview = useCallback(async () => {
    try {
      // Initialize media devices with error handling
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: { echoCancellation: true, noiseSuppression: true }
        });
        setMediaStream(stream);
      } catch (mediaError) {
        console.warn('Media access failed, continuing without media:', mediaError);
      }

      const sessionId = await panelInterviewManager.startPanelInterview();
      const currentSession = panelInterviewManager.getCurrentSession();
      
      if (currentSession) {
        setSession(currentSession);
        setInterviewStarted(true);
        setIsInterviewActive(true);
        
        // Start recording with comprehensive metrics
        const recordingId = await comprehensiveRecorder.startRecording();
        const currentRecordingSession = comprehensiveRecorder.getRecordingSession();
        setRecordingSession(currentRecordingSession);
        setIsRecording(true);
        
        // Ask first question
        await askNextQuestion();
      }
    } catch (error) {
      console.error('Failed to start interview:', error);
    }
  }, []);

  const askNextQuestion = useCallback(async () => {
    try {
      const result = await panelInterviewManager.askNextQuestion();
      
      if (result.isComplete) {
        setIsInterviewComplete(true);
        setIsInterviewActive(false);
        return;
      }
      
      setCurrentQuestion(result.question);
      setCurrentInterviewer(result.interviewer);
      setResponse(''); // Clear previous response
      setIsListening(true); // Start listening for response
    } catch (error) {
      console.error('Failed to ask next question:', error);
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (mediaStream) {
      const videoTracks = mediaStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  }, [mediaStream, isVideoEnabled]);

  const toggleAudio = useCallback(() => {
    if (mediaStream) {
      const audioTracks = mediaStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  }, [mediaStream, isAudioEnabled]);

  const toggleRecording = useCallback(async () => {
    try {
      if (isRecording) {
        const recording = await comprehensiveRecorder.stopRecording();
        setRecordingSession(recording);
        setIsRecording(false);
      } else {
        await comprehensiveRecorder.startRecording();
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Failed to toggle recording:', error);
    }
  }, [isRecording]);

  const stopAnswer = useCallback(async () => {
    try {
      setIsListening(false);
      
      // Submit the current response if there is one
      if (response.trim()) {
        // Save the response with question number
        const currentSession = panelInterviewManager.getCurrentSession();
        if (currentSession && transcriptRef.current) {
          const questionNumber = currentSession.currentQuestionIndex + 1;
          transcriptRef.current.saveQuestionResponse(questionNumber, response.trim());
        }
        
        await panelInterviewManager.submitResponse();
        setResponse('');
      }
      
      // Move to next question
      const currentSession = panelInterviewManager.getCurrentSession();
      if (currentSession) {
        currentSession.currentQuestionIndex++;
        setSession({ ...currentSession });
        
        // Check if we've completed all 12 questions
        if (currentSession.currentQuestionIndex >= 12) {
          setIsInterviewComplete(true);
          setIsInterviewActive(false);
        } else {
          // Ask next question after a short delay
          setTimeout(async () => {
            await askNextQuestion();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Failed to stop answer:', error);
    }
  }, [response, askNextQuestion]);

  const submitResponse = useCallback(async () => {
    try {
      if (!response.trim()) return;
      
      // Save the response with question number
      const currentSession = panelInterviewManager.getCurrentSession();
      if (currentSession && transcriptRef.current) {
        const questionNumber = currentSession.currentQuestionIndex + 1;
        transcriptRef.current.saveQuestionResponse(questionNumber, response.trim());
      }
      
      setIsListening(false);
      await panelInterviewManager.submitResponse();
      setResponse('');
      
      // Ask next question after a brief pause
      setTimeout(askNextQuestion, 2000);
    } catch (error) {
      console.error('Failed to submit response:', error);
    }
  }, [response, askNextQuestion]);

  const endInterview = useCallback(async () => {
    try {
      // Get all question responses from transcript
      const questionResponses = transcriptRef.current?.getQuestionResponses() || {};
      
      const finalSession = await panelInterviewManager.endPanelInterview();
      const finalRecording = await comprehensiveRecorder.stopRecording();
      
      // Add question responses to the session
      if (finalSession) {
        finalSession.questionResponses = questionResponses;
      }
      
      setSession(finalSession);
      setRecordingSession(finalRecording);
      setIsRecording(false);
      setIsInterviewActive(false);
      setIsInterviewComplete(true);
      setShowAnalysis(true);
      setCurrentTab('analysis');
      
      if (onComplete && finalSession) {
        onComplete(finalSession);
      }
    } catch (error) {
      console.error('Failed to end interview:', error);
    }
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Closed-Door Interview Simulator
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Experience a realistic panel interview with AI-powered interviewers
          </p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="interview" className="text-xs sm:text-sm py-2">Interview</TabsTrigger>
            <TabsTrigger value="transcript" className="text-xs sm:text-sm py-2">Transcript</TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs sm:text-sm py-2">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="interview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Video Feed - Made larger */}
              <div className="xl:col-span-2">
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                      Video Feed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-6">
                    <div 
                      className="relative aspect-video sm:aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        willChange: 'auto'
                      }}
                    >
                      <video
                        ref={(el) => {
                          if (el && mediaStream) {
                            el.srcObject = mediaStream;
                            el.play().catch(console.warn);
                          }
                        }}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        style={{ 
                          transform: 'none',
                          transition: 'none',
                          willChange: 'auto',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          minWidth: '100%',
                          minHeight: '100%',
                          maxWidth: '100%',
                          maxHeight: '100%'
                        }}
                      />
                      {!isVideoEnabled && (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                          <CameraOff className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Real-time metrics overlay */}
                      <div className="absolute top-2 left-2 space-y-1">
                        <Badge variant="secondary" className="text-xs">
                          <Activity className="h-3 w-3 mr-1" />
                          Eye Contact: 85%
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Confidence: 78%
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Media controls */}
                    <div className="flex justify-center gap-2 mt-3 sm:mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleVideo}
                        className={cn(!isVideoEnabled && "bg-red-100 border-red-300")}
                      >
                        {isVideoEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleAudio}
                        className={cn(!isAudioEnabled && "bg-red-100 border-red-300")}
                      >
                        {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Interview Controls - Right side */}
              <div className="xl:col-span-1 space-y-3 sm:space-y-4">
                {/* Interview Controls */}
                <Card>
                  <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <div style={{ minHeight: '44px' }}>
                        {!interviewStarted ? (
                          <Button onClick={startInterview} className="flex items-center gap-2 text-sm w-full">
                            <Play className="h-4 w-4" />
                            Start Interview
                          </Button>
              
                        ) : (
                          <>
                            {!isInterviewComplete && (
                              <Button
                                onClick={endInterview}
                                variant="destructive"
                                className="flex items-center gap-2 text-sm w-full"
                              >
                                <Square className="h-4 w-4" />
                                End Interview
                              </Button>
                            )}
                            {isInterviewComplete && (
                              <div className="flex items-center gap-2 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
                                <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                                <span className="text-green-700 font-medium text-xs sm:text-sm">Interview Completed! Check Analysis tab.</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      </div>
                      
                      <div style={{ minHeight: '44px' }}>
                        {interviewStarted && (
                          <Button
                            onClick={toggleRecording}
                            variant={isRecording ? "destructive" : "default"}
                            className="flex items-center gap-2 text-sm w-full"
                            disabled={isInterviewComplete}
                          >
                            {isRecording ? (
                              <>
                                <Square className="h-4 w-4" />
                                Stop Recording
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                Start Recording
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                  </CardContent>
                </Card>

                {/* Session Info */}
                {session && (
                  <Card>
                    <CardHeader className="pb-2 sm:pb-4">
                      <CardTitle className="text-sm">Session Info</CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6">
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span>Started:</span>
                          <span>{new Date(session.startTime).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{Math.floor((Date.now() - session.startTime) / 60000)}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Questions:</span>
                          <span>{session.currentQuestionIndex + 1}/{session.questions.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Status:</span>
                          <Badge variant={session.isActive ? 'default' : 'secondary'} className="text-xs">
                            {session.isActive ? 'Active' : 'Completed'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Interviewer Panel - Full width below video */}
            {interviewerPanel && session && (
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg flex-wrap">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Interview Panel</span>
                    <Badge variant={session.isActive ? 'default' : 'secondary'} className="text-xs">
                      {session.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {interviewerPanel.interviewers.map((interviewer, index) => (
                      <div
                        key={interviewer.id}
                        className={cn(
                          "text-center p-3 sm:p-4 rounded-lg border relative",
                          currentInterviewer?.id === interviewer.id 
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg ring-2 ring-blue-300" 
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {/* Speaking Indicator */}
                        {currentInterviewer?.id === interviewer.id && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            SPEAKING
                          </div>
                        )}
                        
                        {/* AI Avatar */}
                        <div className={cn(
                          "w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl relative overflow-hidden",
                          interviewer.gender === 'female' 
                            ? "bg-gradient-to-br from-pink-500 to-purple-600" 
                            : "bg-gradient-to-br from-blue-500 to-indigo-600",
                          currentInterviewer?.id === interviewer.id 
                            ? "ring-4 ring-blue-400 shadow-xl" 
                            : "shadow-md"
                        )}>
                          {/* Avatar representation */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            {interviewer.gender === 'female' ? (
                              <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16 text-white">
                                <circle cx="50" cy="35" r="15" fill="currentColor" />
                                <path d="M25 75 Q25 55 50 55 Q75 55 75 75 L25 75" fill="currentColor" />
                                <path d="M35 30 Q35 25 40 25 Q45 25 45 30" fill="none" stroke="currentColor" strokeWidth="2" />
                                <path d="M55 30 Q55 25 60 25 Q65 25 65 30" fill="none" stroke="currentColor" strokeWidth="2" />
                                <circle cx="42" cy="32" r="2" fill="currentColor" />
                                <circle cx="58" cy="32" r="2" fill="currentColor" />
                                <path d="M45 40 Q50 45 55 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16 text-white">
                                <circle cx="50" cy="35" r="15" fill="currentColor" />
                                <path d="M25 75 Q25 55 50 55 Q75 55 75 75 L25 75" fill="currentColor" />
                                <circle cx="42" cy="32" r="2" fill="currentColor" />
                                <circle cx="58" cy="32" r="2" fill="currentColor" />
                                <path d="M45 40 Q50 45 55 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            )}
                          </div>
                          
                          {/* Speaking indicator */}
                          {currentInterviewer?.id === interviewer.id && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <Volume2 className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <h4 className="font-semibold text-xs sm:text-sm truncate">{interviewer.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">{interviewer.background}</p>
                        <div className="flex justify-center">
                          <Badge variant="outline" className="text-xs truncate max-w-full">
                            {interviewer.gender === 'female' ? '👩‍💼' : '👨‍💼'} {interviewer.specialties[0]}
                          </Badge>
                        </div>
                        
                        {currentInterviewer?.id === interviewer.id && (
                          <div className="flex items-center justify-center mt-2">
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                            </div>
                            <span className="text-xs text-blue-500 ml-2">Speaking</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Question & Response */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">
                  Question {(session?.currentQuestionIndex || 0) + 1} of {session?.questions.length || 0}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-sm sm:text-lg leading-relaxed">{currentQuestion || "Waiting for question..."}</p>
                  {currentInterviewer && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                      Asked by: {currentInterviewer.name}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">Your Response:</label>
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your response here or use voice input..."
                    className="min-h-[80px] sm:min-h-[100px] text-sm"
                    disabled={!interviewStarted || isInterviewComplete}
                  />
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        onClick={submitResponse}
                        disabled={!response.trim() || !interviewStarted || isInterviewComplete}
                        className="flex items-center gap-2 text-sm flex-1 sm:flex-none"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Submit Response
                      </Button>
                      {interviewStarted && !isInterviewComplete && (
                        <Button
                          onClick={stopAnswer}
                          variant="outline"
                          className="flex items-center gap-2 text-sm"
                        >
                          <Square className="h-4 w-4" />
                          Stop Answer
                        </Button>
                      )}
                    </div>
                    {isListening && (
                      <Badge variant="secondary" className="text-xs">
                        <Mic className="h-3 w-3 mr-1" />
                        Listening...
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Transcript - Below everything */}
            {interviewStarted && (
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                    Live Transcript
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <RealTimeTranscript 
                    ref={transcriptRef}
                    isRecording={isListening}
                    currentSpeaker={interviewerPanel?.interviewers[interviewerPanel.currentSpeaker]?.name || 'Interviewer'}
                    onTranscriptUpdate={(entries) => {
                      // Handle transcript updates if needed
                      console.log('Transcript updated:', entries);
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="transcript">
            <RealTimeTranscript 
              ref={transcriptRef}
              isRecording={isListening}
              currentSpeaker={interviewerPanel?.interviewers[interviewerPanel.currentSpeaker]?.name || 'Interviewer'}
              onTranscriptUpdate={(entries) => {
                // Handle transcript updates if needed
                console.log('Transcript updated:', entries);
              }}
            />
          </TabsContent>

          <TabsContent value="analysis">
            {recordingSession && session ? (
              <AnalysisDashboard 
                recordingSession={recordingSession}
                interviewSession={session}
              />
            ) : (
              <Card>
                <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                  <div className="text-center py-6 sm:py-8">
                    <UserCheck className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">No Analysis Available</h3>
                    <p className="text-sm sm:text-base text-gray-600">Complete an interview to see detailed analysis and metrics.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}