import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BehaviorSettings() {
  const [settings, setSettings] = useState({
    tone: "friendly",
    knowledgeBase:
      "AI-assistenten ska ha kunskap om Försäkringskassans regler för arbetshjälpmedel. Assistenten ska känna till blankett FK 7545 och kunna guida användare genom alla delar av ansökningsprocessen. Assistenten ska vara medveten om vanliga orsaker till avslag och hjälpa användaren att undvika dessa.",
    amountQuestion: 3,
    TrueFalseSettingOne: true,
    TrueFalseSettingTwo: true,
  });

  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  //save to backend
  const handleSave = () => {
    console.log("Saving behavior settings:", settings);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Steg-för-steg ansökningsguide</CardTitle>
          <CardDescription>
            Här är en detaljerad beskrivning av ansökningsprocessen från start till slut
          </CardDescription>
        </div>
        <Button onClick={handleSave}>Spara ändringar</Button>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Punkt 1 */}
        <div className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Rubrikt, Steg-för-steg ansökningsguide?</Label>

            <Input id="bot-name" value="Steg-för-steg ansökningsguide" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-name">Under rubrik, Steg-för-steg ansökningsguide?</Label>

            <Input
              id="bot-name"
              value="Här är en detaljerad beskrivning av ansökningsprocessen från start till slut:"
            />
          </div>
        </div>

        {/* Punkt 2 */}
        <div className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Punkt 1 rubrikt, Bedömning av behov?</Label>

            <Input id="bot-name" value="Bedömning av behov" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome-message">Punkt 1 under rubrikt, Bedömning av behov?</Label>
            <Textarea
              id="welcome-message"
              value="Första steget är att få en bedömning av dina specifika behov. Detta görs ofta i samråd med en arbetsterapeut, läkare eller annan specialist som kan dokumentera vilka hjälpmedel som kan underlätta din arbetssituation."
              rows={4}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bot-name">Punkt 2 rubrikt, Insamling av dokumentation?</Label>

          <Input id="bot-name" value="Insamling av dokumentation" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="welcome-message">Punkt 2 under text, Insamling av dokumentation?</Label>
          <Textarea
            id="welcome-message"
            value="Vår AI-assistent hjälper dig att fylla i ansökningsformulären korrekt och fullständigt, vilket minimerar risken för avslag på grund av formella brister."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bot-name">Punkt 3 rubrikt, Ifyllande av ansökningsformulär?</Label>

          <Input id="bot-name" value="Bedömning av behov" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="welcome-message">
            Punkt 3 under text, Ifyllande av ansökningsformulär?
          </Label>
          <Textarea
            id="welcome-message"
            value="Du behöver samla in relevant medicinsk dokumentation, arbetsplatsbeskrivning och annan information som styrker ditt behov. Vår tjänst hjälper dig att identifiera exakt vilka dokument du behöver."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bot-name">Punkt 4 rubrikt, Inlämning av ansökan?</Label>

          <Input id="bot-name" value="Bedömning av behov" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="welcome-message">Punkt 4 under text, Inlämning av ansökan?</Label>
          <Textarea
            id="welcome-message"
            value="Efter att alla dokument är samlade och formulär ifyllda, lämnas ansökan in till relevant myndighet eller organisation. Vi guidar dig till rätt instans."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bot-name">Punkt 1 rubrikt, Bedömning av behov ?</Label>

          <Input id="bot-name" value="Bedömning av behov" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bot-name">Punkt 1 under rubrik, Bedömning av behov ?</Label>

          <Input
            id="bot-name"
            value="Första steget är att få en bedömning av dina specifika behov. Detta görs ofta i samråd med en arbetsterapeut, läkare eller annan specialist som kan dokumentera vilka hjälpmedel som kan underlätta din arbetssituation."
          />
        </div>
      </CardContent>
    </Card>
  );
}
