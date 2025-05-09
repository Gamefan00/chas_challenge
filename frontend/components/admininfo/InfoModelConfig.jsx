"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ModelConfig() {
  return (
    <div>
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground text-lg font-semibold">
            Om ansökningsprocessen
          </CardTitle>
          <p>Hantera grundläggande inställningar för ansökningsprocessen</p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Rubrik — ansökningsprocessen</Label>

            <Input
              id="bot-name"
              value="Om ansökningsprocessen"
              onChange={(e) => handleChange("botName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome-message">Under text — ansökningsprocessen</Label>
            <Textarea
              id="welcome-message"
              value="Att ansöka om arbetshjälpmedel kan vara en komplicerad process med många steg och krav som måste uppfyllas. Vår tjänst har utvecklats för att förenkla denna process och hjälpa dig att maximera dina chanser att få det stöd du behöver. Vi har samlat all relevant information på ett ställe och erbjuder personlig vägledning från experter inom området."
              rows={4}
            />
          </div>

          <hr />

          <div className="space-y-2">
            <Label htmlFor="bot-name">Rubrik — Vem kan ansöka?</Label>

            <Input id="bot-name" value="Om ansökningsprocessen" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-name">Under rubrik — Vem kan ansöka?</Label>

            <Input id="bot-name" value="Du kan ansöka om arbetshjälpmedel om du:" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-name">Punkt 1 — Vem kan ansöka?</Label>

            <Input
              id="bot-name"
              value="Har en dokumenterad funktionsnedsättning eller arbetsskada"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-name">Punkt 2 — Vem kan ansöka?</Label>

            <Input id="bot-name" value="Är anställd eller egenföretagare" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-name">Punkt 3 — Vem kan ansöka?</Label>

            <Input id="bot-name" value="Behöver hjälpmedel för att kunna utföra ditt arbete" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-name">Punkt 4 — Vem kan ansöka?</Label>

            <Input id="bot-name" value="Är mellan 18 och 67 år" />
          </div>

          <hr />

          <div className="space-y-2">
            <Label htmlFor="bot-name">Rubrik — Vilka typer av stöd finns det?</Label>

            <Input id="bot-name" value="Vilka typer av stöd finns?" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-name">Punkt 1 — Vilka typer av stöd finns det?</Label>

            <Input
              id="bot-name"
              value="Fysiska hjälpmedel: Specialanpassade möbler, verktyg och utrustning"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-name">Punkt 2 — Vilka typer av stöd finns det?</Label>

            <Input
              id="bot-name"
              value="Digitala hjälpmedel: Programvara, datorutrustning, skärmläsare etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-name">Punkt 3 — Vilka typer av stöd finns det?</Label>

            <Input id="bot-name" value="Personligt stöd: Arbetsbiträde eller personlig assistent" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-name">Punkt 4 — Vilka typer av stöd finns det?</Label>

            <Input
              id="bot-name"
              value="Anpassningar på arbetsplatsen: Strukturella förändringar för att förbättra tillgänglighet"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
