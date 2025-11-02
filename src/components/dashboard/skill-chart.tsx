"use client";

import {
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { userProfile } from "@/lib/data";
import { useAuth } from "@/contexts/auth-context";
import { useMemo } from "react";

const chartConfig = {
  level: {
    label: "Proficiency",
    color: "hsl(var(--primary))",
  },
};

export function SkillChart() {
  const { user } = useAuth();
  
  const chartData = useMemo(() => {
    // Use user skills from auth context if available, otherwise fall back to static data
    const skills = user?.currentSkills || userProfile.currentSkills;
    
    if (!skills || skills.length === 0) {
      // Return default message if no skills
      return [
        { 
          skill: "Add Skills in Profile", 
          level: 20,
          fullName: "Add Skills in Profile",
          proficiency: "Beginner" as const
        },
        { 
          skill: "Complete Your Profile", 
          level: 20,
          fullName: "Complete Your Profile",
          proficiency: "Beginner" as const
        },
        { 
          skill: "Start Learning", 
          level: 20,
          fullName: "Start Learning",
          proficiency: "Beginner" as const
        },
      ];
    }
    
    // Map proficiency to meaningful numeric levels (0-100 scale)
    const proficiencyToLevel = {
      "Beginner": 35,      // 35% - Learning the basics
      "Intermediate": 65,  // 65% - Solid understanding
      "Advanced": 90       // 90% - Expert level
    };
    
    // Ensure we have at least 3 skills for a good radar chart
    const chartSkills = skills.map(skill => ({
      skill: skill.name.length > 15 ? skill.name.substring(0, 15) + "..." : skill.name,
      level: proficiencyToLevel[skill.proficiency],
      fullName: skill.name,
      proficiency: skill.proficiency
    }));
    
    // If user has fewer than 3 skills, suggest adding more
    while (chartSkills.length < 3) {
      chartSkills.push({
        skill: `Add Skill ${chartSkills.length + 1}`,
        level: 10,
        fullName: `Add Skill ${chartSkills.length + 1}`,
        proficiency: "Beginner" as const
      });
    }
    
    return chartSkills;
  }, [user?.currentSkills]);

  return (
    <div className="space-y-4">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-[250px] sm:h-[350px]"
      >
        <RadarChart data={chartData}>
          <ChartTooltip
            cursor={false}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="font-medium">{data.fullName}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">
                          Level: {data.proficiency}
                        </div>
                        <div className="text-sm font-medium">
                          {data.level}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
          />
          <Radar
            dataKey="level"
            fill="var(--color-level)"
            fillOpacity={0.3}
            stroke="var(--color-level)"
            strokeWidth={2}
          />
        </RadarChart>
      </ChartContainer>
      
      {/* Skills Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
        {chartData.map((skill, index) => (
          <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: "hsl(var(--primary))" }}
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{skill.fullName}</div>
              <div className="text-xs text-muted-foreground">
                {skill.proficiency} ({skill.level}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
