// components/dashboard/general-settings.js
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AIModelConfig from "./AIModelConfig";

export default function GeneralSettings() {
  const [settings, setSettings] = useState({
    botName: "Ansökshjälpen-AI",
    welcomeMessage:
      "Hej! Jag är Ansökshjälpen-AI och jag hjälper dig att fylla i din ansökan om arbetshjälpmedel till Försäkringskassan. Hur kan jag hjälpa dig idag?",
    enabled: true,
    saveHistory: true,
    sessionTimeout: 30,
  });

  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  // save to backend
  const handleSave = () => {
    console.log("Saving settings:", settings);
  };

  return (
    <div className="">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Grundinställningar</CardTitle>
            <CardDescription>
              Hantera grundläggande inställningar för AI-assistenten.
            </CardDescription>
          </div>
          <Button onClick={handleSave}>Spara ändringar</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Namn på assistenten</Label>
            <Input
              id="bot-name"
              value={settings.botName}
              onChange={(e) => handleChange("botName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome-message">Välkomstmeddelande</Label>
            <Textarea
              id="welcome-message"
              value={settings.welcomeMessage}
              onChange={(e) => handleChange("welcomeMessage", e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="bot-enabled" className="cursor-pointer">
              Aktivera assistenten
            </Label>
            <Switch
              id="bot-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => handleChange("enabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="save-history" className="cursor-pointer">
              Spara konversationshistorik
            </Label>
            <Switch
              id="save-history"
              checked={settings.saveHistory}
              onCheckedChange={(checked) => handleChange("saveHistory", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-timeout">Sessionstid (dagar)</Label>
            <Input
              id="session-timeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleChange("sessionTimeout", parseInt(e.target.value))}
            />
            <p className="text-muted-foreground text-xs">
              Antal dagar som användardata sparas innan den automatiskt raderas.
            </p>
          </div>
        </CardContent>
      </Card>
      <AIModelConfig />
    </div>
  );
}
