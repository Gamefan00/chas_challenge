import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

export default function ResponsesSettings() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [settings, setSettings] = useState({
    // Standard responses for different conversation scenarios
    successMessage:
      "Bra jobbat! Du har nu fyllt i all nödvändig information för din ansökan. Dina svar uppfyller Försäkringskassans krav och din ansökan har goda chanser att bli godkänd.",
    incompleteMessage:
      "Det ser ut som att vi behöver mer information för att stärka din ansökan. För att öka chanserna till godkännande behöver vi komplettera med följande:",

    // Specialized response templates
    eligibilityConfirmed:
      "Baserat på den information du har delat uppfyller du kraven för arbetshjälpmedel eftersom:\n\n1. Du har en dokumenterad funktionsnedsättning\n2. Hjälpmedlet är direkt relaterat till dina arbetsuppgifter\n3. Hjälpmedlet är utöver vad som normalt behövs på arbetsplatsen",
    eligibilityUncertain:
      "För att kunna avgöra om du uppfyller kraven för arbetshjälpmedel behöver vi mer information om:\n\n1. Din funktionsnedsättning och hur den påverkar ditt arbete\n2. Vilka specifika arbetsuppgifter du behöver stöd med\n3. Huruvida hjälpmedlet går utöver vad som normalt behövs på arbetsplatsen",

    // Response templates for different aid categories
    physicalAids:
      "För fysiska funktionsnedsättningar kan följande hjälpmedel vara relevanta:\n\n• Ergonomiska möbler och arbetsplatsutrustning\n• Lyftutrustning eller förflyttningshjälpmedel\n• Anpassade verktyg och redskap\n• Specialdesignade kontorsstolar",
    visualAids:
      "För synnedsättningar kan följande hjälpmedel vara relevanta:\n\n• Skärmläsare och talsyntes\n• Förstoringshjälpmedel för skärm och dokument\n• Punktskriftsdisplay\n• Specialanpassad belysning",
    hearingAids:
      "För hörselnedsättningar kan följande hjälpmedel vara relevanta:\n\n• Hörselförstärkare för arbetsplatsen\n• Telefonförstärkare\n• FM-system för möten\n• Visuella signalsystem för telefon och alarm",
    cognitiveAids:
      "För kognitiva funktionsnedsättningar kan följande hjälpmedel vara relevanta:\n\n• Struktur- och planeringsstöd\n• Minnesstöd och påminnelseverktyg\n• Hjälpmedel för koncentration\n• Programvara för läs- och skrivstöd",

    // Next steps guidance
    nextStepsEligible:
      "Nu när vi har identifierat att du kan vara berättigad till arbetshjälpmedel, är detta nästa steg:\n\n1. Skaffa ett läkarintyg som styrker din funktionsnedsättning\n2. Diskutera med din arbetsgivare om behovet av hjälpmedel\n3. Fyll i Försäkringskassans blankett för arbetshjälpmedel\n4. Bifoga offerter från leverantörer av aktuellt hjälpmedel",
    nextStepsIneligible:
      "Baserat på den information du har delat verkar du inte uppfylla Försäkringskassans kriterier för arbetshjälpmedel. Här är några alternativa vägar att gå:\n\n1. Diskutera med din arbetsgivare om anpassningar på arbetsplatsen\n2. Kontakta företagshälsovården för bedömning\n3. Undersök om kommunen eller regionen erbjuder stöd för din situation",
  });

  // Load settings from backend
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);

        const response = await fetch("/admin/settings/response_templates", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.value) {
            setSettings(data.value);
          }
        }
      } catch (err) {
        console.error("Error loading response templates:", err);
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

      const response = await fetch("/admin/settings/response_templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          value: settings,
          category: "ai_config",
          description: "AI-assistentens svarsmallar och feedback",
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
          <CardTitle>Svarsmallar och feedback</CardTitle>
          <CardDescription>
            Anpassa hur AI-assistenten ger feedback och svarar på användares situationer.
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

        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Generella svar</TabsTrigger>
            <TabsTrigger value="eligibility">Bedömning</TabsTrigger>
            <TabsTrigger value="aids">Hjälpmedelsförslag</TabsTrigger>
            <TabsTrigger value="steps">Nästa steg</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="success-message">Framgångsmeddelande</Label>
              <Textarea
                id="success-message"
                value={settings.successMessage}
                onChange={(e) => handleChange("successMessage", e.target.value)}
                rows={4}
              />
              <p className="text-muted-foreground text-xs">
                Meddelande som visas när användaren har gett tillräcklig information för en
                fullständig ansökan.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="incomplete-message">Meddelande vid ofullständig information</Label>
              <Textarea
                id="incomplete-message"
                value={settings.incompleteMessage}
                onChange={(e) => handleChange("incompleteMessage", e.target.value)}
                rows={4}
              />
              <p className="text-muted-foreground text-xs">
                Meddelande som visas när användaren behöver ge mer information.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="eligibility" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="eligibility-confirmed">Bekräftad berättigande</Label>
              <Textarea
                id="eligibility-confirmed"
                value={settings.eligibilityConfirmed}
                onChange={(e) => handleChange("eligibilityConfirmed", e.target.value)}
                rows={6}
              />
              <p className="text-muted-foreground text-xs">
                Svarsmall när användaren uppfyller kraven för arbetshjälpmedel.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eligibility-uncertain">Osäker berättigande</Label>
              <Textarea
                id="eligibility-uncertain"
                value={settings.eligibilityUncertain}
                onChange={(e) => handleChange("eligibilityUncertain", e.target.value)}
                rows={6}
              />
              <p className="text-muted-foreground text-xs">
                Svarsmall när det är oklart om användaren uppfyller kraven.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="aids" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="physical-aids">Fysiska hjälpmedel</Label>
              <Textarea
                id="physical-aids"
                value={settings.physicalAids}
                onChange={(e) => handleChange("physicalAids", e.target.value)}
                rows={6}
              />
              <p className="text-muted-foreground text-xs">
                Förslag på hjälpmedel för fysiska funktionsnedsättningar.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visual-aids">Synhjälpmedel</Label>
              <Textarea
                id="visual-aids"
                value={settings.visualAids}
                onChange={(e) => handleChange("visualAids", e.target.value)}
                rows={6}
              />
              <p className="text-muted-foreground text-xs">
                Förslag på hjälpmedel för synnedsättningar.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hearing-aids">Hörselhjälpmedel</Label>
              <Textarea
                id="hearing-aids"
                value={settings.hearingAids}
                onChange={(e) => handleChange("hearingAids", e.target.value)}
                rows={6}
              />
              <p className="text-muted-foreground text-xs">
                Förslag på hjälpmedel för hörselnedsättningar.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cognitive-aids">Kognitiva hjälpmedel</Label>
              <Textarea
                id="cognitive-aids"
                value={settings.cognitiveAids}
                onChange={(e) => handleChange("cognitiveAids", e.target.value)}
                rows={6}
              />
              <p className="text-muted-foreground text-xs">
                Förslag på hjälpmedel för kognitiva funktionsnedsättningar.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="steps" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="next-steps-eligible">Nästa steg vid berättigande</Label>
              <Textarea
                id="next-steps-eligible"
                value={settings.nextStepsEligible}
                onChange={(e) => handleChange("nextStepsEligible", e.target.value)}
                rows={6}
              />
              <p className="text-muted-foreground text-xs">
                Instruktioner för användare som sannolikt är berättigade till arbetshjälpmedel.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="next-steps-ineligible">Nästa steg vid ej berättigande</Label>
              <Textarea
                id="next-steps-ineligible"
                value={settings.nextStepsIneligible}
                onChange={(e) => handleChange("nextStepsIneligible", e.target.value)}
                rows={6}
              />
              <p className="text-muted-foreground text-xs">
                Alternativ för användare som sannolikt inte är berättigade till arbetshjälpmedel.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
