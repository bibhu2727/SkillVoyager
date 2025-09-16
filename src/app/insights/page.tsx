import { InsightsGenerator } from "@/components/insights/insights-generator";

export default function InsightsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Job Market Insights
        </h1>
        <p className="text-muted-foreground">
          Stay ahead of the curve with AI-powered insights on skills and career trends.
        </p>
      </div>
      <InsightsGenerator />
    </div>
  );
}
