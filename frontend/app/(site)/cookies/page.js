"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { getCookie, setCookie, clearSession } from "@/lib/cookie-utils";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const CookieSettingsPage = () => {
  const [cookieConsent, setCookieConsent] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Load current cookie settings
    const currentConsent = getCookie("cookiesAccepted") === "true";
    setCookieConsent(currentConsent);
  }, []);

  const handleConsentChange = (checked) => {
    setCookieConsent(checked);
    setIsChanged(true);
  };

  const saveSettings = () => {
    setCookie("cookiesAccepted", cookieConsent ? "true" : "false");

    // If user rejected cookies, clear session
    if (!cookieConsent) {
      clearSession();
    }

    setIsChanged(false);

    // Set dialog message based on consent choice
    setDialogMessage(
      cookieConsent
        ? "Dina cookie-inställningar har sparats."
        : "Cookies har avböjts. Din session kommer inte att sparas.",
    );

    // Show confirmation dialog
    setConfirmDialogOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmDialogOpen(false);
    router.back();
  };

  // const deleteUserData = async () => {
  //   // Ta bort användardata från servern
  // };

  // RESET BTN function
  const handleResetChat = async () => {
    try {
      // Get userId from localStorage or your auth system
      const userId = localStorage.getItem("userId");

      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      if (!userId) {
        console.error("No userId found");
        return;
      }

      // Create endpoint based on type
      const applicationEndPoint = `${BASE_URL}/clear/application/${userId}`;
      const interviewEndPoint = `${BASE_URL}/clear/interview/${userId}`;

      const applicationResponse = await fetch(applicationEndPoint, {
        method: "DELETE",
      });

      const interviewResponse = await fetch(interviewEndPoint, {
        method: "DELETE",
      });

      if (!applicationResponse.ok) {
        console.error("Failed to reset chat history:", response.statusText);
        throw new Error("Failed to reset chat history");
      }

      if (!interviewResponse.ok) {
        console.error("Failed to reset interview history:", interviewResponse.statusText);
        throw new Error("Failed to reset interview history");
      }

      // Remove the type-specific localStorage items
      localStorage.removeItem("currentInterviewStep");
      localStorage.removeItem("currentapplicationStep");
      localStorage.removeItem("interviewCompletedSteps");
      localStorage.removeItem("applicationCompletedSteps");

      localStorage.removeItem("completedSteps");
      localStorage.removeItem("currentStep");

      // // Update local state
      // setLocalCompletedSteps([]);

      // Optional: Show success notification
      // alert("Chatthistoriken har återställts");

      // Reload the page to refresh the UI state
      window.location.reload();
    } catch (error) {
      console.error("Error resetting chat history:", error);
      // alert("Ett fel uppstod vid återställning av chatt-historiken");
    }
  };

  return (
    <div className="bg-background min-h-screen w-full px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Tillbaka</span>
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Cookie-inställningar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Vi använder cookies för att spara din session och dina inställningar. Detta hjälper
                oss att ge dig en bättre upplevelse när du använder vår tjänst.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="necessary-cookies" className="text-base font-medium">
                      Nödvändiga cookies
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Behövs för att tjänsten ska fungera korrekt. Dessa kan inte stängas av.
                    </p>
                  </div>
                  <Switch id="necessary-cookies" checked={true} disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="session-cookies" className="text-base font-medium">
                      Sessionslagring
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Lagrar din session så att du kan fortsätta från där du slutade. Din data
                      sparas krypterad i 100 dagar och raderas sedan automatiskt.
                    </p>
                  </div>
                  <Switch
                    id="session-cookies"
                    checked={cookieConsent}
                    onCheckedChange={handleConsentChange}
                  />
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="mb-2 text-base font-medium">Hantera min data</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Du kan när som helst välja att ta bort all din data från våra servrar. Detta
                  kommer att radera all personlig information och sessioner permanent.
                </p>

                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <div className="mt-6 flex flex-col space-y-5 md:flex-row md:justify-between">
                    <DialogTrigger asChild>
                      <Button variant="destructive">Ta bort all min data</Button>
                    </DialogTrigger>
                    <div className="border-t-1 md:border-0"></div>
                    <Button onClick={saveSettings} disabled={!isChanged}>
                      Spara inställningar
                    </Button>
                  </div>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Är du säker?</DialogTitle>
                      <DialogDescription>
                        Detta kommer permanent att ta bort all din data från våra servrar. Denna
                        åtgärd kan inte ångras och du kommer att loggas ut.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:justify-start">
                      <Button onClick={handleResetChat} variant="destructive" disabled={isDeleting}>
                        {isDeleting ? "Tar bort..." : "Ja, ta bort min data"}
                      </Button>
                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                        Avbryt
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Confirmation dialog for cookie settings saved */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inställningar sparade</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleConfirmClose}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CookieSettingsPage;
