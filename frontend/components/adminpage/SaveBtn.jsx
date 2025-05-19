"use client";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SaveBtn = ({
  onClick,
  isLoading = false,
  loadingText = "Sparar...",
  saveText = "Spara ändringar",
  disabled = false,
  className = "",
  children,
  ...props
}) => {
  //  isLoading = status?.type === "loading";

  return (
    <Button onClick={onClick} disabled={disabled || isLoading} {...props}>
      {children ? (
        children
      ) : isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          {saveText}
        </>
      )}
    </Button>
  );
};

export default SaveBtn;
