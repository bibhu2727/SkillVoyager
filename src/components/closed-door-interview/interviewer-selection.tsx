'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Shuffle, 
  User, 
  Star, 
  Briefcase, 
  GraduationCap,
  Target,
  Clock,
  ArrowRight
} from 'lucide-react';
import { AIInterviewer, AI_INTERVIEWERS, getRandomInterviewer, getInterviewersByDifficulty } from '@/lib/ai-interviewers';
import { cn } from '@/lib/utils';

interface InterviewerSelectionProps {
  onInterviewerSelected: (interviewer: AIInterviewer) => void;
  onRandomSelection: () => void;
  onBack?: () => void;
}

export default function InterviewerSelection({ onInterviewerSelected, onRandomSelection, onBack }: InterviewerSelectionProps) {
  const [selectionMode, setSelectionMode] = useState<'random' | 'specific' | 'difficulty'>('random');
  const [selectedInterviewer, setSelectedInterviewer] = useState<AIInterviewer | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleStartInterview = () => {
    if (selectionMode === 'random') {
      onRandomSelection();
    } else if (selectionMode === 'specific' && selectedInterviewer) {
      onInterviewerSelected(selectedInterviewer);
    } else if (selectionMode === 'difficulty') {
      const interviewers = getInterviewersByDifficulty(selectedDifficulty);
      const randomFromDifficulty = interviewers[Math.floor(Math.random() * interviewers.length)];
      onInterviewerSelected(randomFromDifficulty);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getGenderIcon = (gender: string) => {
    return gender === 'female' ? '👩‍💼' : '👨‍💼';
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
      <Card>
        <CardHeader className="text-center px-4 sm:px-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold">Choose Your Interviewer</CardTitle>
          <p className="text-muted-foreground text-sm sm:text-base px-2">
            Select how you'd like to be matched with an AI interviewer for your closed-door session
          </p>
        </CardHeader>
        <CardContent className="space-y-6 px-4 sm:px-6">
          {/* Selection Mode */}
          <div className="space-y-4">
            <Label className="text-base sm:text-lg font-semibold">Selection Method</Label>
            <RadioGroup 
              value={selectionMode} 
              onValueChange={(value: 'random' | 'specific' | 'difficulty') => setSelectionMode(value)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
            >
              <div className="flex items-center space-x-2 p-3 sm:p-0">
                <RadioGroupItem value="random" id="random" />
                <Label htmlFor="random" className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base">
                  <Shuffle className="h-4 w-4" />
                  <span>Random Match</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 sm:p-0">
                <RadioGroupItem value="specific" id="specific" />
                <Label htmlFor="specific" className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base">
                  <User className="h-4 w-4" />
                  <span>Choose Specific</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 sm:p-0">
                <RadioGroupItem value="difficulty" id="difficulty" />
                <Label htmlFor="difficulty" className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base">
                  <Target className="h-4 w-4" />
                  <span>By Difficulty</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Random Selection */}
          {selectionMode === 'random' && (
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 rounded-lg border">
                <Shuffle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Surprise Me!</h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Get matched with a random AI interviewer for an authentic, unpredictable experience. 
                  Each interviewer has unique personality traits and interview styles.
                </p>
              </div>
            </div>
          )}

          {/* Specific Interviewer Selection */}
          {selectionMode === 'specific' && (
            <div className="space-y-4">
              <Label className="text-base sm:text-lg font-semibold">Available Interviewers</Label>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {AI_INTERVIEWERS.map((interviewer) => (
                  <Card 
                    key={interviewer.id}
                    className={cn(
                      "cursor-pointer hover:shadow-md",
                      selectedInterviewer?.id === interviewer.id && "ring-2 ring-blue-500 bg-blue-50"
                    )}
                    onClick={() => setSelectedInterviewer(interviewer)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-xl sm:text-2xl">{getGenderIcon(interviewer.gender)}</div>
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-sm sm:text-base truncate">{interviewer.name}</h4>
                            <Badge className={`${getDifficultyColor(interviewer.difficulty)} text-xs flex-shrink-0`}>
                              {interviewer.difficulty}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {interviewer.background}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {interviewer.specialties.slice(0, 2).map((specialty, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {interviewer.specialties.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{interviewer.specialties.length - 2} more
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Briefcase className="h-3 w-3" />
                              <span className="truncate">{interviewer.interviewStyle.split(',')[0]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Difficulty Selection */}
          {selectionMode === 'difficulty' && (
            <div className="space-y-4">
              <Label className="text-base sm:text-lg font-semibold">Choose Difficulty Level</Label>
              <RadioGroup 
                value={selectedDifficulty} 
                onValueChange={(value: 'easy' | 'medium' | 'hard') => setSelectedDifficulty(value)}
                className="space-y-3 sm:space-y-4"
              >
                <div className="flex items-center space-x-3 p-3 sm:p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="easy" id="easy" className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="easy" className="flex items-center space-x-2 cursor-pointer">
                      <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                      <span className="font-semibold text-sm sm:text-base">Easy</span>
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                      Supportive and encouraging. Focus on basic questions and building confidence.
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs">~20-30 minutes</span>
                    </div>
                  </div>
                  <Badge className="bg-green-50 text-green-600 border-green-200 text-xs flex-shrink-0">
                    {getInterviewersByDifficulty('easy').length} interviewers
                  </Badge>
                </div>

                <div className="flex items-center space-x-3 p-3 sm:p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="medium" id="medium" className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="medium" className="flex items-center space-x-2 cursor-pointer">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0" />
                      <span className="font-semibold text-sm sm:text-base">Medium</span>
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                      Balanced approach with technical and behavioral questions. Standard interview pace.
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs">~30-45 minutes</span>
                    </div>
                  </div>
                  <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200 text-xs flex-shrink-0">
                    {getInterviewersByDifficulty('medium').length} interviewers
                  </Badge>
                </div>

                <div className="flex items-center space-x-3 p-3 sm:p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="hard" id="hard" className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="hard" className="flex items-center space-x-2 cursor-pointer">
                      <Target className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                      <span className="font-semibold text-sm sm:text-base">Hard</span>
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                      Challenging and high-pressure. Complex scenarios and rapid-fire questions.
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs">~45-60 minutes</span>
                    </div>
                  </div>
                  <Badge className="bg-red-50 text-red-600 border-red-200 text-xs flex-shrink-0">
                    {getInterviewersByDifficulty('hard').length} interviewers
                  </Badge>
                </div>
              </RadioGroup>
            </div>
          )}

          <Separator />

          {/* Start Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleStartInterview}
              disabled={selectionMode === 'specific' && !selectedInterviewer}
              size="lg"
              className="w-full sm:w-auto sm:max-w-md px-6 sm:px-8"
            >
              Start Interview Session
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Preview Selected Interviewer */}
          {selectionMode === 'specific' && selectedInterviewer && (
            <div className="mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Selected Interviewer Preview</h4>
              <div className="flex items-start space-x-3">
                <div className="text-xl sm:text-2xl flex-shrink-0">{getGenderIcon(selectedInterviewer.gender)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1 flex-wrap gap-1">
                    <span className="font-medium text-sm sm:text-base">{selectedInterviewer.name}</span>
                    <Badge className={`${getDifficultyColor(selectedInterviewer.difficulty)} text-xs`}>
                      {selectedInterviewer.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-700 mb-2 leading-relaxed">{selectedInterviewer.personality}</p>
                  <p className="text-xs text-blue-600 leading-relaxed">
                    <strong>Interview Style:</strong> {selectedInterviewer.interviewStyle}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}