"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useState } from "react";

// Define the application steps
const steps = [
  { id: "step-1", label: "Välj ärendetyp" },
  { id: "step-2", label: "Funktionsnedsättning" },
  { id: "step-3", label: "Grundläggande behov" },
  { id: "step-4", label: "Andra behov" },
  { id: "step-5", label: "Nuvarande stöd" },
  { id: "step-6", label: "Granska och skicka" },
];

export default function SidebarNav({
  currentStep = "step-1",
  completedSteps = [],
  onNavigate = () => {},
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Sidebar className="relative w-64 border-r pt-2">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {steps.map((step) => {
                // Determine if this step is completed or active
                const isCompleted = completedSteps.includes(step.id);
                const isActive = currentStep === step.id;

                // Calculate if this step is accessible
                const previousStepIndex = steps.findIndex((s) => s.id === step.id) - 1;
                const previousStepId = previousStepIndex >= 0 ? steps[previousStepIndex].id : null;
                const isPreviousCompleted = !previousStepId || completedSteps.includes(previousStepId);
                const isAccessible = isActive || isCompleted || isPreviousCompleted;

                return (
                  <SidebarMenuItem key={step.id}>
                    <SidebarMenuButton
                      onClick={() => isAccessible && onNavigate(step.id)}
                      disabled={!isAccessible}
                      className={cn(
                        "w-full justify-start",
                        isActive && "bg-primary/10 text-primary",
                        isCompleted ? "text-green-600" : "text-accent-foreground",
                        !isAccessible && "cursor-not-allowed opacity-50"
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
                              isActive ? "border-primary bg-primary" : "border-border"
                            )}
                          >
                            {isActive && <div className="bg-background h-full w-full rounded-full" />}
                          </div>
                        )}
                      </div>
                      <span className={cn("text-sm", isActive && "font-medium")}>{step.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}