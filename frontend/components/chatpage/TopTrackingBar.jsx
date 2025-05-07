import { Progress } from "@/components/ui/progress";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const TopTrackingBar = ({
  heading,
  currentStep,
  navigateToStep,
  completedSteps,
  completeCurrentStep,
  steps
}) => {
  // const [steps, setSteps] = useState(["step-1", "step-2", "step-3", "step-4", "step-5", "step-6"]);
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
    <div className="my-10 flex flex-col space-y-5">
      <div className="flex items-center justify-between">
        <h3>{heading}</h3>
        <div className="flex max-w-3xl justify-start space-x-2">
          <Button
            onClick={handlePrevStep}
            className={`${
              isFirstStep ? "bg-primary/20 cursor-not-allowed" : "bg-primary/60 hover:bg-primary/80"
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
      <div></div>
    </div>
  );
};

export default TopTrackingBar;
