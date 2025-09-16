"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Rocket,
  Puzzle,
  Trophy,
  Clock,
  Target,
  Lightbulb,
  Play,
  RotateCcw,
} from 'lucide-react';
import { CareerSimulator } from './career-simulator';
import { SkillPuzzleGame } from './skill-puzzle-game';

export function GamesHub() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games = [
    {
      id: 'career-simulator',
      title: '🎲 Career Simulator',
      description: 'Navigate through real career scenarios and make strategic decisions',
      icon: Rocket,
      features: [
        'Choose-your-own-adventure style',
        'Real career scenarios',
        'Immediate feedback on decisions',
        'AI Career Analysis links'
      ],
      difficulty: 'Beginner',
      estimatedTime: '10-15 min',
      component: CareerSimulator
    },
    {
      id: 'skill-puzzle',
      title: '🧩 Skill Building Puzzle',
      description: 'Build complete skill sets for target jobs through drag-and-drop challenges',
      icon: Puzzle,
      features: [
        'Visual skill tree completion',
        'Time-based challenges',
        'Hint system with learning roadmaps',
        'Progress visualization'
      ],
      difficulty: 'Intermediate',
      estimatedTime: '15-20 min',
      component: SkillPuzzleGame
    }
  ];

  if (activeGame) {
    const game = games.find(g => g.id === activeGame);
    if (game) {
      const GameComponent = game.component;
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <game.icon className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">{game.title}</h2>
                <p className="text-muted-foreground">{game.description}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setActiveGame(null)}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Back to Games
            </Button>
          </div>
          
          <GameComponent onExit={() => setActiveGame(null)} />
        </div>
      );
    }
  }

  return (
    <div className="space-y-8">
      {/* Games Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        {games.map((game) => {
          const IconComponent = game.icon;
          return (
            <Card key={game.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{game.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {game.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {game.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {game.estimatedTime}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Features
                  </h4>
                  <ul className="space-y-1">
                    {game.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button
                  onClick={() => setActiveGame(game.id)}
                  className="w-full flex items-center gap-2"
                  size="lg"
                >
                  <Play className="h-4 w-4" />
                  Start Game
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold">Achievements</h3>
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">Unlocked</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">Games Played</h3>
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">Total Sessions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Lightbulb className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">Skills Learned</h3>
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">New Insights</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}