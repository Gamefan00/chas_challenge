import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusType("error");
        setStatusMessage(data.message || "Login failed");
        throw new Error(data.message || "Login failed");
      }

      // Store the token in localStorage
      localStorage.setItem("authToken", data.token);

      // Set success message
      setStatusType("success");
      setStatusMessage("Login successful!");

      // Add a small delay before redirecting
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      setStatusType("error");
      setStatusMessage(error.message || "Login failed. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center">
          <h2 className="mt-6 text-center text-2xl font-semibold">Admin Inloggning</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-postadress</Label>
              <Input
                id="email"
                type="email"
                placeholder="din.epost@exempel.se"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Lösenord</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {/* Status message */}
            {statusMessage && (
              <div
                className={`flex items-center rounded-md p-3 text-sm ${
                  statusType === "success"
                    ? "border-success bg-success/10 text-success border"
                    : "border-destructive bg-destructive/10 text-destructive border"
                }`}
              >
                {statusType === "success" ? (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                {statusMessage}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Loggar in...
                </>
              ) : (
                "Logga in"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
