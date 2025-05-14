import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PenLine, X, Save, PlusCircle } from "lucide-react";

export default function StepsSettings() {
  const [settings, setSettings] = useState({
    mainTitle: "Steg-för-steg ansökningsguide",
    mainDescription: "Här är en detaljerad beskrivning av ansökningsprocessen från start till slut",
    steps: [
      {
        step: "Steg 1",
        title: "Bedömning av behov",
        content:
          "Första steget är att få en bedömning av dina specifika behov. Detta görs ofta i samråd med en arbetsterapeut, läkare eller annan specialist som kan dokumentera vilka hjälpmedel som kan underlätta din arbetssituation.",
      },
      {
        step: "Steg 2",
        title: "Insamling av dokumentation",
        content:
          "Du behöver samla in relevant medicinsk dokumentation, arbetsplatsbeskrivning och annan information som styrker ditt behov. Vår tjänst hjälper dig att identifiera exakt vilka dokument du behöver.",
      },
      {
        step: "Steg 3",
        title: "Ifyllande av ansökningsformulär",
        content:
          "Vår AI-assistent hjälper dig att fylla i ansökningsformulären korrekt och fullständigt, vilket minimerar risken för avslag på grund av formella brister.",
      },
      {
        step: "Steg 4",
        title: "Inlämning av ansökan",
        content:
          "Efter att alla dokument är samlade och formulär ifyllda, lämnas ansökan in till relevant myndighet eller organisation. Vi guidar dig till rätt instans.",
      },
      {
        step: "Steg 5",
        title: "Uppföljning under handläggning",
        content:
          "Under handläggningstiden kan kompletteringar behövas. Vi hjälper dig att förstå vad som efterfrågas och hur du bäst bemöter detta.",
      },
      {
        step: "Steg 6",
        title: "Beslut och eventuell överklagan",
        content:
          "När beslut är fattat hjälper vi dig att förstå beslutet. Om ansökan avslås hjälper vi dig att bedöma om en överklagan är lämplig och hur den i så fall ska utformas.",
      },
    ],
  });

  // State for feature cards
  const [features, setFeatures] = useState(settings.steps);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentEdit, setCurrentEdit] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeature, setNewFeature] = useState({
    title: "",
    content: "",
  });

  // Start editing a feature
  const handleEdit = (index) => {
    setEditingIndex(index);
    setCurrentEdit({ ...features[index] });
  };

  // Save edited feature
  const handleSave = () => {
    const updatedFeatures = [...features];
    updatedFeatures[editingIndex] = currentEdit;
    setFeatures(updatedFeatures);
    setEditingIndex(null);
  };

  // Handle change in edit form
  const handleEditChange = (field, value) => {
    setCurrentEdit({
      ...currentEdit,
      [field]: value,
    });
  };

  // Handle change in add form
  const handleAddChange = (field, value) => {
    setNewFeature({
      ...newFeature,
      [field]: value,
    });
  };

  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  return (
    <>
      <Card className="w-full shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Redigera Steg-för-steg guide</CardTitle>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Add New Feature Form */}
          {showAddForm && (
            <Card className="mb-6 border-2 border-dashed border-gray-200 p-4">
              <CardContent className="p-0">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Title</label>
                      <Input
                        value={newFeature.title}
                        onChange={(e) => handleAddChange("title", e.target.value)}
                        placeholder="Enter title"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Description</label>
                    <Textarea
                      value={newFeature.content}
                      onChange={(e) => handleAddChange("content", e.target.value)}
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Link</label>
                      <Input
                        value={newFeature.link}
                        onChange={(e) => handleAddChange("link", e.target.value)}
                        placeholder="Enter link path"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddFeature} className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`border ${editingIndex === index ? "border-blue-500" : "border-gray-200"}`}
              >
                {editingIndex === index ? (
                  // Edit Form
                  <CardContent className="grid gap-4 p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Title</label>
                        <Input
                          value={currentEdit.title}
                          onChange={(e) => handleEditChange("title", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Description</label>
                      <Textarea
                        value={currentEdit.content}
                        onChange={(e) => handleEditChange("content", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditingIndex(null)}>
                        <X className="mr-2 h-4 w-4" /> Avbryt
                      </Button>
                      <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" /> Spara ändringar
                      </Button>
                    </div>
                  </CardContent>
                ) : (
                  // View Card
                  <CardContent className="flex items-start justify-between p-4">
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{feature.content}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(index)}>
                        <PenLine className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
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
          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="bot-name">Rubrik — Steg-för-steg ansökningsguide?</Label>

              <Input id="bot-name" value="Steg-för-steg ansökningsguide" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bot-name">Under rubrik — Steg-för-steg ansökningsguide?</Label>

              <Input
                id="bot-name"
                value="Här är en detaljerad beskrivning av ansökningsprocessen från start till slut:"
              />
            </div>
          </div>

          {/* Punkt 1 */}
          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="bot-name">Punkt 1 rubrik — Bedömning av behov?</Label>

              <Input id="bot-name" value="Bedömning av behov" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-message">Punkt 1 under rubrik — Bedömning av behov?</Label>
              <Textarea
                id="welcome-message"
                value="Första steget är att få en bedömning av dina specifika behov. Detta görs ofta i samråd med en arbetsterapeut, läkare eller annan specialist som kan dokumentera vilka hjälpmedel som kan underlätta din arbetssituation."
                rows={4}
              />
            </div>
          </div>

          {/* Punkt 2 */}
          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="bot-name">Punkt 2 rubrik — Insamling av dokumentation?</Label>

              <Input id="bot-name" value="Insamling av dokumentation" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-message">
                Punkt 2 under text — Insamling av dokumentation?
              </Label>
              <Textarea
                id="welcome-message"
                value="Vår AI-assistent hjälper dig att fylla i ansökningsformulären korrekt och fullständigt, vilket minimerar risken för avslag på grund av formella brister."
                rows={4}
              />
            </div>
          </div>

          {/* Punkt 3  */}
          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="bot-name">Punkt 3 rubrik — Ifyllande av ansökningsformulär?</Label>

              <Input id="bot-name" value="Ifyllande av ansökningsformulär?" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-message">
                Punkt 3 under text — Ifyllande av ansökningsformulär?
              </Label>
              <Textarea
                id="welcome-message"
                value="Du behöver samla in relevant medicinsk dokumentation, arbetsplatsbeskrivning och annan information som styrker ditt behov. Vår tjänst hjälper dig att identifiera exakt vilka dokument du behöver."
                rows={4}
              />
            </div>
          </div>

          {/* Punkt 4 */}
          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="bot-name">Punkt 4 rubrik — Inlämning av ansökan?</Label>

              <Input id="bot-name" value="Bedömning av behov" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-message">Punkt 4 under text — Inlämning av ansökan?</Label>
              <Textarea
                id="welcome-message"
                value="Efter att alla dokument är samlade och formulär ifyllda, lämnas ansökan in till relevant myndighet eller organisation. Vi guidar dig till rätt instans."
                rows={4}
              />
            </div>
          </div>

          {/* Punkt 5  */}
          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="bot-name">Punkt 5 rubrik — Uppföljning under handläggning?</Label>

              <Input id="bot-name" value="Uppföljning under handläggning" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bot-name">
                Punkt 5 under rubrik — Uppföljning under handläggning?
              </Label>

              <Input
                id="bot-name"
                value="Under handläggningstiden kan kompletteringar behövas. Vi hjälper dig att förstå vad som efterfrågas och hur du bäst bemöter detta."
              />
            </div>
          </div>

          {/* Punkt 6  */}
          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="bot-name">Punkt 6 rubrik — Beslut och eventuell överklagan?</Label>

              <Input id="bot-name" value="Beslut och eventuell överklagan" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bot-name">
                Punkt 6 under rubrik — Beslut och eventuell överklagan?
              </Label>

              <Input
                id="bot-name"
                value="När beslut är fattat hjälper vi dig att förstå beslutet. Om ansökan avslås hjälper vi dig att bedöma om en överklagan är lämplig och hur den i så fall ska utformas."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
