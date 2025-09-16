"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle, XCircle, Trophy, Target, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import type {
  QuizQuestion,
  QuizSession,
  SkillCategory,
  DifficultyLevel
} from '@/lib/quiz-data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QuizGameProps {
  onQuizComplete?: (session: QuizSession) => void;
}

export function QuizGame({ onQuizComplete }: QuizGameProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Quiz state
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'completed'>('setup');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('Data Science');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Beginner');
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds per question
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeRemaining > 0 && !isAnswerSubmitted) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isAnswerSubmitted) {
      handleSubmitAnswer();
    }
  }, [timeRemaining, gameState, isAnswerSubmitted]);

  const startQuiz = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to start the quiz.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Dynamically import quiz functions to reduce initial bundle size
      const { getRandomQuestions, getMaxPossibleScore } = await import('@/lib/quiz-data');
      
      const questions = getRandomQuestions(selectedCategory, selectedDifficulty, 10);
      
      if (questions.length === 0) {
        toast({
          title: 'No Questions Available',
          description: 'No questions found for the selected category and difficulty.',
          variant: 'destructive',
        });
        return;
      }

      const session: QuizSession = {
        id: `quiz_${Date.now()}`,
        userId: user.id,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        questions,
        answers: new Array(questions.length).fill(null),
        score: 0,
        totalPoints: getMaxPossibleScore(questions),
        startTime: new Date(),
        completed: false,
      };

      setCurrentSession(session);
      setGameState('playing');
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setTimeRemaining(30);
      setShowExplanation(false);
      setIsAnswerSubmitted(false);
    } catch (error) {
      toast({
        title: 'Error Loading Quiz',
        description: 'Failed to load quiz data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentSession) return;

    const updatedAnswers = [...currentSession.answers];
    updatedAnswers[currentQuestionIndex] = selectedAnswer;

    const updatedSession = {
      ...currentSession,
      answers: updatedAnswers,
    };

    setCurrentSession(updatedSession);
    setIsAnswerSubmitted(true);
    setShowExplanation(true);

    // Show feedback
    const currentQuestion = currentSession.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    toast({
      title: isCorrect ? 'Correct!' : 'Incorrect',
      description: isCorrect 
        ? `+${currentQuestion.points} points` 
        : `The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`,
      variant: isCorrect ? 'default' : 'destructive',
    });
  };

  const handleNextQuestion = async () => {
    if (!currentSession) return;

    if (currentQuestionIndex < currentSession.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeRemaining(30);
      setShowExplanation(false);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz completed
      try {
        // Dynamically import calculateScore function
        const { calculateScore } = await import('@/lib/quiz-data');
        
        const finalScore = calculateScore(currentSession.answers, currentSession.questions);
        const completedSession = {
          ...currentSession,
          score: finalScore,
          endTime: new Date(),
          completed: true,
        };

        setCurrentSession(completedSession);
        setGameState('completed');

        // Save to localStorage (in a real app, this would be saved to a database)
        const existingSessions = JSON.parse(localStorage.getItem('quizSessions') || '[]');
        existingSessions.push(completedSession);
        localStorage.setItem('quizSessions', JSON.stringify(existingSessions));

        if (onQuizComplete) {
          onQuizComplete(completedSession);
        }

        toast({
          title: "Quiz Completed!",
          description: `You scored ${finalScore} out of ${completedSession.totalPoints} points!`,
        });
      } catch (error) {
        toast({
          title: "Error Completing Quiz",
          description: "Failed to calculate final score. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const resetQuiz = () => {
    setGameState('setup');
    setCurrentSession(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTimeRemaining(30);
    setShowExplanation(false);
    setIsAnswerSubmitted(false);
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressPercentage = () => {
    if (!currentSession) return 0;
    return ((currentQuestionIndex + 1) / currentSession.questions.length) * 100;
  };

  if (gameState === 'setup') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Skill Challenge Quiz
          </CardTitle>
          <CardDescription>
            Test your knowledge across different career fields and earn points!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Category</label>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as SkillCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Data Science">📊 Data Science</SelectItem>
                  <SelectItem value="Marketing">📈 Marketing</SelectItem>
                  <SelectItem value="Finance">💰 Finance</SelectItem>
                  <SelectItem value="Software Development">💻 Software Development</SelectItem>
                  <SelectItem value="Project Management">📋 Project Management</SelectItem>
                  <SelectItem value="Design">🎨 Design</SelectItem>
                  <SelectItem value="Sales">🤝 Sales</SelectItem>
                  <SelectItem value="Human Resources">👥 Human Resources</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Select Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as DifficultyLevel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">🟢 Beginner (10 pts per question)</SelectItem>
                  <SelectItem value="Intermediate">🟡 Intermediate (20 pts per question)</SelectItem>
                  <SelectItem value="Advanced">🔴 Advanced (30 pts per question)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Quiz Rules:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 10 questions per quiz</li>
              <li>• 30 seconds per question</li>
              <li>• Points based on difficulty level</li>
              <li>• View explanations after each answer</li>
            </ul>
          </div>

          <Button onClick={startQuiz} className="w-full" size="lg">
            <Zap className="mr-2 h-4 w-4" />
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'playing' && currentSession) {
    const currentQuestion = currentSession.questions[currentQuestionIndex];
    
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge className={getDifficultyColor(currentSession.difficulty)}>
              {currentSession.difficulty}
            </Badge>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className={`font-mono ${timeRemaining <= 10 ? 'text-red-500' : ''}`}>
                {timeRemaining}s
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="text-gray-800 dark:text-gray-300">Question {currentQuestionIndex + 1} of {currentSession.questions.length}</div>
              <div className="text-gray-800 dark:text-gray-300">{currentSession.category}</div>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                let buttonVariant: 'default' | 'outline' | 'destructive' | 'secondary' = 'outline';
                let icon = null;
                
                if (showExplanation) {
                  if (index === currentQuestion.correctAnswer) {
                    buttonVariant = 'default';
                    icon = <CheckCircle className="h-4 w-4" />;
                  } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
                    buttonVariant = 'destructive';
                    icon = <XCircle className="h-4 w-4" />;
                  }
                } else if (selectedAnswer === index) {
                  buttonVariant = 'secondary';
                }
                
                return (
                  <Button
                    key={index}
                    variant={buttonVariant}
                    className="w-full justify-start text-left h-auto p-4"
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswerSubmitted}
                  >
                    <div className="flex items-center gap-3">
                      {icon}
                      <span className="text-gray-800 dark:text-gray-200">{option}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {showExplanation && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Explanation:</h3>
              <p className="text-sm">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex gap-3">
            {!isAnswerSubmitted ? (
              <Button 
                onClick={handleSubmitAnswer} 
                disabled={selectedAnswer === null}
                className="flex-1"
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="flex-1">
                {currentQuestionIndex < currentSession.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'completed' && currentSession) {
    const percentage = Math.round((currentSession.score / currentSession.totalPoints) * 100);
    const duration = currentSession.endTime && currentSession.startTime 
      ? Math.round((currentSession.endTime.getTime() - currentSession.startTime.getTime()) / 1000)
      : 0;

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Quiz Completed!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">
              {currentSession.score} / {currentSession.totalPoints}
            </div>
            <div className="text-2xl font-semibold">
              {percentage}% Score
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Category</div>
                <div className="font-semibold">{currentSession.category}</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Difficulty</div>
                <div className="font-semibold">{currentSession.difficulty}</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Time Taken</div>
                <div className="font-semibold">{duration}s</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Correct Answers</div>
                <div className="font-semibold">
                  {currentSession.answers.filter((answer, index) => 
                    answer === currentSession.questions[index].correctAnswer
                  ).length} / {currentSession.questions.length}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={resetQuiz} variant="outline" className="flex-1">
              Take Another Quiz
            </Button>
            <Button onClick={() => router.push('/quiz/leaderboard')} className="flex-1">
              <Target className="mr-2 h-4 w-4" />
              View Leaderboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}