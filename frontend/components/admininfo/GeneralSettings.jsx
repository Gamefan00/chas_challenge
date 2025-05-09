import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import InfoModelConfig from "./InfoModelConfig";

export default function GeneralSettings({ welcomeMessage, assistent, history, session }) {
  const [settings, setSettings] = useState({
    botName: "Omfattande guide till ansökningsprocessen",
    welcomeMessage:
      "Här hittar du detaljerad information om hur du ansöker om arbetshjälpmedel, vilka utmaningar du kan möta, och hur våra experter kan hjälpa dig genom hela processen.",
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
    <div className="flex flex-col gap-20">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Grundinställningar</CardTitle>
            <CardDescription>
              Hantera grundläggande inställningar för informationssidan.
            </CardDescription>
          </div>
          <Button onClick={handleSave}>Spara ändringar</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Namn på informationssidan</Label>
            <Input
              id="bot-name"
              value={settings.botName}
              onChange={(e) => handleChange("botName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome-message">Under rubrik</Label>
            <Textarea
              id="welcome-message"
              value={settings.welcomeMessage}
              onChange={(e) => handleChange("welcomeMessage", e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
      <InfoModelConfig />
    </div>
  );
}
