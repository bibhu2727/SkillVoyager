"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  FileText,
  GitCommit,
  LayoutDashboard,
  Lightbulb,
  Rocket,
  User,
  Search,
  LogOut,
  Trophy,
  Medal,
  Award,
  Calendar,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  DollarSign,
  Video,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SimpleThemeToggle } from '@/components/ui/theme-toggle';
import { userProfile } from '@/lib/data';
import { cn } from '@/lib/utils';
import { SkillVoyagerLogo } from '@/components/ui/skillvoyager-logo';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/roadmap', label: 'Roadmap', icon: GitCommit },
  { href: '/resume', label: 'Resume', icon: FileText },
  { href: '/interview-simulator', label: 'Interview Simulator', icon: Rocket },
  { href: '/closed-door-interview', label: 'Closed Door Interview', icon: Video },
  { href: '/quiz', label: 'Skill Quiz', icon: Trophy },
  { href: '/games', label: 'Career Games', icon: Bot },
  { href: '/careerguru', label: 'CareerGuru Chat', icon: MessageCircle },
  { href: '/salary-negotiator', label: 'Salary Negotiator', icon: DollarSign },
  { href: '/insights', label: 'Insights', icon: Lightbulb },
  { href: '/skill-gap', label: 'Skill Gap', icon: Search },
];

const quizSubItems = [
  { href: '/quiz/leaderboard', label: 'Leaderboard', icon: Medal },
  { href: '/quiz/achievements', label: 'Achievements', icon: Award },
  { href: '/quiz/daily-challenge', label: 'Daily Challenge', icon: Calendar },
];

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isQuizExpanded, setIsQuizExpanded] = useState(false);
  const pathname = usePathname();
  const { user, logout, updateProfile } = useAuth();

  // Auto-hide menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsQuizExpanded(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      // Close menu on orientation change to prevent layout issues
      setIsOpen(false);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const displayName = user?.name && user.name.trim() !== '' ? user.name : userProfile.name;
  const displayAvatar = user?.avatar || 'https://picsum.photos/100/100';
  const displayCareer = user?.careerAspirations || userProfile.careerAspirations;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateProfile({ avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleQuizSubmenu = () => {
    setIsQuizExpanded(!isQuizExpanded);
  };

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className={cn(
        "md:hidden fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b",
        className
      )}>
        <div className="flex items-center justify-between px-4 py-3">
          <SkillVoyagerLogo 
            size="sm" 
            showText={true}
            clickable={true}
            href="/"
          />
          
          <div className="flex items-center gap-2">
            <SimpleThemeToggle />
            {/* Hamburger Menu Button - 48x48px touch target */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="h-12 w-12 p-0 hover:bg-accent active:bg-accent/80 transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              <div className="relative h-6 w-6">
                <Menu 
                  className={cn(
                    "absolute inset-0 h-6 w-6 transition-all duration-300 ease-in-out",
                    isOpen ? "rotate-180 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                  )} 
                />
                <X 
                  className={cn(
                    "absolute inset-0 h-6 w-6 transition-all duration-300 ease-in-out",
                    isOpen ? "rotate-0 scale-100 opacity-100" : "rotate-180 scale-0 opacity-0"
                  )} 
                />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div className={cn(
        "md:hidden fixed top-0 right-0 bottom-0 z-40 w-80 max-w-[85vw] bg-background border-l shadow-xl transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <SkillVoyagerLogo 
              size="sm" 
              showText={true}
              clickable={true}
              href="/"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="h-10 w-10 hover:bg-accent active:bg-accent/80 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar 
                className="size-12 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" 
                onClick={() => document.getElementById('mobile-avatar-upload')?.click()}
              >
                <AvatarImage src={displayAvatar} alt="User avatar" />
                <AvatarFallback>{displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <input
                id="mobile-avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <div className="flex-1 overflow-hidden">
                <p className="font-medium truncate">{displayName}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {displayCareer}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const isQuizItem = item.href === '/quiz';
                const showQuizSubmenu = isQuizItem && (pathname.startsWith('/quiz') || isQuizExpanded);
                
                return (
                  <div key={item.href}>
                    {/* Main Menu Item */}
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className={cn(
                          "flex-1 flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 min-h-[48px]",
                          "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          isActive 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                            : "text-foreground"
                        )}
                        onClick={() => !isQuizItem && setIsOpen(false)}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <div className="truncate text-gray-900 dark:text-white">{item.label}</div>
                      </Link>
                      
                      {/* Quiz Submenu Toggle */}
                      {isQuizItem && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleQuizSubmenu}
                          className="h-12 w-12 ml-1 hover:bg-accent active:bg-accent/80 transition-colors"
                          aria-label={isQuizExpanded ? 'Collapse quiz menu' : 'Expand quiz menu'}
                          aria-expanded={isQuizExpanded}
                        >
                          {isQuizExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Quiz Submenu */}
                    {showQuizSubmenu && (
                      <div className={cn(
                        "ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                        isQuizExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}>
                        {quizSubItems.map((subItem) => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 min-h-[44px]",
                                "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                isSubActive 
                                  ? "bg-primary/10 text-primary font-medium" 
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                              onClick={() => setIsOpen(false)}
                            >
                              <subItem.icon className="h-4 w-4 shrink-0" />
                              <div className="truncate">{subItem.label}</div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Menu Footer */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className={cn(
                  "flex-1 flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 min-h-[48px]",
                  "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  pathname === '/profile' 
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                <User className="h-5 w-5 shrink-0" />
                <div>Profile Settings</div>
              </Link>
              
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="h-12 w-12 hover:bg-destructive/10 hover:text-destructive active:bg-destructive/20 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for mobile header */}
      <div className="md:hidden h-16" />
    </>
  );
}