"use client";

import { Heart, Shield, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function AppFooter() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center">
                <div className="text-white font-bold text-sm">SV</div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                SkillVoyager
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your intelligent career companion powered by AI. Navigate your professional journey with confidence and achieve your career goals.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {/* Removed 10K+ professionals and GDPR Compliant badges */}
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-foreground">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">AI-Powered Career Insights</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Personalized Roadmaps</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Interview Simulator</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Skill Gap Analysis</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Resume Builder</li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-foreground">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Help Center</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Contact Us</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Feedback</li>
            </ul>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © 2025 SkillVoyager. All rights reserved.
          </div>

          {/* Credits Section */}
          <div className="flex flex-col items-center md:items-end gap-2">
            {/* Made in India */}
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="bg-gradient-to-r from-orange-500 via-white to-green-500 bg-clip-text text-transparent font-semibold text-gray-800 dark:text-gray-200">
                🇮🇳 Made in India, Made for World
              </span>
            </div>
            
            {/* Creators */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="text-gray-900 dark:text-white">Crafted with</div>
              ❤️
              <div className="text-gray-900 dark:text-white">by</div>
              <div className="flex items-center gap-2">
                <div className="font-medium text-blue-800 dark:text-blue-400">Bibhu</div>
                <div className="text-gray-900 dark:text-white">&</div>
                <div className="font-medium text-purple-800 dark:text-purple-400">Spandan</div>
              </div>
            </div>
            
            {/* Design Philosophy */}
            <div className="text-xs text-muted-foreground/80 italic">
              Stylish • Aesthetic • Fresh Design
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}