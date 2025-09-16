"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Briefcase,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  RotateCcw,
  Trophy,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

interface GameChoice {
  id: string;
  text: string;
  impact: 'positive' | 'negative' | 'neutral';
  consequence: string;
  skillsGained?: string[];
  nextScenario?: string;
}

interface GameScenario {
  id: string;
  title: string;
  description: string;
  context: string;
  choices: GameChoice[];
  category: string;
}

interface CareerSimulatorProps {
  onExit: () => void;
}

const gameScenarios: GameScenario[] = [
  {
    id: 'entry-level-job',
    title: 'Your First Job Offer',
    description: 'You\'ve just graduated and received two job offers. Which path will you choose?',
    context: 'After months of job searching, you finally have options. Both companies seem promising, but they offer different growth trajectories.',
    category: 'Career Start',
    choices: [
      {
        id: 'startup',
        text: 'Join a fast-growing startup with equity but lower salary',
        impact: 'positive',
        consequence: 'Great choice! You gain diverse experience and potential high returns. Your adaptability and entrepreneurial skills flourish.',
        skillsGained: ['Adaptability', 'Entrepreneurship', 'Multi-tasking'],
        nextScenario: 'startup-growth'
      },
      {
        id: 'corporate',
        text: 'Accept the corporate position with higher salary and benefits',
        impact: 'positive',
        consequence: 'Solid decision! You build strong foundational skills and financial stability. Your professional network expands significantly.',
        skillsGained: ['Process Management', 'Corporate Communication', 'Structured Thinking'],
        nextScenario: 'corporate-promotion'
      },
      {
        id: 'wait',
        text: 'Decline both and wait for a "perfect" opportunity',
        impact: 'negative',
        consequence: 'Risky move! While perfectionism has merit, you miss valuable early career experience. Time is a crucial asset.',
        skillsGained: [],
        nextScenario: 'job-search-extended'
      }
    ]
  },
  {
    id: 'startup-growth',
    title: 'Startup Scaling Challenge',
    description: 'Your startup is growing rapidly, but you\'re overwhelmed with responsibilities.',
    context: 'The company has tripled in size, and you\'re wearing multiple hats. How do you handle the pressure?',
    category: 'Growth Phase',
    choices: [
      {
        id: 'delegate',
        text: 'Focus on delegation and building systems',
        impact: 'positive',
        consequence: 'Excellent leadership! You develop management skills and create scalable processes. The team becomes more efficient.',
        skillsGained: ['Leadership', 'System Design', 'Team Building'],
        nextScenario: 'leadership-role'
      },
      {
        id: 'burnout',
        text: 'Try to handle everything yourself',
        impact: 'negative',
        consequence: 'Burnout alert! While dedication is admirable, this approach isn\'t sustainable. You learn the hard way about work-life balance.',
        skillsGained: ['Resilience'],
        nextScenario: 'recovery-phase'
      }
    ]
  },
  {
    id: 'corporate-promotion',
    title: 'Promotion Opportunity',
    description: 'You\'re offered a management role, but it requires relocating to another city.',
    context: 'This promotion could accelerate your career, but it means leaving your comfort zone and support network.',
    category: 'Career Advancement',
    choices: [
      {
        id: 'relocate',
        text: 'Accept the promotion and relocate',
        impact: 'positive',
        consequence: 'Bold move! You expand your horizons and gain valuable management experience. Your career trajectory accelerates.',
        skillsGained: ['Management', 'Adaptability', 'Strategic Thinking'],
        nextScenario: 'management-challenges'
      },
      {
        id: 'negotiate',
        text: 'Negotiate for a remote or local management position',
        impact: 'neutral',
        consequence: 'Smart negotiation! You show initiative while maintaining work-life balance. Results may vary based on company flexibility.',
        skillsGained: ['Negotiation', 'Communication'],
        nextScenario: 'remote-leadership'
      }
    ]
  }
];

