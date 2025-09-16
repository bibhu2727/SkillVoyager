"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  Clock,
  Lightbulb,
  CheckCircle,
  Trophy,
  RotateCcw,
  ExternalLink,
  Timer,
  Zap,
  Star,
} from 'lucide-react';
import Link from 'next/link';

interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'domain';
  required: boolean;
  placed: boolean;
}

interface JobRole {
  id: string;
  title: string;
  description: string;
  requiredSkills: Skill[];
  optionalSkills: Skill[];
  timeLimit: number; // in seconds
}

interface SkillPuzzleGameProps {
  onExit: () => void;
}

const jobRoles: JobRole[] = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    description: 'Build engaging user interfaces and experiences',
    timeLimit: 120,
    requiredSkills: [
      { id: 'html', name: 'HTML', category: 'technical', required: true, placed: false },
      { id: 'css', name: 'CSS', category: 'technical', required: true, placed: false },
      { id: 'javascript', name: 'JavaScript', category: 'technical', required: true, placed: false },
      { id: 'react', name: 'React', category: 'technical', required: true, placed: false },
    ],
    optionalSkills: [
      { id: 'typescript', name: 'TypeScript', category: 'technical', required: false, placed: false },
      { id: 'design', name: 'UI/UX Design', category: 'domain', required: false, placed: false },
      { id: 'communication', name: 'Communication', category: 'soft', required: false, placed: false },
      { id: 'problem-solving', name: 'Problem Solving', category: 'soft', required: false, placed: false },
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Extract insights from data to drive business decisions',
    timeLimit: 150,
    requiredSkills: [
      { id: 'python', name: 'Python', category: 'technical', required: true, placed: false },
      { id: 'statistics', name: 'Statistics', category: 'domain', required: true, placed: false },
      { id: 'machine-learning', name: 'Machine Learning', category: 'domain', required: true, placed: false },
      { id: 'sql', name: 'SQL', category: 'technical', required: true, placed: false },
    ],
    optionalSkills: [
      { id: 'r', name: 'R Programming', category: 'technical', required: false, placed: false },
      { id: 'visualization', name: 'Data Visualization', category: 'domain', required: false, placed: false },
      { id: 'critical-thinking', name: 'Critical Thinking', category: 'soft', required: false, placed: false },
      { id: 'business-acumen', name: 'Business Acumen', category: 'domain', required: false, placed: false },
    ]
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    description: 'Guide product development from conception to launch',
    timeLimit: 100,
    requiredSkills: [
      { id: 'strategy', name: 'Strategic Thinking', category: 'soft', required: true, placed: false },
      { id: 'user-research', name: 'User Research', category: 'domain', required: true, placed: false },
      { id: 'project-management', name: 'Project Management', category: 'soft', required: true, placed: false },
      { id: 'analytics', name: 'Analytics', category: 'domain', required: true, placed: false },
    ],
    optionalSkills: [
      { id: 'agile', name: 'Agile Methodology', category: 'domain', required: false, placed: false },
      { id: 'leadership', name: 'Leadership', category: 'soft', required: false, placed: false },
      { id: 'market-research', name: 'Market Research', category: 'domain', required: false, placed: false },
      { id: 'negotiation', name: 'Negotiation', category: 'soft', required: false, placed: false },
    ]
  }
];

const availableSkills = [
  // Technical Skills
  { id: 'html', name: 'HTML', category: 'technical' as const },
  { id: 'css', name: 'CSS', category: 'technical' as const },
  { id: 'javascript', name: 'JavaScript', category: 'technical' as const },
  { id: 'react', name: 'React', category: 'technical' as const },
  { id: 'typescript', name: 'TypeScript', category: 'technical' as const },
  { id: 'python', name: 'Python', category: 'technical' as const },
  { id: 'sql', name: 'SQL', category: 'technical' as const },
  { id: 'r', name: 'R Programming', category: 'technical' as const },
  
  // Domain Skills
  { id: 'design', name: 'UI/UX Design', category: 'domain' as const },
  { id: 'statistics', name: 'Statistics', category: 'domain' as const },
  { id: 'machine-learning', name: 'Machine Learning', category: 'domain' as const },
  { id: 'visualization', name: 'Data Visualization', category: 'domain' as const },
  { id: 'user-research', name: 'User Research', category: 'domain' as const },
  { id: 'analytics', name: 'Analytics', category: 'domain' as const },
  { id: 'agile', name: 'Agile Methodology', category: 'domain' as const },
  { id: 'market-research', name: 'Market Research', category: 'domain' as const },
  
  // Soft Skills
  { id: 'communication', name: 'Communication', category: 'soft' as const },
  { id: 'problem-solving', name: 'Problem Solving', category: 'soft' as const },
  { id: 'critical-thinking', name: 'Critical Thinking', category: 'soft' as const },
  { id: 'business-acumen', name: 'Business Acumen', category: 'soft' as const },
  { id: 'strategy', name: 'Strategic Thinking', category: 'soft' as const },
  { id: 'project-management', name: 'Project Management', category: 'soft' as const },
  { id: 'leadership', name: 'Leadership', category: 'soft' as const },
  { id: 'negotiation', name: 'Negotiation', category: 'soft' as const },
];

