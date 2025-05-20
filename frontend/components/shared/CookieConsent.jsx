"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already set cookie preference
    const cookieConsent = localStorage.getItem("cookie-consent");
    if (!cookieConsent) {
      // If no preference is set, show the banner
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowConsent(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 p-4 md:p-6">
      <Card className="mx-auto max-w-4xl shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Cookies och dataskydd</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={rejectCookies}
              aria-label="Close cookie consent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Vi använder cookies för att förbättra din upplevelse och lagra din session i 30 dagar.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2 text-sm">
          <p className="text-muted-foreground">
            Vi lagrar dina konversationer i en krypterad databas i 30 dagar för att kunna fortsätta
            assistera dig med din ansökan. Dina uppgifter delas aldrig med tredje part. Läs mer i
            vår{" "}
            <Link href="/integrity" className="text-primary underline-offset-4 hover:underline">
              integritetspolicy
            </Link>
            .
          </p>
        </CardContent>
        <CardFooter className="flex gap-4 pt-2">
          <Button variant="outline" onClick={rejectCookies}>
            Avböj
          </Button>
          <Button onClick={acceptCookies}>Acceptera</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CookieConsent;
