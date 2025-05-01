import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function QuestionsSettings() {
  const [settings, setSettings] = useState({
    initialQuestions: `1. Är du en arbetstagare som behöver hjälpmedel för att kunna arbeta?
2. Vilken typ av funktionsnedsättning har du?
3. Hur påverkar din funktionsnedsättning ditt arbete?
4. Vilka arbetsuppgifter har du svårt att utföra?`,
    followupQuestions: `1. Har du medicinsk dokumentation som stödjer din funktionsnedsättning?
2. Har du redan provat några hjälpmedel på din arbetsplats?
3. Har du diskuterat dina behov med din arbetsgivare?
4. Finns det specifika arbetsuppgifter där du behöver extra stöd?`,
    requirementQuestions: `1. Är hjälpmedlet specifikt anpassat för dina arbetsuppgifter?
2. Är hjälpmedlet utöver vad som normalt behövs på arbetsplatsen?
3. Är hjälpmedlet något som arbetsgivaren normalt inte tillhandahåller?
4. Kommer hjälpmedlet att göra det möjligt för dig att utföra ditt arbete trots din funktionsnedsättning?`,
  });

  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  // save to backend
  const handleSave = () => {
    console.log("Saving questions settings:", settings);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Frågehantering</CardTitle>
          <CardDescription>
            Hantera vilka frågor assistenten ska ställa till användare.
          </CardDescription>
        </div>
        <Button onClick={handleSave}>Spara ändringar</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="initial-questions">Inledande frågor</Label>
          <Textarea
            id="initial-questions"
            value={settings.initialQuestions}
            onChange={(e) => handleChange("initialQuestions", e.target.value)}
            rows={6}
          />
          <p className="text-muted-foreground text-xs">
            Frågor som assistenten ställer i början av konversationen för att förstå användarens
            behov.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="followup-questions">Följdfrågor för funktionsnedsättning</Label>
          <Textarea
            id="followup-questions"
            value={settings.followupQuestions}
            onChange={(e) => handleChange("followupQuestions", e.target.value)}
            rows={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirement-questions">Frågor om krav för godkännande</Label>
          <Textarea
            id="requirement-questions"
            value={settings.requirementQuestions}
            onChange={(e) => handleChange("requirementQuestions", e.target.value)}
            rows={6}
          />
        </div>
      </CardContent>
    </Card>
  );
}
