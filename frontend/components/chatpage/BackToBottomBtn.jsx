import { ArrowDown } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState, useCallback } from "react";

export default function BackToBottomBtn({ containerRef, threshold }) {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Calculate distance from the bottom
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setIsVisible(distanceFromBottom > threshold);
  }, [containerRef, threshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    handleScroll(); // Initial check

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [containerRef, threshold]);

  const handleClick = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <div className="flex justify-center">
      {isVisible && (
        <Button
          className="absolute bottom-6 z-10 h-11 rounded-full border-2 border-white"
          onClick={handleClick}
        >
          <ArrowDown />
        </Button>
      )}
    </div>
  );
}
