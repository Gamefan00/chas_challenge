"use client";
import { useState, useEffect } from "react";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
  const [localCompletedSteps, setLocalCompletedSteps] = useState(completedSteps);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Check localStorage on mount and when props change
  useEffect(() => {
    let updatedCompletedSteps = [...completedSteps];
    // Check if there's data in localStorage
    if (typeof window !== "undefined") {
      const savedCompletedSteps = localStorage.getItem("completedSteps");
      if (savedCompletedSteps) {
        try {
          const parsedSteps = JSON.parse(savedCompletedSteps);
          if (Array.isArray(parsedSteps)) {
            // Merge with current completed steps
            updatedCompletedSteps = [...new Set([...updatedCompletedSteps, ...parsedSteps])];
          }
        } catch (e) {
          console.error("Error parsing completed steps from localStorage");
        }
      }
    }

    // Update localStorage
    setLocalCompletedSteps(updatedCompletedSteps);
  }, [completedSteps, currentStep]);

  // Listen for custom stepsCompleted event
  useEffect(() => {
    const handleStepCompleted = (event) => {
      const { step } = event.detail;

      if (!localCompletedSteps.includes(step)) {
        const updatedSteps = [...localCompletedSteps, step];
        setLocalCompletedSteps(updatedSteps);

        if (typeof window !== "undefined") {
          localStorage.setItem("completedSteps", JSON.stringify(updatedSteps));
        }
      }
    };
    window.addEventListener("stepCompleted", handleStepCompleted);
    return () => {
      window.removeEventListener("stepCompleted", handleStepCompleted);
    };
  }, [localCompletedSteps]);

  // Handling for last step
  useEffect(() => {
    const isLastStepActive = currentStep === "step-6";
    if (isLastStepActive) {
      // Check if the previous step is completed
      const isPreviousStepCompleted = localCompletedSteps.includes("step-5");

      // Only auto-complete the last step if the previous step is completed
      if (isPreviousStepCompleted && !localCompletedSteps.includes("step-6")) {
        // add last step to completed steps
        const updatedSteps = [...localCompletedSteps, "step-6"];
        setLocalCompletedSteps(updatedSteps);

        if (typeof window !== "undefined") {
          localStorage.setItem("completedSteps", JSON.stringify(updatedSteps));
        }

        // Notify parent component
        const event = new CustomEvent("stepCompleted", { detail: { step: "step-6" } });
        window.dispatchEvent(event);
      }
    }
  }, [currentStep, localCompletedSteps]);

  // Close sidebar when clicking outside in mobile view
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isSidebarOpen) {
        // Check if the click is outside the sidebar
        const sidebarElement = document.querySelector(".sidebar-container");
        const toggleButton = document.querySelector(".toggle-button");

        if (
          sidebarElement &&
          !sidebarElement.contains(event.target) &&
          toggleButton &&
          !toggleButton.contains(event.target)
        ) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);

  return (
    <div className="flex">
      {/* Toggle button outside sidebar - visible when sidebar is closed */}
      {!isSidebarOpen && (
        <div className="absolute z-20 mt-2 ml-2">
          <SidebarTrigger onClick={() => setSidebarOpen(true)} className="toggle-button" />
        </div>
      )}

      {/* Sidebar with conditional rendering for width */}
      <div
        className={cn(
          "sidebar-container transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden",
          isMobile && isSidebarOpen ? "absolute top-0 left-0 z-40 h-full" : "",
        )}
      >
        <Sidebar className="relative w-64">
          {isSidebarOpen && (
            <div className="relative z-10 mt-2 ml-2">
              <SidebarTrigger onClick={() => setSidebarOpen(false)} className="toggle-button" />
            </div>
          )}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {steps.map((step) => {
                    // Determine if this step is completed or active
                    const isCompleted = localCompletedSteps.includes(step.id);
                    const isActive = currentStep === step.id;

                    // Calculate if this step is accessible
                    const previousStepIndex = steps.findIndex((s) => s.id === step.id) - 1;
                    const previousStepId =
                      previousStepIndex >= 0 ? steps[previousStepIndex].id : null;
                    const isPreviousCompleted =
                      !previousStepId || localCompletedSteps.includes(previousStepId);
                    const isAccessible = isActive || isCompleted || isPreviousCompleted;

                    const forceShowCompleted = step.id === "step-6" && isActive;

                    return (
                      <SidebarMenuItem key={step.id}>
                        <SidebarMenuButton
                          onClick={() => isAccessible && onNavigate(step.id)}
                          disabled={!isAccessible}
                          className={cn(
                            "w-full justify-start",
                            isActive && "bg-primary/10 text-primary",
                            isCompleted ? "text-green-600" : "text-accent-foreground",
                            !isAccessible && "cursor-not-allowed opacity-50",
                          )}
                        >
                          <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center">
                            {isCompleted || forceShowCompleted ? (
                              // Green circle with white checkmark
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                                <Check className="h-3 w-3 text-white" strokeWidth={3} />
                              </div>
                            ) : (
                              <div
                                className={cn(
                                  "h-5 w-5 rounded-full border-2",
                                  isActive ? "border-primary bg-primary" : "border-border",
                                )}
                              >
                                {isActive && (
                                  <div className="bg-background h-full w-full rounded-full" />
                                )}
                              </div>
                            )}
                          </div>
                          <span className={cn("text-sm", isActive && "font-medium")}>
                            {step.label}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </div>
  );
}
