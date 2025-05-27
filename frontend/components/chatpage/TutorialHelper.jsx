import { useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TutorialHelper({ onRestartTutorial }) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleRestartTutorial = () => {
    // Clear the tutorial flag
    localStorage.removeItem("hasSeenMobileTutorial");

    // Trigger the tutorial
    if (onRestartTutorial) {
      onRestartTutorial();
    }
  };

  // Only show on mobile
  if (!isMobile) return null;

  return (
    <div className="absolute top-0 left-1 z-[90] md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-background/90 h-10 w-10 rounded-full border-2 shadow-lg backdrop-blur-sm"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="z-[91] w-48">
          <DropdownMenuItem
            onClick={handleRestartTutorial}
            className="focus:bg-primary/10 hover:bg-primary/10 cursor-pointer"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Visa tutorial igen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
