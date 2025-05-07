import { ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";

export default function BackToBottomBtn({ conatinerRef, threshold = 30 }) {
  // Scroll state management
  const [showButton, setShowButton] = useState(false);

  // Handle scroll detection

  const handleScroll = () => {
    const container = conatinerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.scrollHeight < threshold;

    setShowButton(!isAtBottom);
  };

  // Setup scroll event listener
  useEffect(() => {
    const container = conatinerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);

    // intial scroll check
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [conatinerRef, threshold]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (conatinerRef.current) {
      conatinerRef.current.scrollTop = conatinerRef.current.scrollHeight;
    }
  };

  // Check if the button should be visible
  if (!showButton) {
    return null;
  }

  return (
    <Button onClick={scrollToBottom} size="icon" className="fixed right-4 bottom-4 z-10 bg-white">
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
