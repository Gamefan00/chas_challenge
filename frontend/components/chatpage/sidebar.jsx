"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// Define the application steps
const steps = [
  { id: "step-1", label: "Välj ärendtyp" },
  { id: "step-2", label: "Funktionsnedsättning" },
  { id: "step-3", label: "Grundläggande behov" },
  { id: "step-4", label: "Andra behov" },
  { id: "step-5", label: "Nuvarande stöd" },
  { id: "step-6", label: "Granska och skicka" },
];

export default function Sidebar({
  currentStep = "step-1",
  completedSteps = [],
  onNavigate = () => {},
}) {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-white p-4">
      <nav className="flex flex-col space-y-1">
        {steps.map((step) => {
          // Determine if this step is completed or active
          const isCompleted = completedSteps.includes(step.id);
          const isActive = currentStep === step.id;

          // Calculate if this step is accessible
          // A step is accessible if it's the current step, completed, or follows a completed step
          const previousStepIndex = steps.findIndex((s) => s.id === step.id) - 1;
          const previousStepId = previousStepIndex >= 0 ? steps[previousStepIndex].id : null;
          const isPreviousCompleted = !previousStepId || completedSteps.includes(previousStepId);
          const isAccessible = isActive || isCompleted || isPreviousCompleted;

          return (
            <button
              key={step.id}
              onClick={() => isAccessible && onNavigate(step.id)}
              disabled={!isAccessible}
              className={cn(
                "flex items-center rounded-full px-3 py-2 text-left transition-colors",
                isActive && "bg-blue-100",
                isCompleted ? "text-green-600" : "text-accent-foreground",
                !isAccessible && "cursor-not-allowed opacity-50",
              )}
            >
              <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center">
                {isCompleted ? (
                  // Green circle with white checkmark
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2",
                      isActive ? "border-primary bg-primary" : "border-gray-300",
                    )}
                  >
                    {isActive && <div className="h-full w-full rounded-full bg-white" />}
                  </div>
                )}
              </div>
              <span className={cn("text-sm", isActive && "font-medium")}>{step.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
