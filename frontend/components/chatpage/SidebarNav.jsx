"use client";
import { useState, useEffect } from "react";

import { Check, Trash2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// Define the application steps
const steps = [
  { id: "step-1", label: "Välj ärendetyp" },
  { id: "step-2", label: "Funktionsnedsättning" },
  { id: "step-3", label: "Grundläggande behov" },
  { id: "step-4", label: "Andra behov" },
  { id: "step-5", label: "Nuvarande stöd" },
  { id: "step-6", label: "Granska och skicka" },
];

const interviewSteps = [
  {
    id: "step-1",
    label: "Beskriv dig själv",
    heading: "Kan du kort berätta om dig själv och din nuvarande arbetssituation?",
  },
  {
    id: "step-2",
    label: "Diagnos och påverkan",
    heading: "Vilken funktionsnedsättning har du, och hur påverkar den dig i arbetslivet?",
  },
  {
    id: "step-3",
    label: "Utmaningar i arbetet",
    heading: "Vilka arbetsuppgifter har du svårast med på grund av din funktionsnedsättning?",
  },
  {
    id: "step-4",
    label: "Tidigare hjälpmedel",
    heading: "Har du använt några hjälpmedel tidigare? Vad fungerade bra/dåligt?",
  },
  {
    id: "step-5",
    label: "Arbetsmiljö",
    heading: "Hur ser din fysiska och sociala arbetsmiljö ut idag?",
  },
  {
    id: "step-6",
    label: "Kommunikation och samspel",
    heading: "Har du behov av stöd i kommunikation eller samspel med kollegor eller kunder?",
  },
];

export default function SidebarNav({
  currentStep = "step-1",
  completedSteps = [],
  onNavigate = () => {},
  type = "",
}) {
  const [localCompletedSteps, setLocalCompletedSteps] = useState(completedSteps);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const selectedSteps = type === "interview" ? interviewSteps : steps;

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);

      if (!isNowMobile && !isMobile) {
        // If the sidebar is closed and the screen is resized to desktop, open it
        setIsSidebarOpen(true);
      }

      if (isNowMobile && !isMobile) {
        // If the sidebar is open and the screen is resized to mobile, close it
        setIsSidebarOpen(false);
      }
    };
    handleResize(); // Initial check

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Desktop view
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
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
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);

  const handleStepClick = (stepId) => {
    if (isMobile) {
      setIsSidebarOpen(true);
    }
    onNavigate(stepId);
  };
  // console.log("isMobile", isMobile);
  // console.log("isSidebarOpen", isSidebarOpen);

  return (
    <div className="flex flex-col">
      {/* Toggle button outside sidebar - visible when sidebar is closed */}

      <div className={cn(`absolute z-20 mt-2 ml-2`, isSidebarOpen && "hidden")}>
        <SidebarTrigger onClick={() => setIsSidebarOpen(true)} className="toggle-button" />
      </div>

      {/* Sidebar with conditional rendering for width */}
      <div
        className={cn(
          "sidebar-container sticky top-0 h-[90vh] flex-1 overflow-hidden",
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden",
          isMobile && isSidebarOpen ? "absolute top-0 left-0 z-40" : "",
        )}
      >
        <Sidebar className="relative flex w-64 flex-col transition-opacity duration-500">
          <div className="relative z-10 mt-2 ml-2">
            <SidebarTrigger onClick={() => setIsSidebarOpen(false)} className="toggle-button" />
          </div>

          <SidebarContent className="flex h-full flex-col justify-between">
            <SidebarGroup>
              <SidebarGroupContent>
                <div className="">
                  <SidebarMenu>
                    {selectedSteps.map((step) => {
                      // Determine if this step is completed or active
                      const isCompleted = localCompletedSteps.includes(step.id);
                      const isActive = currentStep === step.id;

                      // Calculate if this step is accessible
                      const previousStepIndex =
                        selectedSteps.findIndex((s) => s.id === step.id) - 1;
                      const previousStepId =
                        previousStepIndex >= 0 ? selectedSteps[previousStepIndex].id : null;
                      const isPreviousCompleted =
                        !previousStepId || localCompletedSteps.includes(previousStepId);
                      const isAccessible = isActive || isCompleted || isPreviousCompleted;

                      const forceShowCompleted = step.id === "step-6" && isActive;

                      return (
                        <SidebarMenuItem key={step.id}>
                          <SidebarMenuButton
                            onClick={() =>
                              isAccessible && handleStepClick(step.id) && setIsSidebarOpen(false)
                            }
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
                                    <div className="bg-background w-full rounded-full" />
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
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
            <div className="">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="p-4">
                    <Button variant="ghost" className="w-full justify-start hover:shadow-md">
                      {" "}
                      <Trash2 className="mr-2 h-5 w-5" />
                      <span> Återställ chatt</span>
                    </Button>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Är du helt säker?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Denna åtgärd kan inte ångras. Detta kommer att permanent radera din
                      chatthistorik från våra servrar.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Avbryt</AlertDialogCancel>
                    <AlertDialogAction>Fortsätt</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </SidebarContent>
        </Sidebar>
      </div>
    </div>
  );
}
