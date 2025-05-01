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
          <CardTitle>AI-beteende</CardTitle>
          <CardDescription>Anpassa hur AI-assistenten interagerar med användare.</CardDescription>
        </div>
        <Button onClick={handleSave}>Spara ändringar</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tone">Samtalston</Label>
          <Select value={settings.tone} onValueChange={(value) => handleChange("tone", value)}>
            <SelectTrigger id="tone">
              <SelectValue placeholder="Välj ton" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="formal">Formell</SelectItem>
                <SelectItem value="friendly">Vänlig</SelectItem>
                <SelectItem value="professional">Professionell</SelectItem>
                <SelectItem value="simple">Enkel</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="knowledge-base">Kunskapsbas för Försäkringskassan</Label>
          <Textarea
            id="knowledge-base"
            value={settings.knowledgeBase}
            onChange={(e) => handleChange("knowledgeBase", e.target.value)}
            rows={4}
          />
          <p className="text-muted-foreground text-xs">
            Lägg till specifik kunskap som assistenten behöver för att hjälpa användare.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-questions">Amount question</Label>
          <Input
            id="max-questions"
            type="number"
            value={settings.amountQuestion}
            onChange={(e) => handleChange("amountQuestion", parseInt(e.target.value))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="personal-guidance" className="cursor-pointer">
            True or False Setting 1
          </Label>
          <Switch
            id="TrueFalseSettingOne"
            checked={settings.TrueFalseSettingOne}
            onCheckedChange={(checked) => handleChange("TrueFalseSettingOne", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="personal-guidance" className="cursor-pointer">
            True or False Setting 2
          </Label>
          <Switch
            id="TrueFalseSettingTwo"
            checked={settings.TrueFalseSettingTwo}
            onCheckedChange={(checked) => handleChange("TrueFalseSettingTwo", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
