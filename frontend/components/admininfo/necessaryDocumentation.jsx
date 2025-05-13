import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function QuestionsSettings() {
  //save to backend
  const handleSave = () => {
    console.log("Saving behavior settings:", settings);
  };

  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Nödvändig dokumentation</CardTitle>
        </div>
        <Button onClick={handleSave}>Spara ändringar</Button>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Rubrik, för denna sektion/sida som man ändrar */}
        <div className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Rubrik — Nödvänding dokumentation</Label>

            <Input id="bot-name" value="Nödvänding dokumentation" />
          </div>
        </div>

        {/* Punkt 1 */}
        <div className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Punkt 1 rubrik — Läkarintyg/Medicinskt utlåtande?</Label>

            <Input id="bot-name" value="Läkarintyg/Medicinskt utlåtande" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome-message">
              Punkt 1 under rubrik — Läkarintyg/Medicinskt utlåtande?
            </Label>
            <Textarea
              id="welcome-message"
              value="Ett aktuellt intyg som beskriver din funktionsnedsättning och dess påverkan på arbetsförmågan."
              rows={4}
            />
          </div>
        </div>

        {/* Punkt 2 */}
        <div className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Punkt 2 rubrik — Arbetsterapeututlåtande?</Label>

            <Input id="bot-name" value="Arbetsterapeututlåtande" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome-message">Punkt 2 under text — Arbetsterapeututlåtande?</Label>
            <Textarea
              id="welcome-message"
              value="Bedömning från arbetsterapeut om vilka hjälpmedel som kan underlätta din arbetssituation."
              rows={4}
            />
          </div>
        </div>

        {/* Punkt 3 */}
        <div className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Punkt 3 rubrik — Arbetsgivarintyg?</Label>

            <Input id="bot-name" value="Arbetsgivarintyg" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome-message">Punkt 3 under text — Arbetsgivarintyg?</Label>
            <Textarea
              id="welcome-message"
              value="Bekräftelse från arbetsgivare om anställning och beskrivning av arbetsuppgifter."
              rows={4}
            />
          </div>
        </div>

        {/* Punkt 4 */}
        <div className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Punkt 4 rubrik — Offert för hjälpmedel?</Label>

            <Input id="bot-name" value="Offert för hjälpmedel" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome-message">Punkt 4 under text — Offert för hjälpmedel?</Label>
            <Textarea
              id="welcome-message"
              value="Prisförslag från leverantör av de hjälpmedel som ansökan gäller."
              rows={4}
            />
          </div>
        </div>

        {/* Punkt 5 */}
        <div className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Punkt 5 rubrik — Personbevis?</Label>

            <Input id="bot-name" value="Personbevis" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-name">Punkt 5 under rubrik — Personbevis?</Label>

            <Input id="bot-name" value="För att bekräfta din identitet och adress." />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
