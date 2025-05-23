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

const CookieSettingsPage = () => {
  const [cookieConsent, setCookieConsent] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
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
    alert(
      cookieConsent
        ? "Dina cookie-inställningar har sparats."
        : "Cookies har avböjts. Din session kommer inte att sparas.",
    );
    router.back();
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

              <div className="mt-6 flex justify-end">
                <Button onClick={saveSettings} disabled={!isChanged}>
                  Spara inställningar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CookieSettingsPage;