export function SkillPuzzleGame({ onExit }: SkillPuzzleGameProps) {
  const [currentRole, setCurrentRole] = useState<JobRole>(jobRoles[0]);
  const [timeLeft, setTimeLeft] = useState(currentRole.timeLimit);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [draggedSkill, setDraggedSkill] = useState<string | null>(null);
  const [placedSkills, setPlacedSkills] = useState<string[]>([]);

  // Timer effect
  useEffect(() => {
    if (gameStarted && !gameComplete && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameComplete, timeLeft]);

  // Check completion
  useEffect(() => {
    const requiredSkillsPlaced = currentRole.requiredSkills.every(skill => 
      placedSkills.includes(skill.id)
    );
    
    if (requiredSkillsPlaced && gameStarted && !gameComplete) {
      setGameComplete(true);
      const timeBonus = Math.floor(timeLeft / 10);
      const hintPenalty = hintsUsed * 5;
      const optionalBonus = currentRole.optionalSkills.filter(skill => 
        placedSkills.includes(skill.id)
      ).length * 10;
      
      setScore(100 + timeBonus + optionalBonus - hintPenalty);
    }
  }, [placedSkills, currentRole, gameStarted, gameComplete, timeLeft, hintsUsed]);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(currentRole.timeLimit);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameComplete(false);
    setScore(0);
    setHintsUsed(0);
    setPlacedSkills([]);
    setTimeLeft(currentRole.timeLimit);
  };

  const useHint = () => {
    const unplacedRequired = currentRole.requiredSkills.find(skill => 
      !placedSkills.includes(skill.id)
    );
    
    if (unplacedRequired) {
      setHintsUsed(prev => prev + 1);
      // Highlight the skill for 3 seconds
      const skillElement = document.getElementById(`skill-${unplacedRequired.id}`);
      if (skillElement) {
        skillElement.classList.add('ring-2', 'ring-yellow-400', 'animate-pulse');
        setTimeout(() => {
          skillElement.classList.remove('ring-2', 'ring-yellow-400', 'animate-pulse');
        }, 3000);
      }
    }
  };

  const handleDragStart = (skillId: string) => {
    setDraggedSkill(skillId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropZone: 'required' | 'optional') => {
    e.preventDefault();
    if (!draggedSkill) return;

    const isValidDrop = dropZone === 'required' 
      ? currentRole.requiredSkills.some(skill => skill.id === draggedSkill)
      : currentRole.optionalSkills.some(skill => skill.id === draggedSkill);

    if (isValidDrop && !placedSkills.includes(draggedSkill)) {
      setPlacedSkills(prev => [...prev, draggedSkill]);
    }
    
    setDraggedSkill(null);
  };

  const removeSkill = (skillId: string) => {
    setPlacedSkills(prev => prev.filter(id => id !== skillId));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'domain': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'soft': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (placedSkills.filter(skillId => 
    currentRole.requiredSkills.some(skill => skill.id === skillId)
  ).length / currentRole.requiredSkills.length) * 100;

  if (gameComplete) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl text-green-800 dark:text-green-200">
              {timeLeft > 0 ? 'Puzzle Complete!' : 'Time\'s Up!'}
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              {currentRole.title} skill tree {timeLeft > 0 ? 'completed' : 'attempted'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">
                {score} Points
              </div>
              <div className="flex justify-center gap-4 text-sm text-green-600 dark:text-green-400">
                <div className="text-gray-900 dark:text-white">Time Bonus: +{Math.floor(timeLeft / 10)}</div>
            <div className="text-gray-900 dark:text-white">Hints Used: -{hintsUsed * 5}</div>
                <span className="text-gray-800 dark:text-gray-200">Optional Skills: +{currentRole.optionalSkills.filter(skill => 
                  placedSkills.includes(skill.id)
                ).length * 10}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={resetGame} variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button asChild className="flex-1">
                <Link href="/roadmap">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Learning Roadmap
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skills Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Placed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-red-600">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {currentRole.requiredSkills.map(skill => (
                    <Badge 
                      key={skill.id} 
                      variant={placedSkills.includes(skill.id) ? "default" : "outline"}
                      className={placedSkills.includes(skill.id) ? "" : "opacity-50"}
                    >
                      {placedSkills.includes(skill.id) ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-blue-600">Optional Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {currentRole.optionalSkills.map(skill => (
                    <Badge 
                      key={skill.id} 
                      variant={placedSkills.includes(skill.id) ? "secondary" : "outline"}
                      className={placedSkills.includes(skill.id) ? "" : "opacity-50"}
                    >
                      {placedSkills.includes(skill.id) ? <Star className="h-3 w-3 mr-1" /> : null}
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Challenge</CardTitle>
            <CardDescription>
              Select a job role and build the complete skill set within the time limit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {jobRoles.map(role => (
                <Card 
                  key={role.id} 
                  className={`cursor-pointer transition-colors ${
                    currentRole.id === role.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setCurrentRole(role)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{role.title}</h3>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        {formatTime(role.timeLimit)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                    <div className="flex gap-2 text-xs">
                      <div className="text-red-700 dark:text-red-400">{role.requiredSkills.length} required</div>
            <div className="text-blue-700 dark:text-blue-400">{role.optionalSkills.length} optional</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button onClick={startGame} className="w-full mt-6" size="lg">
              <Zap className="h-4 w-4 mr-2" />
              Start Challenge
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{currentRole.title}</h2>
          <p className="text-muted-foreground">{currentRole.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={timeLeft < 30 ? "destructive" : "outline"} className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(timeLeft)}
          </Badge>
          <Button onClick={useHint} variant="outline" size="sm" disabled={hintsUsed >= 3}>
            <Lightbulb className="h-4 w-4 mr-1" />
            Hint ({3 - hintsUsed})
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <div>Required Skills Progress</div>
          <span>{placedSkills.filter(skillId => 
            currentRole.requiredSkills.some(skill => skill.id === skillId)
          ).length}/{currentRole.requiredSkills.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Available Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Skills</CardTitle>
            <CardDescription>Drag skills to the appropriate sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['technical', 'domain', 'soft'].map(category => (
                <div key={category}>
                  <h4 className="font-medium mb-2 capitalize">{category} Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills
                      .filter(skill => skill.category === category && !placedSkills.includes(skill.id))
                      .map(skill => (
                        <Badge
                          key={skill.id}
                          id={`skill-${skill.id}`}
                          className={`cursor-move ${getCategoryColor(skill.category)}`}
                          draggable
                          onDragStart={() => handleDragStart(skill.id)}
                        >
                          {skill.name}
                        </Badge>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Drop Zones */}
        <div className="space-y-4">
          {/* Required Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-red-600">Required Skills</CardTitle>
              <CardDescription>Essential skills for this role</CardDescription>
            </CardHeader>
            <CardContent
              className="min-h-[120px] border-2 border-dashed border-red-200 rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'required')}
            >
              <div className="flex flex-wrap gap-2">
                {placedSkills
                  .filter(skillId => currentRole.requiredSkills.some(skill => skill.id === skillId))
                  .map(skillId => {
                    const skill = availableSkills.find(s => s.id === skillId);
                    return skill ? (
                      <Badge
                        key={skillId}
                        className="cursor-pointer bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        onClick={() => removeSkill(skillId)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {skill.name}
                      </Badge>
                    ) : null;
                  })
                }
              </div>
            </CardContent>
          </Card>

          {/* Optional Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-600">Optional Skills</CardTitle>
              <CardDescription>Bonus skills for extra points</CardDescription>
            </CardHeader>
            <CardContent
              className="min-h-[120px] border-2 border-dashed border-blue-200 rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'optional')}
            >
              <div className="flex flex-wrap gap-2">
                {placedSkills
                  .filter(skillId => currentRole.optionalSkills.some(skill => skill.id === skillId))
                  .map(skillId => {
                    const skill = availableSkills.find(s => s.id === skillId);
                    return skill ? (
                      <Badge
                        key={skillId}
                        className="cursor-pointer bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        onClick={() => removeSkill(skillId)}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {skill.name}
                      </Badge>
                    ) : null;
                  })
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}