// components/dashboard/responses-settings.js
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ResponsesSettings() {
  const [settings, setSettings] = useState({
    successMessage:
      "Bra jobbat! Du har nu fyllt i all nödvändig information för din ansökan. Dina svar uppfyller Försäkringskassans krav och din ansökan har goda chanser att bli godkänd.",
    incompleteMessage:
      "Det ser ut som att vi behöver mer information för att stärka din ansökan. För att öka chanserna till godkännande behöver vi komplettera med följande:",
  });

  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };
  
  //save to backend
  const handleSave = () => {
    console.log("Saving responses settings:", settings);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Svar och feedback</CardTitle>
          <CardDescription>
            Anpassa hur assistenten svarar på användares frågor och ger feedback.
          </CardDescription>
        </div>
        <Button onClick={handleSave}>Spara ändringar</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="success-message">Framgångsmeddelande</Label>
          <Textarea
            id="success-message"
            value={settings.successMessage}
            onChange={(e) => handleChange("successMessage", e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="incomplete-message">Meddelande vid ofullständig information</Label>
          <Textarea
            id="incomplete-message"
            value={settings.incompleteMessage}
            onChange={(e) => handleChange("incompleteMessage", e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}
