import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, X, Save } from "lucide-react";

export default function StepsSettings() {
  const stepsSettings = {
    main: [
      {
        mainTitle: "Steg-för-steg ansökningsguide",
        mainDescription:
          "Här är en detaljerad beskrivning av ansökningsprocessen från start till slut",
      },
    ],
    steps: [
      {
        step: "1.",
        title: "Bedömning av behov",
        content:
          "Första steget är att få en bedömning av dina specifika behov. Detta görs ofta i samråd med en arbetsterapeut, läkare eller annan specialist som kan dokumentera vilka hjälpmedel som kan underlätta din arbetssituation.",
      },
      {
        step: "2.",
        title: "Insamling av dokumentation",
        content:
          "Du behöver samla in relevant medicinsk dokumentation, arbetsplatsbeskrivning och annan information som styrker ditt behov. Vår tjänst hjälper dig att identifiera exakt vilka dokument du behöver.",
      },
      {
        step: "3.",
        title: "Ifyllande av ansökningsformulär",
        content:
          "Vår AI-assistent hjälper dig att fylla i ansökningsformulären korrekt och fullständigt, vilket minimerar risken för avslag på grund av formella brister.",
      },
      {
        step: "4.",
        title: "Inlämning av ansökan",
        content:
          "Efter att alla dokument är samlade och formulär ifyllda, lämnas ansökan in till relevant myndighet eller organisation. Vi guidar dig till rätt instans.",
      },
      {
        step: "5.",
        title: "Uppföljning under handläggning",
        content:
          "Under handläggningstiden kan kompletteringar behövas. Vi hjälper dig att förstå vad som efterfrågas och hur du bäst bemöter detta.",
      },
      {
        step: "6.",
        title: "Beslut och eventuell överklagan",
        content:
          "När beslut är fattat hjälper vi dig att förstå beslutet. Om ansökan avslås hjälper vi dig att bedöma om en överklagan är lämplig och hur den i så fall ska utformas.",
      },
    ],
  };

  // State for step cards
  const [steps, setSteps] = useState(stepsSettings.steps);
  const [titleDescription, setTitleDescription] = useState(stepsSettings.main);
  const [editingStepIndex, setEditingStepIndex] = useState(null);
  const [editingMainIndex, setEditingMainIndex] = useState(null);
  const [currentStepEdit, setCurrentStepEdit] = useState({});
  const [currentMainEdit, setCurrentMainEdit] = useState({});

  // Start editing a step
  const handleEditStep = (index) => {
    setEditingStepIndex(index);
    setCurrentStepEdit({ ...steps[index] });
  };

  // Start editing main title/description
  const handleEditMain = (index) => {
    setEditingMainIndex(index);
    setCurrentMainEdit({ ...titleDescription[index] });
  };

  // Save edited Step
  const handleSaveStep = () => {
    const updatedSteps = [...steps];
    updatedSteps[editingStepIndex] = currentStepEdit;
    setSteps(updatedSteps);
    setEditingStepIndex(null);
  };

  // Save edited main title/description
  const handleSaveMain = () => {
    const updatedTitleDescription = [...titleDescription];
    updatedTitleDescription[editingMainIndex] = currentMainEdit;
    setTitleDescription(updatedTitleDescription);
    setEditingMainIndex(null);
  };

  // Handle change in edit form
  const handleStepEditChange = (field, value) => {
    setCurrentStepEdit({
      ...currentStepEdit,
      [field]: value,
    });
  };

  // Handle change in main edit form
  const handleMainEditChange = (field, value) => {
    setCurrentMainEdit({
      ...currentMainEdit,
      [field]: value,
    });
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Redigera Steg-för-steg guide</CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Edit Main Title and Description */}

        <div className="space-y-4">
          <h3>Huvudtitel och beskrivning</h3>

          {titleDescription.map((item, index) => (
            <Card
              key={index}
              className={`border ${editingMainIndex === index ? "border-primary" : "border-border"}`}
            >
              {editingMainIndex === index ? (
                // Edit main title and description
                <CardContent className="grid gap-4 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Huvud Titel</label>
                      <Input
                        value={currentMainEdit.mainTitle}
                        onChange={(e) => handleMainEditChange("mainTitle", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Huvud Beskrivning</label>
                    <Textarea
                      value={currentMainEdit.mainDescription}
                      onChange={(e) => handleMainEditChange("mainDescripton", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditingMainIndex(null)}>
                      <X className="mr-2 h-4 w-4" /> Avbryt
                    </Button>
                    <Button onClick={handleSaveMain}>
                      <Save className="mr-2 h-4 w-4" /> Spara ändringar
                    </Button>
                  </div>
                </CardContent>
              ) : (
                // View Card
                <CardContent className="flex items-start justify-between p-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="font-medium">{item.mainTitle}</h3>
                      <p className="mt-1 text-sm text-gray-500">{item.mainDescription}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditMain(index)}>
                      <PenLine className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Edit Steps List */}
        <div className="space-y-4">
          <h3 className="mt-2 mb-2 text-lg font-medium">Redigera stegen</h3>

          {steps.map((step, index) => (
            <Card
              key={index}
              className={`border ${editingStepIndex === index ? "border-primary" : "border-border"}`}
            >
              {editingStepIndex === index ? (
                // Edit Steps
                <CardContent className="grid gap-4 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Titel</label>
                      <Input
                        value={currentStepEdit.title}
                        onChange={(e) => handleStepEditChange("title", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Beskrivning</label>
                    <Textarea
                      value={currentStepEdit.content}
                      onChange={(e) => handleStepEditChange("content", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditingStepIndex(null)}>
                      <X className="mr-2 h-4 w-4" /> Avbryt
                    </Button>
                    <Button onClick={handleSaveStep}>
                      <Save className="mr-2 h-4 w-4" /> Spara ändringar
                    </Button>
                  </div>
                </CardContent>
              ) : (
                // View Card
                <CardContent className="flex items-start justify-between p-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="font-medium">{step.step}</h3>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{step.content}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditStep(index)}>
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
  );
}
