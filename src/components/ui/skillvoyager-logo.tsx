"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillVoyagerLogoProps {
  /**
   * Size variant for the logo
   * - sm: Small size for mobile headers
   * - md: Medium size for desktop sidebar
   * - lg: Large size for landing pages
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether to show the text label alongside the icon
   */
  showText?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Whether the logo should be clickable (redirects to dashboard)
   */
  clickable?: boolean;
  
  /**
   * Custom redirect path (defaults to dashboard "/")
   */
  href?: string;
}

/**
 * Responsive SkillVoyager Logo Component
 * 
 * Features:
 * - Fully responsive design with multiple size variants
 * - Smooth hover and click animations
 * - Accessible keyboard navigation
 * - Dashboard redirect functionality
 * - Optimized touch targets for mobile devices
 */
export function SkillVoyagerLogo({
  size = 'md',
  showText = true,
  className,
  clickable = true,
  href = '/'
}: SkillVoyagerLogoProps) {
  const [isPressed, setIsPressed] = useState(false);
  const router = useRouter();

  // Size configurations for responsive design
  const sizeConfig = {
    sm: {
      icon: 'size-5',
      text: 'text-sm',
      container: 'gap-1.5',
      touchTarget: 'min-h-[44px] min-w-[44px]' // iOS/Android minimum touch target
    },
    md: {
      icon: 'size-6',
      text: 'text-base',
      container: 'gap-2',
      touchTarget: 'min-h-[48px] min-w-[48px]'
    },
    lg: {
      icon: 'size-8',
      text: 'text-xl',
      container: 'gap-3',
      touchTarget: 'min-h-[56px] min-w-[56px]'
    }
  };

  const config = sizeConfig[size];

  const handleClick = () => {
    if (clickable) {
      // Add smooth transition effect
      setIsPressed(true);
      setTimeout(() => {
        router.push(href);
        setIsPressed(false);
      }, 150);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  };

  const logoContent = (
    <div
      className={cn(
        'flex items-center justify-center transition-all duration-200 ease-out',
        config.container,
        config.touchTarget,
        clickable && [
          'cursor-pointer select-none',
          'hover:scale-105 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
          'rounded-lg p-1',
          isPressed && 'scale-95'
        ],
        className
      )}
      onClick={clickable ? handleClick : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
      tabIndex={clickable ? 0 : -1}
      role={clickable ? 'button' : undefined}
      aria-label={clickable ? 'Go to Dashboard' : 'SkillVoyager Logo'}
    >
      {/* Icon with gradient background */}
      <div className={cn(
        'flex items-center justify-center rounded-lg transition-all duration-200',
        'bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600',
        'shadow-sm',
        clickable && 'hover:shadow-md hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700',
        size === 'sm' && 'p-1',
        size === 'md' && 'p-1.5',
        size === 'lg' && 'p-2'
      )}>
        <Bot className={cn(config.icon, 'text-white')} />
      </div>
      
      {/* Text Label */}
      {showText && (
        <div className={cn(
          'font-semibold tracking-tight transition-colors duration-200',
          'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent',
          clickable && 'hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700',
          config.text
        )}>
          SkillVoyager
        </div>
      )}
    </div>
  );

  // If clickable, wrap in Link for better SEO and navigation
  if (clickable) {
    return (
      <Link 
        href={href} 
        className="inline-block"
        tabIndex={-1} // Let the inner div handle focus
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}

/**
 * Preset logo variants for common use cases
 */
export const LogoVariants = {
  // Mobile header logo
  MobileHeader: () => (
    <SkillVoyagerLogo 
      size="sm" 
      showText={true}
      className="md:hidden"
    />
  ),
  
  // Desktop sidebar logo
  DesktopSidebar: () => (
    <SkillVoyagerLogo 
      size="md" 
      showText={true}
      className="hidden md:flex"
    />
  ),
  
  // Compact icon-only version
  IconOnly: ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => (
    <SkillVoyagerLogo 
      size={size} 
      showText={false}
    />
  ),
  
  // Large landing page logo
  Hero: () => (
    <SkillVoyagerLogo 
      size="lg" 
      showText={true}
      clickable={false}
    />
  )
};