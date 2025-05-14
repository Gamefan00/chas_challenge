import { AlertCircle, CheckCircle2 } from "lucide-react";

export function StatusMessage({ status }) {
  if (!status) return null;

  return (
    <div
      className={`flex items-center rounded-md p-3 ${
        status.type === "error"
          ? "border-destructive bg-destructive/10 text-destructive border"
          : status.type === "success"
            ? "border-success bg-success/10 text-success border"
            : "border-primary bg-primary/10 text-primary border"
      }`}
    >
      {status.type === "success" ? (
        <CheckCircle2 className="mr-2 h-4 w-4" />
      ) : (
        <AlertCircle className="mr-2 h-4 w-4" />
      )}
      {status.message}
    </div>
  );
}
