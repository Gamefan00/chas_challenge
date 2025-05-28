"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
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
  { id: "step-6", label: "Sammanfattning" },
];

const interviewSteps = [
  {
    id: "step-1",
    label: "Grundläggande info",
    heading: "Kan du kort berätta om arbetssituationen och bakgrunden?",
  },
  {
    id: "step-2",
    label: "Funktionsnedsättning",
    heading: "Vilken funktionsnedsättning gäller, och hur påverkar den arbetet?",
  },
  {
    id: "step-3",
    label: "Arbetsutmaningar",
    heading: "Vilka arbetsuppgifter är mest utmanande på grund av funktionsnedsättningen?",
  },
  {
    id: "step-4",
    label: "Tidigare erfarenheter",
    heading: "Har det använts några hjälpmedel tidigare? Vad fungerade bra/dåligt?",
  },
  {
    id: "step-5",
    label: "Arbetsmiljö",
    heading: "Hur ser den fysiska och sociala arbetsmiljön ut idag?",
  },
  {
    id: "step-6",
    label: "Kommunikation ",
    heading: "Finns det behov av stöd i kommunikation eller samspel med kollegor eller kunder?",
  },
];

export default function SidebarNav({
  currentStep = "step-1",
  completedSteps = [],
  onNavigate = () => {},
  type = "",
  onSidebarToggle = () => {},
}) {
  const [localCompletedSteps, setLocalCompletedSteps] = useState(completedSteps);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const getLocalStorageKeys = (type) => {
    if (type === "interview") {
      return {
        currentStepKey: "interviewCurrentStep",
        completedStepsKey: "interviewCompletedSteps",
      };
    } else {
      return {
        currentStepKey: "applicationCurrentStep",
        completedStepsKey: "applicationCompletedSteps",
      };
    }
  };
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

  // Communicate sidebar state to parent
  useEffect(() => {
    onSidebarToggle(isSidebarOpen && !isMobile);
  }, [isSidebarOpen, isMobile, onSidebarToggle]);

  // Check localStorage on mount and when props change
  useEffect(() => {
    let updatedCompletedSteps = [...completedSteps];

    if (typeof window !== "undefined") {
      const { completedStepsKey } = getLocalStorageKeys(type);
      const savedCompletedSteps = localStorage.getItem(completedStepsKey);

      if (savedCompletedSteps) {
        try {
          const parsedSteps = JSON.parse(savedCompletedSteps);
          if (Array.isArray(parsedSteps)) {
            updatedCompletedSteps = [...new Set([...updatedCompletedSteps, ...parsedSteps])];
          }
        } catch (e) {
          console.error(`Error parsing ${completedStepsKey} from localStorage`);
        }
      }
    }

    setLocalCompletedSteps(updatedCompletedSteps);
  }, [completedSteps, currentStep, type]);

  // Listen for custom stepsCompleted event
  useEffect(() => {
    const handleStepCompleted = (event) => {
      const { step } = event.detail;

      if (!localCompletedSteps.includes(step)) {
        const updatedSteps = [...localCompletedSteps, step];
        setLocalCompletedSteps(updatedSteps);

        if (typeof window !== "undefined") {
          const { completedStepsKey } = getLocalStorageKeys(type);
          localStorage.setItem(completedStepsKey, JSON.stringify(updatedSteps));
        }
      }
    };

    window.addEventListener("stepCompleted", handleStepCompleted);
    return () => {
      window.removeEventListener("stepCompleted", handleStepCompleted);
    };
  }, [localCompletedSteps, type]);

  // Handling for last step
  useEffect(() => {
    const isLastStepActive = currentStep === "step-6";
    if (isLastStepActive) {
      const isPreviousStepCompleted = localCompletedSteps.includes("step-5");

      if (isPreviousStepCompleted && !localCompletedSteps.includes("step-6")) {
        const updatedSteps = [...localCompletedSteps, "step-6"];
        setLocalCompletedSteps(updatedSteps);

        if (typeof window !== "undefined") {
          const { completedStepsKey } = getLocalStorageKeys(type);
          localStorage.setItem(completedStepsKey, JSON.stringify(updatedSteps));
        }

        const event = new CustomEvent("stepCompleted", { detail: { step: "step-6" } });
        window.dispatchEvent(event);
      }
    }
  }, [currentStep, localCompletedSteps, type]);

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
      setIsSidebarOpen(false); // Close sidebar after navigation on mobile
    }
    onNavigate(stepId);
  };

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  // RESET BTN function
  const handleResetChat = async () => {
    console.log("Reset chat initiated for type:", type);

    try {
      // Get userId from localStorage (preserve it)
      const userId = localStorage.getItem("userId");
      console.log("Using userId for reset:", userId);

      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      // Step 1: Server-side cleanup for the specific chat type
      if (userId) {
        try {
          const endpoint =
            type === "interview"
              ? `${BASE_URL}/clear/interview/${userId}`
              : `${BASE_URL}/clear/application/${userId}`;

          console.log("Calling server endpoint:", endpoint);

          const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Server error: ${response.status} - ${errorData}`);
          }
        } catch (serverError) {
          console.error("Error communicating with server:", serverError);
          throw serverError;
        }
      }

      // Step 2: Reset ONLY the type-specific localStorage values
      if (type === "interview") {
        localStorage.removeItem("interviewCurrentStep");
        localStorage.removeItem("interviewCompletedSteps");
        localStorage.setItem("interviewCurrentStep", "step-1");
      } else {
        localStorage.removeItem("applicationCurrentStep");
        localStorage.removeItem("applicationCompletedSteps");
        localStorage.setItem("applicationCurrentStep", "step-1");
      }

      // Important: ONLY reset userRole if they're in step-1 of the first chat type
      // This ensures we don't lose role detection between chats
      if (currentStep === "step-1") {
        localStorage.setItem("userRole", "unknown");
      }

      // Remove any legacy keys
      localStorage.removeItem("completedSteps");
      localStorage.removeItem("currentStep");

      // Step 3: Reset local state
      setLocalCompletedSteps([]);

      // Step 4: Set a flag to indicate that we've done a reset
      localStorage.setItem(`${type}ChatReset`, "true");

      // Step 5: Reload the page to get a fresh start
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error in handleResetChat:", error);
      alert("Det gick inte att återställa chatten. Var god försök igen eller kontakta support.");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Toggle button outside sidebar - visible when sidebar is closed */}
      <div className={cn(`absolute z-20 mt-2 ml-2`, isSidebarOpen && "hidden")}>
        <SidebarTrigger onClick={() => handleSidebarToggle(true)} className="toggle-button" />
      </div>

      {/* Sidebar with conditional rendering for width */}
      <div
        className={cn(
          "sidebar-container sticky top-0 h-[100vh] flex-1 overflow-hidden",
          // Add transition classes for smooth animation
          "transition-all duration-500 ease-in-out",
          // Width transitions
          isSidebarOpen ? "w-64" : "w-0",
          // Mobile overlay behavior with backdrop
          isMobile && isSidebarOpen ? "absolute top-0 left-0 z-40" : "",
        )}
      >
        <Sidebar className="relative flex w-64 flex-col transition-opacity duration-500">
          <div className="relative z-10 mt-2 ml-2">
            <SidebarTrigger onClick={() => handleSidebarToggle(false)} className="toggle-button" />
          </div>

          <SidebarContent className="flex h-full flex-col justify-between md:h-[90%]">
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
                            onClick={() => isAccessible && handleStepClick(step.id)}
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
            <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="p-4">
                    <Button variant="ghost" className="mb-4 w-full justify-start hover:shadow-md">
                      <Trash2 className="mr-2 h-5 w-5" />
                      <span> Återställ chatt</span>
                    </Button>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Är du helt säker?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Denna åtgärd går inte att ångra. Detta kommer att permanent radera din
                      chatthistorik från våra servrar för denna chatt.
                      <br />
                      Du kan också välja att ta bort all din sparade data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex flex-col !justify-between">
                    <Link href="/cookies" passHref>
                      <Button
                        className="bg-muted-foreground hover:bg-muted-foreground/80 w-full text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isMobile) {
                            setIsSidebarOpen(true);
                          }
                        }}
                      >
                        Gå till dataradering
                      </Button>
                    </Link>
                    <div
                      className={cn(
                        "flex justify-end gap-2",
                        isMobile && "mt-2 w-full flex-col-reverse",
                      )}
                    >
                      <AlertDialogCancel
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isMobile) {
                            setIsSidebarOpen(true);
                          }
                        }}
                        className={cn(isMobile && "mb-2 w-full")}
                      >
                        Avbryt
                      </AlertDialogCancel>

                      <AlertDialogAction
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResetChat();
                          if (isMobile) {
                            setIsSidebarOpen(true);
                          }
                        }}
                        className={cn(isMobile && "w-full")}
                      >
                        Återställ chatt
                      </AlertDialogAction>
                    </div>
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
