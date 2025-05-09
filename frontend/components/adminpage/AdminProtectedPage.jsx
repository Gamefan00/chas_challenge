"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminProtectedPage({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState("checking"); // "checking", "unauthorized", "authorized"
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function verifyAuth() {
      try {
        const response = await fetch("/api/auth/verify", {
          credentials: "include",
        });

        if (!isMounted) return;

        if (!response.ok) {
          setAuthStatus("unauthorized");
          // Give the user a moment to see the message before redirecting
          setTimeout(() => {
            if (isMounted) router.push("/login");
          }, 1500);
          return;
        }

        setAuthStatus("authorized");
        setIsLoading(false);
      } catch (error) {
        console.error("Auth verification error:", error);
        if (isMounted) {
          setAuthStatus("unauthorized");
          setTimeout(() => {
            if (isMounted) router.push("/login");
          }, 1500);
        }
      }
    }

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="bg-accent flex min-h-screen flex-col items-center justify-center p-4 text-center">
        {authStatus === "checking" ? (
          <>
            <Loader2 className="text-primary mb-4 h-12 w-12 animate-spin" />
            <h2 className="text-xl font-semibold">Verifierar behörighet...</h2>
            <p className="text-muted-foreground mt-2">Kontrollerar dina inloggningsuppgifter</p>
          </>
        ) : authStatus === "unauthorized" ? (
          <>
            <ShieldAlert className="text-destructive mb-4 h-12 w-12" />
            <h2 className="text-xl font-semibold">Åtkomst nekad</h2>
            <p className="text-muted-foreground mt-2">Du har inte behörighet att se denna sida</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Omdirigerar till inloggningssidan...
            </p>
          </>
        ) : null}
      </div>
    );
  }

  return children;
}
