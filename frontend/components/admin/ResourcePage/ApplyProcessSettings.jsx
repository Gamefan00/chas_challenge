import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenLine, X, Save, Plus, Trash } from "lucide-react";

function CardComponent({ sectionArray, setSectionArray }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentEdit, setCurrentEdit] = useState({});

  const handleEdit = (index) => {
    setEditingIndex(index);
    const item = sectionArray[index];
    setCurrentEdit({
      ...item,
      // Ingen konvertering behövs längre eftersom vi behåller array-strukturen
    });
  };

  const handleSave = () => {
    const updated = [...sectionArray];
    updated[editingIndex] = {
      ...currentEdit,
    };
    setSectionArray(updated);
    setEditingIndex(null);
  };

  const handleEditChange = (field, value) => {
    setCurrentEdit((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...currentEdit.description];
    newDescriptions[index] = value;
    setCurrentEdit((prev) => ({
      ...prev,
      description: newDescriptions,
    }));
  };

  const addDescriptionField = () => {
    setCurrentEdit((prev) => ({
      ...prev,
      description: [...prev.description, ""],
    }));
  };

  const removeDescriptionField = (index) => {
    const newDescriptions = [...currentEdit.description];
    newDescriptions.splice(index, 1);
    setCurrentEdit((prev) => ({
      ...prev,
      description: newDescriptions,
    }));
  };

  return (
    <Card className="w-full shadow-md">
      <CardContent className="pt-4">
        <div className="space-y-4">
          {sectionArray.map((item, index) => (
            <Card
              key={index}
              className={`border ${editingIndex === index ? "border-primary" : "border-border"}`}
            >
              {editingIndex === index ? (
                <CardContent className="grid gap-4 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label>Titel</label>
                      <Input
                        value={currentEdit.title}
                        onChange={(e) => handleEditChange("title", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label>Beskrivningspunkter</label>
                    <div className="space-y-2">
                      {currentEdit.description.map((desc, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input
                            value={desc}
                            onChange={(e) => handleDescriptionChange(i, e.target.value)}
                            placeholder={`Punkt ${i + 1}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeDescriptionField(i)}
                            className="flex-shrink-0"
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addDescriptionField}
                        className="mt-2"
                      >
                        <Plus className="mr-1 h-4 w-4" /> Lägg till punkt
                      </Button>
                    </div>
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
                <CardContent className="flex items-start justify-between p-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3>{item.title}</h3>
                      <ul className="mt-1 list-inside list-disc">
                        {item.description.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
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
  );
}

export default function ModelConfig() {
  const processData = {
    mainSection: [
      {
        title: "Om ansökningsprocessen",
        description: [
          "Att ansöka om arbetshjälpmedel kan vara en komplicerad process med många steg och krav som måste uppfyllas.",
          "Vår tjänst har utvecklats för att förenkla denna process och hjälpa dig att maximera dina chanser att få det stöd du behöver.",
          "Vi har samlat all relevant information på ett ställe.",
          "Vi erbjuder personlig vägledning från experter inom området.",
        ],
      },
    ],
    eligibilitySection: [
      {
        title: "Vem kan ansöka?",
        description: [
          "Har en dokumenterad funktionsnedsättning eller arbetsskada.",
          "Är anställd eller egenföretagare.",
          "Behöver hjälpmedel för att kunna utföra ditt arbete.",
          "Är mellan 18 och 67 år.",
        ],
      },
    ],
    supportTypesSection: [
      {
        title: "Vilka typer av stöd finns?",
        description: [
          "Fysiska hjälpmedel: Specialanpassade möbler, verktyg och utrustning.",
          "Digitala hjälpmedel: Programvara, datorutrustning, skärmläsare etc.",
          "Personligt stöd: Arbetsbiträde eller personlig assistent.",
          "Anpassningar på arbetsplatsen: Strukturella förändringar för att förbättra tillgänglighet.",
        ],
      },
    ],
  };

  const [mainSection, setMainSection] = useState(processData.mainSection);
  const [eligibilitySection, setEligibilitySection] = useState(processData.eligibilitySection);
  const [supportTypesSection, setSupportTypesSection] = useState(processData.supportTypesSection);

  return (
    <div className="flex flex-col gap-4">
      <CardComponent sectionArray={mainSection} setSectionArray={setMainSection} />
      <CardComponent sectionArray={eligibilitySection} setSectionArray={setEligibilitySection} />
      <CardComponent sectionArray={supportTypesSection} setSectionArray={setSupportTypesSection} />
    </div>
  );
}
