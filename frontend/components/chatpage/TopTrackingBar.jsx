import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const TopTrackingBar = ({ heading }) => {
  return (
    <div className="my-6 flex flex-col space-y-5">
      <div className="flex justify-between">
        <h3>{heading}</h3>
        <div className="flex max-w-3xl justify-start space-x-2">
          {/* {currentChatHistory.filter((msg) => msg.role === "user").length > 0 && ( */}
          <Button
            // onClick={completeCurrentStep}
            className="bg-primary/20 hover:bg-primary/80 text-primary-foreground"
          >
            Föregående
          </Button>
          <Button
            // onClick={completeCurrentStep}
            className="bg-primary hover:bg-primary/80 text-primary-foreground"
          >
            {/* )} */}
            Nästa
          </Button>
        </div>
      </div>

      <ProgressBar />
      <div></div>
    </div>
  );
};

function ProgressBar() {
  const [arrayLength, setArrayLength] = useState(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetch(`${BASE_URL}/array-length`)
      .then((response) => response.json())
      .then((data) => {
        setArrayLength(data.length);
      })
      .catch((error) => console.error("Error fetching data:", error));
    console.log(arrayLength);
  }, []);

  const maxSteps = arrayLength;
  let currentStep = localStorage.getItem("currentStep") || "step-1";
  let currentStepIndex = currentStep.slice(5, 6);

  let progressPercent = (parseInt(currentStepIndex) / maxSteps) * 100;

  return <Progress value={progressPercent} className="w-[100%]" />;
}

export default TopTrackingBar;
