// components/ui/dropdown-menu.jsx
// If this component doesn't exist in your shadcn/ui setup, you can add it

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {children.map((child, index) => {
        if (child.type === DropdownMenuTrigger) {
          return (
            <div key={index} onClick={() => setIsOpen(!isOpen)}>
              {child}
            </div>
          );
        }
        if (child.type === DropdownMenuContent && isOpen) {
          return <div key={index}>{child}</div>;
        }
        return null;
      })}
    </div>
  );
};

const DropdownMenuTrigger = ({ asChild, children, ...props }) => {
  if (asChild) {
    return children;
  }
  return <button {...props}>{children}</button>;
};

const DropdownMenuContent = ({ align = "center", className, children, ...props }) => {
  const alignClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0",
  };

  return (
    <div
      className={cn(
        "bg-popover text-popover-foreground absolute top-full z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md",
        alignClasses[align],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ className, children, onClick, ...props }) => {
  return (
    <div
      className={cn(
        "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger };
