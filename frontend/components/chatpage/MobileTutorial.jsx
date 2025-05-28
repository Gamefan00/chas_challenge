import { useState, useEffect, useRef } from "react";
import { X, ArrowLeft, ArrowRight, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MobileTutorial({ onComplete }) {
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [screenHeight, setScreenHeight] = useState(0);
  const highlightedElementRef = useRef(null);

  // Config
  const tutorialSteps = [
    {
      id: "welcome",
      title: "Välkommen!",
      description:
        "Låt oss visa dig hur du navigerar i appen på mobilen. Detta tar bara några sekunder!",
      highlight: null,
    },
    {
      id: "sidebar-closed",
      title: "Navigering",
      description:
        "Tryck på menyknappen för att öppna navigeringsmenyn och se alla steg i processen.",
      highlight: ".toggle-button",
    },
    {
      id: "progress",
      title: "Förloppsmätare",
      description:
        "Följ din framgång via förloppsmätaren och klicka direkt på stegen för att snabbt hoppa mellan dem.",
      highlight: ".progress-container",
    },
  ];

  // Derived state
  const currentStepData = tutorialSteps[currentStep] || tutorialSteps[0];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;
  const useCompactMode = screenHeight < 650;

  // Event handlers
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("hasSeenMobileTutorial", "true");
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const handleSkip = () => handleComplete();

  // Effects
  useEffect(() => {
    // Show tutorial if not seen before and on mobile
    const hasSeenTutorial = localStorage.getItem("hasSeenMobileTutorial");
    const isMobile = window.innerWidth < 768;

    if (!hasSeenTutorial && isMobile) {
      setIsVisible(true);
    }

    // Track screen height for responsive sizing
    const updateScreenHeight = () => setScreenHeight(window.innerHeight);
    updateScreenHeight();

    window.addEventListener("resize", updateScreenHeight);
    return () => window.removeEventListener("resize", updateScreenHeight);
  }, []);

  // Add global highlight styles
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      .tutorial-highlight-element {
        position: relative;
        z-index: 101 !important;
      }
      .tutorial-highlight-element::before {
        content: "";
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        border: 2px solid #3b82f6;
        border-radius: 8px;
        background: rgba(59, 130, 246, 0.1);
        animation: tutorialPulse 2s infinite;
        pointer-events: none;
        z-index: 101;
      }
      @keyframes tutorialPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.08); }
      }
    `;
    document.head.appendChild(styleEl);

    return () => document.head.removeChild(styleEl);
  }, []);

  // Handle element highlighting
  useEffect(() => {
    if (!isVisible || !currentStepData?.highlight) return;

    // Clean up previous highlight
    const cleanupHighlight = () => {
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove("tutorial-highlight-element");
        highlightedElementRef.current = null;
      }
    };

    cleanupHighlight();

    // Find and highlight target element
    setTimeout(() => {
      try {
        let targetElement = null;

        // Use specific selectors for navigation step
        if (currentStep === 1) {
          targetElement =
            document.querySelector(".toggle-button")?.closest("button") ||
            document.querySelector(".document-button") ||
            document.querySelector("[data-document-button]");
        } else {
          targetElement = document.querySelector(currentStepData.highlight);
        }

        if (targetElement) {
          targetElement.classList.add("tutorial-highlight-element");
          highlightedElementRef.current = targetElement;
        }
      } catch (error) {
        console.error("Error highlighting tutorial element:", error);
      }
    }, 100);

    return cleanupHighlight;
  }, [isVisible, currentStep, currentStepData?.highlight]);

  // Early return if not visible
  if (!isVisible) return null;

  // Render
  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 z-[100] bg-black/50 md:hidden">
        {/* Tutorial Card */}
        <div className="fixed top-1/2 left-1/2 z-[120] w-full max-w-[calc(100%-24px)] -translate-x-1/2 -translate-y-1/2 transform sm:max-w-xs">
          <Card className="border-primary relative border shadow-xl">
            <CardContent className={`relative ${useCompactMode ? "p-3" : "p-4"}`}>
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="absolute top-0 right-3 h-8 w-8 p-0"
              >
                <X className="h-3 w-3" />
              </Button>

              {/* Content */}
              <div className={`${useCompactMode ? "mt-1 mb-3" : "mb-4"}`}>
                <h3
                  className={`text-foreground ${
                    useCompactMode ? "mb-1 text-base" : "mb-2 text-lg"
                  } font-semibold`}
                >
                  {currentStepData.title}
                </h3>
                <p className={`text-muted-foreground ${useCompactMode ? "text-xs" : "text-sm"}`}>
                  {currentStep === 1 ? (
                    <>
                      Tryck på menyknappen <PanelLeft className="inline h-3 w-3" /> för att öppna
                      navigeringsmenyn och se alla steg i processen.
                    </>
                  ) : (
                    currentStepData.description
                  )}
                </p>
              </div>

              {/* Progress dots */}
              <div
                className={`${useCompactMode ? "mb-2" : "mb-3"} flex justify-center space-x-1.5`}
              >
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`${useCompactMode ? "h-1.5 w-1.5" : "h-2 w-2"} rounded-full transition-colors ${
                      index === currentStep
                        ? "bg-primary"
                        : index < currentStep
                          ? "bg-primary/50"
                          : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={isFirstStep}
                  className={`flex items-center space-x-1 ${useCompactMode ? "h-8 px-2 text-xs" : ""}`}
                >
                  <ArrowLeft className={`${useCompactMode ? "h-3 w-3" : "h-4 w-4"}`} />
                  <span>Tillbaka</span>
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className={`text-muted-foreground ${useCompactMode ? "h-8 px-2 text-xs" : "text-sm"}`}
                >
                  Hoppa över
                </Button>

                <Button
                  onClick={handleNext}
                  className={`flex items-center space-x-1 ${useCompactMode ? "h-8 px-2 text-xs" : ""}`}
                >
                  <span>{isLastStep ? "Klar" : "Nästa"}</span>
                  {!isLastStep && (
                    <ArrowRight className={`${useCompactMode ? "h-3 w-3" : "h-4 w-4"}`} />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
