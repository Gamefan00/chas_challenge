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
          className="absolute top-0 right-1.5 z-10 h-11 rounded-xl border-2 border-white md:bottom-5"
          onClick={handleClick}
        >
          <ArrowDown />
        </Button>
      )}
    </div>
  );
}
