import { Progress } from "@/components/ui/progress";
import {  useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const TopTrackingBar = ({
  heading,
  currentStep,
  navigateToStep,
  completedSteps,
  completeCurrentStep,
  steps,
}) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Use a ref to track if we've already triggered the last step completion
  const lastStepCompletedRef = useRef(false);

  // Autocomplete the last step when user reaches it
  useEffect(() => {
    const currentIndex = steps.indexOf(currentStep);
    const isLastStep = currentIndex === steps.length - 1;

    if (isLastStep && !completedSteps.includes(currentStep) && !lastStepCompletedRef.current) {
      lastStepCompletedRef.current = true; // attempted completion
      markStepAsCompleted(currentStep);
    }
  }, [currentStep, steps, completedSteps]);

  // helper function to just mark a step as completed without navigating
  const markStepAsCompleted = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      //  manually update localStorage (since we can't call the parent function)
      const updatedCompletedSteps = [...completedSteps, stepId];
      if (typeof window !== "undefined") {
        localStorage.setItem("completedSteps", JSON.stringify(updatedCompletedSteps));

        const event = new CustomEvent("stepsCompleted", { detail: { steps: stepId } });
        window.dispatchEvent(event);
      }
    }
  };

  const currentIndex = steps.indexOf(currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;

  const handlePrevStep = () => {
    if (!isFirstStep) {
      navigateToStep(steps[currentIndex - 1]);
    }
  };

  const handleNextStep = () => {
    if (!isLastStep) {
      completeCurrentStep(); // mark as complete and navigate to next step
    }
  };

  // Calculate progress percentage
  const maxSteps = steps.length;
  const currentStepIndex = currentIndex + 1;
  const progressPercent = (currentStepIndex / maxSteps) * 100;

  return (
    <div className="bg-background sticky top-0 z-10 w-full pt-4 pb-5">
      <div className="mx-auto max-w-4xl px-4 pt-5 lg:pt-0">
        <div className="mb-2 flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-5">
          <h3>{heading}</h3>
          <div className="flex max-w-3xl justify-start space-x-2">
            <Button
              onClick={handlePrevStep}
              className={`${
                isFirstStep ? "bg-primary/20 cursor-not-allowed" : "bg-primary hover:bg-primary/80"
              } text-primary-foreground`}
              disabled={isFirstStep}
            >
              Föregående
            </Button>
            <Button
              onClick={handleNextStep}
              className={`${
                isLastStep ? "bg-primary/20 cursor-not-allowed" : "bg-primary hover:bg-primary/80"
              } text-primary-foreground`}
              disabled={isLastStep}
            >
              Nästa
            </Button>
          </div>
        </div>

        <Progress value={progressPercent} className="w-[100%]" />
      </div>
    </div>
  );
};

export default TopTrackingBar;
