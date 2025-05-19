import { useCallback } from "react";

export function useResizableTextarea(
  containerRef,
  defaultHeight = 96,
  maxHeight = 320,
  cssVariable = "--textarea-extra-height",
) {
  // Function to auto-resize textarea as user types
  const autoResizeTextarea = useCallback(
    (e) => {
      const textarea = e.target;

      // Save scroll position and cursor position
      const scrollTop = textarea.scrollTop;
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;

      // Reset height to calculate proper scrollHeight
      textarea.style.height = `${defaultHeight}px`;

      // Calculate new height with a maximum
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);

      // Set the new height
      textarea.style.height = `${newHeight}px`;

      // Restore scroll and cursor positions
      textarea.scrollTop = scrollTop;
      textarea.setSelectionRange(selectionStart, selectionEnd);

      // Update container sizing based on textarea height
      if (containerRef.current) {
        // Calculate extra padding needed
        const extraPadding = newHeight - defaultHeight;

        // Apply changes only when needed
        if (extraPadding > 0) {
          // Update CSS variable for dynamic container sizing
          document.documentElement.style.setProperty(cssVariable, `${extraPadding}px`);

          // Force scroll update AFTER the layout has been recalculated
          requestAnimationFrame(() => {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          });
        } else {
          document.documentElement.style.setProperty(cssVariable, "0px");
        }
      }
    },
    [containerRef, defaultHeight, maxHeight, cssVariable],
  );

  // Function to reset textarea size when sending message
  const resetTextareaSize = useCallback(
    (textareaElement = null) => {
      // Find the textarea if not provided
      const textarea = textareaElement || document.querySelector("textarea");
      if (textarea) {
        // Reset height to original size
        textarea.style.height = `${defaultHeight}px`;

        // Reset CSS variable
        document.documentElement.style.setProperty(cssVariable, "0px");

        // Reset container's padding and ensure it can scroll properly
        if (containerRef.current) {
          containerRef.current.style.paddingBottom = "0";

          // Force layout recalculation by triggering a scroll update
          setTimeout(() => {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }, 0);
        }
      }
    },
    [containerRef, defaultHeight, cssVariable],
  );

  return {
    autoResizeTextarea,
    resetTextareaSize,
  };
}
