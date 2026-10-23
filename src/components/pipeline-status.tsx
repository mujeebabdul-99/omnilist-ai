import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface PipelineStep {
  label: string;
  status: "complete" | "active" | "pending" | "error";
  detail?: string;
}

const demoSteps: PipelineStep[] = [
  { label: "Prompt", status: "complete", detail: "Parsed intent" },
  { label: "AI Optimize", status: "complete", detail: "Gemini 1.5 Flash" },
  { label: "Draft Review", status: "active", detail: "Awaiting approval" },
  { label: "Job Queue", status: "pending" },
  { label: "Live on eBay", status: "pending" },
];

const stepIcons = {
  complete: CheckCircle2,
  active: Loader2,
  pending: Clock,
  error: AlertTriangle,
};

const stepColors = {
  complete: "text-good bg-good-soft border-good/20",
  active: "text-lime bg-lime-soft border-lime-line",
  pending: "text-t4 bg-surface-3 border-border",
  error: "text-bad bg-bad-soft border-bad/20",
};

const connectorColors = {
  complete: "bg-good/40",
  active: "bg-lime/40",
  pending: "bg-border",
  error: "bg-bad/40",
};

export function PipelineStatus() {
  return (
    <div className="rounded-xl border border-border bg-surface-1 p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-t1">
          Active Pipeline
        </h3>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-lime">
          In Progress
        </span>
      </div>

      {/* Pipeline Steps */}
      <div className="flex items-start gap-0">
        {demoSteps.map((step, i) => {
          const Icon = stepIcons[step.status];
          const colors = stepColors[step.status];

          return (
            <div key={i} className="flex items-start flex-1 min-w-0">
              {/* Step */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300",
                    colors
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      step.status === "active" && "animate-spin"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "mt-2 text-[11px] font-semibold",
                    step.status === "active"
                      ? "text-lime"
                      : step.status === "complete"
                        ? "text-t2"
                        : "text-t4"
                  )}
                >
                  {step.label}
                </span>
                {step.detail && (
                  <span className="text-[10px] text-t4 mt-0.5">
                    {step.detail}
                  </span>
                )}
              </div>

              {/* Connector */}
              {i < demoSteps.length - 1 && (
                <div className="flex-1 flex items-center px-1 mt-4">
                  <div
                    className={cn(
                      "h-[2px] w-full rounded-full transition-all duration-500",
                      connectorColors[step.status]
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
