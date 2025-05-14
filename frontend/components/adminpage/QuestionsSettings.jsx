import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

export default function QuestionsSettings() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [settings, setSettings] = useState({
    // Questions organized by purpose
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

    // Knowledge base references
    fkRules: `• Arbetshjälpmedel kan beviljas till en person med funktionsnedsättning som behöver hjälp för att kunna arbeta
• Hjälpmedlet ska vara utöver vad som normalt krävs på arbetsplatsen
• Ansökan måste styrkas med läkarintyg eller annan medicinsk dokumentation
• Försäkringskassan kan bevilja bidrag upp till 100,000 SEK för arbetshjälpmedel`,

    // Response strategies
    clarificationPrompts: `Om användaren är otydlig med sitt behov, fråga:
1. Kan du beskriva en specifik situation där du har svårt att utföra dina arbetsuppgifter?
2. Vilka specifika arbetsmoment behöver du hjälp med?
3. Har du något konkret hjälpmedel i åtanke som skulle underlätta för dig?`,

    summaryPrompts: `När användaren har delat tillräcklig information, sammanfatta:
1. Din beskrivna funktionsnedsättning: [sammanfatta]
2. Dina arbetsmässiga behov: [sammanfatta]
3. Hjälpmedel som kan vara relevanta: [lista förslag]
4. Nästa steg i ansökningsprocessen: [beskriv]`,
  });

  // Load settings from backend
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);

        const response = await fetch("/admin/settings/question_strategies", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.value) {
            setSettings(data.value);
          }
        }
      } catch (err) {
        console.error("Error loading question settings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const handleSave = async () => {
    try {
      setSaveStatus({ type: "loading", message: "Sparar..." });

      const response = await fetch("/admin/settings/question_strategies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          value: settings,
          category: "ai_config",
          description: "AI-assistentens frågestrategier och kunskapsbas",
        }),
      });

      if (response.ok) {
        setSaveStatus({ type: "success", message: "Inställningarna har sparats" });

        setTimeout(() => {
          setSaveStatus(null);
        }, 3000);
      } else {
        setSaveStatus({ type: "error", message: "Det gick inte att spara inställningarna" });
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      setSaveStatus({ type: "error", message: "Det gick inte att spara inställningarna" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>AI Frågestrategier</CardTitle>
          <CardDescription>
            Anpassa hur AI-assistenten ställer frågor och tillhandahåller information till
            användare.
          </CardDescription>
        </div>
        <Button onClick={handleSave} disabled={saveStatus?.type === "loading"}>
          {saveStatus?.type === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sparar...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Spara ändringar
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status messages */}
        {saveStatus && saveStatus.type !== "loading" && (
          <div
            className={`flex items-center rounded-md p-3 ${
              saveStatus.type === "error"
                ? "border border-red-200 bg-red-50 text-red-700"
                : "border border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {saveStatus.type === "success" ? (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            ) : (
              <AlertCircle className="mr-2 h-4 w-4" />
            )}
            {saveStatus.message}
          </div>
        )}

        <Tabs defaultValue="questions">
          <TabsList className="mb-4">
            <TabsTrigger value="questions">Frågestrategier</TabsTrigger>
            <TabsTrigger value="knowledge">Kunskapsbas</TabsTrigger>
            <TabsTrigger value="responses">Svarsstrategier</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-6">
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
              <p className="text-muted-foreground text-xs">
                Fördjupande frågor för att bättre förstå användarens funktionsnedsättning.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirement-questions">Frågor om krav för godkännande</Label>
              <Textarea
                id="requirement-questions"
                value={settings.requirementQuestions}
                onChange={(e) => handleChange("requirementQuestions", e.target.value)}
                rows={6}
              />
              <p className="text-muted-foreground text-xs">
                Frågor för att säkerställa att användaren uppfyller kraven för arbetshjälpmedel.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fk-rules">Försäkringskassans regler</Label>
              <Textarea
                id="fk-rules"
                value={settings.fkRules}
                onChange={(e) => handleChange("fkRules", e.target.value)}
                rows={8}
              />
              <p className="text-muted-foreground text-xs">
                Viktig information om regler och krav från Försäkringskassan som assistenten ska
                använda.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="responses" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="clarification-prompts">Förtydligande frågor</Label>
              <Textarea
                id="clarification-prompts"
                value={settings.clarificationPrompts}
                onChange={(e) => handleChange("clarificationPrompts", e.target.value)}
                rows={6}
              />
              <p className="text-muted-foreground text-xs">
                Frågor som assistenten kan ställa för att få tydligare information från användaren.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary-prompts">Sammanfattande svar</Label>
              <Textarea
                id="summary-prompts"
                value={settings.summaryPrompts}
                onChange={(e) => handleChange("summaryPrompts", e.target.value)}
                rows={6}
              />
              <p className="text-muted-foreground text-xs">
                Mallar för hur assistenten ska sammanfatta information och ge rekommendationer.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
