import { RoadmapGenerator } from "@/components/roadmap/roadmap-generator";

export default function RoadmapPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Personalized Learning Roadmap
        </h1>
        <p className="text-muted-foreground">
          Let our AI craft the perfect step-by-step guide to your dream career.
        </p>
      </div>
      <RoadmapGenerator />
    </div>
  );
}
