import { SkillGapAnalyzer } from '@/components/skill-gap/skill-gap-analyzer';

export default function SkillGapPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Skill Gap Analysis
        </h1>
        <p className="text-muted-foreground">
          Identify the skills you need to land your dream job.
        </p>
      </div>
      <SkillGapAnalyzer />
    </div>
  );
}
