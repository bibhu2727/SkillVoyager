'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { SkillChart } from '@/components/dashboard/skill-chart';
import { ReadinessScore } from '@/components/dashboard/readiness-score';
import { userProfile } from '@/lib/data';
import {
  ArrowRight,
  FileText,
  GitCommit,
  Lightbulb,
  Rocket,
  Search,
  Brain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useMemo } from 'react';

// Function to calculate job readiness based on profile data
const calculateJobReadiness = (currentSkills: any[], careerAspirations: string, experience: string) => {
  let score = 0;
  
  // Base score from skills (40% of total)
  if (currentSkills && currentSkills.length > 0) {
    const skillScore = currentSkills.reduce((acc, skill) => {
      switch (skill.proficiency) {
        case 'Advanced': return acc + 15;
        case 'Intermediate': return acc + 10;
        case 'Beginner': return acc + 5;
        default: return acc;
      }
    }, 0);
    score += Math.min(skillScore, 40); // Cap at 40 points
  }
  
  // Career clarity bonus (20% of total)
  if (careerAspirations && careerAspirations.trim().length > 0) {
    score += 20;
  }
  
  // Experience bonus (30% of total)
  if (experience && experience.trim().length > 0) {
    const experienceLength = experience.trim().length;
    if (experienceLength > 200) score += 30;
    else if (experienceLength > 100) score += 20;
    else if (experienceLength > 50) score += 15;
    else score += 10;
  }
  
  // Skill diversity bonus (10% of total)
  if (currentSkills && currentSkills.length >= 5) {
    score += 10;
  } else if (currentSkills && currentSkills.length >= 3) {
    score += 5;
  }
  
  return Math.min(Math.max(score, 0), 100); // Ensure score is between 0-100
};

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Use authenticated user's name, fallback to userProfile.name if not logged in
  const displayName = user?.name && user.name.trim() ? user.name : userProfile.name;
  
  // Calculate dynamic job readiness score
  const jobReadinessScore = useMemo(() => {
    const currentSkills = user?.currentSkills || userProfile.currentSkills;
    const careerAspirations = user?.careerAspirations || userProfile.careerAspirations;
    const experience = user?.experience || userProfile.experience;
    
    return calculateJobReadiness(currentSkills, careerAspirations, experience);
  }, [user?.currentSkills, user?.careerAspirations, user?.experience]);
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <WelcomeHeader name={displayName} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skill Constellation</CardTitle>
            <CardDescription>
              Your skills mapped as a constellation - add more skills in your profile to expand your universe!
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <SkillChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Job Readiness</CardTitle>
            <CardDescription>
              Your estimated readiness for your target role.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <ReadinessScore score={jobReadinessScore} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          href="/roadmap"
          icon={<GitCommit className="size-8 text-primary" />}
          title="Personalized Roadmap"
          description="Generate a step-by-step learning path to your dream job."
        />
        <FeatureCard
          href="/resume"
          icon={<FileText className="size-8 text-primary" />}
          title="AI Resume Builder"
          description="Tailor your resume and beat the ATS."
        />
        <FeatureCard
          href="/simulator"
          icon={<Rocket className="size-8 text-primary" />}
          title="Career Simulator"
          description="Predict your future role and salary in 1, 3, or 5 years."
        />
        <FeatureCard
          href="/insights"
          icon={<Lightbulb className="size-8 text-primary" />}
          title="Market Insights"
          description="Discover trending skills and alternative career paths."
        />
        <FeatureCard
          href="/skill-gap"
          icon={<Search className="size-8 text-primary" />}
          title="Skill Gap Analysis"
          description="Identify the skills you need for your dream job."
        />
        <FeatureCard
          href="/quiz"
          icon={<Brain className="size-8 text-primary" />}
          title="Skill Quiz"
          description="Test your knowledge and track your progress."
        />
      </div>
    </div>
  );
}

function FeatureCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="flex-row items-start gap-4 space-y-0">
        <div className="flex-shrink-0">{icon}</div>
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="mt-auto">
        <Button asChild variant="outline" className="w-full">
          <Link href={href}>
            Get Started <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
