import { ResumeBuilder } from "@/components/resume/resume-builder";

export default function ResumePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="space-y-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          AI Resume Builder
        </h1>
        <p className="text-muted-foreground">
          Create a standout resume tailored to any job description.
        </p>
      </div>
      <ResumeBuilder />
    </div>
  );
}
