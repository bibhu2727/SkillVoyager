'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
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
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { userProfile } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { SimpleThemeToggle } from '@/components/ui/theme-toggle';
import { SkillVoyagerLogo } from '@/components/ui/skillvoyager-logo';
import '@/lib/init-demo-user';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/roadmap', label: 'Roadmap', icon: GitCommit },
  { href: '/resume', label: 'Resume', icon: FileText },
  { href: '/interview-simulator', label: 'Interview Simulator', icon: Rocket },
  { href: '/quiz', label: 'Skill Quiz', icon: Trophy },
  { href: '/games', label: 'Career Games', icon: Bot },
  { href: '/careerguru', label: 'CareerGuru Chat', icon: MessageCircle },
  { href: '/insights', label: 'Insights', icon: Lightbulb },
  { href: '/skill-gap', label: 'Skill Gap', icon: Search },
];

const quizSubItems = [
  { href: '/quiz/leaderboard', label: 'Leaderboard', icon: Medal },
  { href: '/quiz/achievements', label: 'Achievements', icon: Award },
  { href: '/quiz/daily-challenge', label: 'Daily Challenge', icon: Calendar },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user, logout, updateProfile } = useAuth();
  
  // Use authenticated user data or fallback to static profile
  // Debug: Log user data to console
  console.log('Current user in sidebar:', user);
  
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

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between w-full">
          <SkillVoyagerLogo 
            size="md" 
            showText={true}
            clickable={true}
            href="/"
          />
          <div className="ml-auto">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <div className="text-gray-900 dark:text-white">{item.label}</div>
                </Link>
              </SidebarMenuButton>
              {item.href === '/quiz' && pathname.startsWith('/quiz') && (
                <SidebarMenu className="ml-4 mt-1">
                  {quizSubItems.map((subItem) => (
                    <SidebarMenuItem key={subItem.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === subItem.href}
                        size="sm"
                        tooltip={{ children: subItem.label, side: 'right' }}
                      >
                        <Link href={subItem.href}>
                          <subItem.icon className="h-4 w-4" />
                          <div>{subItem.label}</div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-3 px-2 py-1.5">
          <Avatar className="size-8 cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
            <AvatarImage src={displayAvatar} alt="User avatar" />
            <AvatarFallback>{displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <input
             id="avatar-upload"
             type="file"
             accept="image/*"
             className="hidden"
             onChange={handleAvatarUpload}
          />
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {displayCareer}
            </p>
          </div>
          <div className="flex gap-1">
            <SimpleThemeToggle />
            <SidebarMenuButton
              asChild
              size="icon"
              variant="ghost"
              className="size-8"
              tooltip={{ children: 'Profile Settings', side: 'right' }}
            >
              <Link href="/profile">
                <User />
              </Link>
            </SidebarMenuButton>
            {user && (
              <SidebarMenuButton
                size="icon"
                variant="ghost"
                className="size-8"
                tooltip={{ children: 'Sign Out', side: 'right' }}
                onClick={logout}
              >
                <LogOut />
              </SidebarMenuButton>
            )}
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
