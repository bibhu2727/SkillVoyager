"use client";

import { useState, useEffect } from 'react';
import { X, Sparkles, Target, Brain, Rocket, Shield, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface CookieConsentProps {
  onAccept: () => void;
}

export function CookieConsent({ onAccept }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const hasAccepted = localStorage.getItem('skillvoyager-cookie-consent');
    if (!hasAccepted) {
      setTimeout(() => setIsVisible(true), 800);
    }
  }, []);

  const handleAccept = () => {
    setIsAnimating(true);
    localStorage.setItem('skillvoyager-cookie-consent', 'true');
    setTimeout(() => {
      setIsVisible(false);
      onAccept();
    }, 400);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => setIsVisible(false), 400);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <Card 
        className={cn(
          "w-full max-w-4xl max-h-[90vh] mx-auto transform transition-all duration-500 ease-out overflow-hidden",
          isAnimating ? "scale-90 opacity-0 translate-y-8" : "scale-100 opacity-100 translate-y-0",
          "border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
          "ring-1 ring-gray-200/50 dark:ring-gray-700/50"
        )}
      >
        {/* Header Section */}
        <CardHeader className="relative pb-6 pt-8 px-8">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 h-9 w-9 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 mb-4 shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome to SkillVoyager
            </CardTitle>
            <CardDescription className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Your intelligent career companion powered by AI
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8 space-y-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Mission Statement */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Our Mission</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto text-lg">
              We're democratizing career growth by making professional development accessible to everyone. 
              Our AI-powered platform provides personalized roadmaps, skill assessments, and interview preparation 
              to help you navigate your career journey with confidence.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/30 hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">AI-Powered Insights</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Smart recommendations and personalized guidance tailored to your career goals
              </p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20 border border-green-200/50 dark:border-green-800/30 hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Career Roadmaps</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Step-by-step learning paths designed to get you to your dream job
              </p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 border border-purple-200/50 dark:border-purple-800/30 hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Interview Practice</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Real-time feedback and performance analytics to ace your interviews
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Privacy & Trust Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/30 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-600 dark:bg-gray-400">
                  <Shield className="h-5 w-5 text-white dark:text-gray-900" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Privacy & Data Protection</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                  We use essential cookies to enhance your experience and remember your preferences. 
                  Your data is encrypted, secure, and never shared with third parties.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800">
                    <Shield className="w-3 h-3 mr-1" />
                    Secure & Encrypted
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                    Essential Cookies Only
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                    No Third-Party Tracking
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              onClick={handleAccept}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              size="lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start My Career Journey
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="sm:w-auto h-12 px-8 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Maybe Later
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-gray-600 dark:text-gray-400">
            {/* Removed 10K+ professionals and GDPR Compliant badges */}
          </div>

          {/* Footer Credits */}
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6 mt-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-300">
                🇮🇳 Made in India, Made for World
              </div>
              <div className="flex items-center justify-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                Crafted with ❤️ by
                <div className="flex items-center gap-2">
                  <div className="font-medium text-blue-700 dark:text-blue-400">Bibhu</div>
                  &
                  <div className="font-medium text-purple-700 dark:text-purple-400">Spandan</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 italic">
                Stylish • Aesthetic • Fresh Design
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}