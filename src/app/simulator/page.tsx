import { SimulatorCard } from "@/components/simulator/simulator-card";

export default function SimulatorPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          AI Career Simulator
        </h1>
        <p className="text-muted-foreground">
          Look into your professional future. Predict your role, salary, and needed skills.
        </p>
      </div>
      <SimulatorCard />
    </div>
  );
}