export function CareerSimulator({ onExit }: CareerSimulatorProps) {
  const [currentScenario, setCurrentScenario] = useState<GameScenario>(gameScenarios[0]);
  const [gameHistory, setGameHistory] = useState<Array<{ scenario: string; choice: string; impact: string }>>([]);
  const [skillsEarned, setSkillsEarned] = useState<string[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);

  const handleChoice = (choice: GameChoice) => {
    // Add to history
    const historyEntry = {
      scenario: currentScenario.title,
      choice: choice.text,
      impact: choice.impact
    };
    setGameHistory(prev => [...prev, historyEntry]);

    // Add skills
    if (choice.skillsGained) {
      setSkillsEarned(prev => [...prev, ...choice.skillsGained!]);
    }

    // Update score
    const points = choice.impact === 'positive' ? 10 : choice.impact === 'neutral' ? 5 : 0;
    setScore(prev => prev + points);

    // Find next scenario or complete game
    if (choice.nextScenario) {
      const nextScenario = gameScenarios.find(s => s.id === choice.nextScenario);
      if (nextScenario) {
        setTimeout(() => setCurrentScenario(nextScenario), 2000);
      } else {
        setTimeout(() => setGameComplete(true), 2000);
      }
    } else {
      setTimeout(() => setGameComplete(true), 2000);
    }
  };

  const resetGame = () => {
    setCurrentScenario(gameScenarios[0]);
    setGameHistory([]);
    setSkillsEarned([]);
    setGameComplete(false);
    setScore(0);
  };

  const progress = (gameHistory.length / 3) * 100; // Assuming 3 scenarios max

  if (gameComplete) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl text-green-800 dark:text-green-200">
              Career Simulation Complete!
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              You've navigated through {gameHistory.length} career scenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">
                {score} Points
              </div>
              <p className="text-green-600 dark:text-green-400">
                {score >= 25 ? 'Excellent strategic thinking!' : 
                 score >= 15 ? 'Good decision making!' : 
                 'Learning experience gained!'}
              </p>
            </div>

            {skillsEarned.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-green-800 dark:text-green-200">
                  Skills Developed:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(skillsEarned)].map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={resetGame} variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
              <Button asChild className="flex-1">
                <Link href="/simulator">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  AI Career Simulator
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Game Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Career Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gameHistory.map((entry, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`p-1 rounded-full ${
                    entry.impact === 'positive' ? 'bg-green-100 text-green-600' :
                    entry.impact === 'negative' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {entry.impact === 'positive' ? <CheckCircle className="h-4 w-4" /> :
                     entry.impact === 'negative' ? <AlertCircle className="h-4 w-4" /> :
                     <Clock className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{entry.scenario}</h4>
                    <p className="text-sm text-muted-foreground">{entry.choice}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <div className="text-gray-800 dark:text-gray-300">Progress</div>
            <div className="text-gray-900 dark:text-white">{gameHistory.length}/3 scenarios</div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Score */}
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="flex items-center gap-1">
          <Trophy className="h-3 w-3" />
          Score: {score}
        </Badge>
        <Badge variant="secondary">
          {currentScenario.category}
        </Badge>
      </div>

      {/* Current Scenario */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <Badge variant="outline">{currentScenario.category}</Badge>
          </div>
          <CardTitle className="text-xl">{currentScenario.title}</CardTitle>
          <CardDescription>{currentScenario.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">{currentScenario.context}</p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">What do you choose?</h3>
              {currentScenario.choices.map((choice) => (
                <Button
                  key={choice.id}
                  variant="outline"
                  className="w-full text-left h-auto p-4 justify-start"
                  onClick={() => handleChoice(choice)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1 rounded-full mt-1 ${
                      choice.impact === 'positive' ? 'bg-green-100 text-green-600' :
                      choice.impact === 'negative' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {choice.impact === 'positive' ? <TrendingUp className="h-3 w-3" /> :
                       choice.impact === 'negative' ? <AlertCircle className="h-3 w-3" /> :
                       <Clock className="h-3 w-3" />}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white">{choice.text}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Earned So Far */}
      {skillsEarned.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skills Developed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[...new Set(skillsEarned)].map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}