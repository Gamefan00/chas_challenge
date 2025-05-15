import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PenLine, Save, X } from "lucide-react";

function CardComponent({ sectionArray, setSectionArray }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentEdit, setCurrentEdit] = useState({});

  const handleEdit = (index) => {
    setEditingIndex(index);
    const item = sectionArray[index];
    setCurrentEdit({
      ...item,
      description: item.description.join("\n"), // Make editable
    });
  };

  const handleSave = () => {
    const updated = [...sectionArray];
    updated[editingIndex] = {
      ...currentEdit,
      description: currentEdit.description.split("\n"), // Back to array
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

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">{sectionArray[0]?.title}</CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-4">
          {sectionArray.map((item, index) => (
            <Card
              key={index}
              className={`border ${editingIndex === index ? "border-blue-500" : "border-gray-200"}`}
            >
              {editingIndex === index ? (
                <CardContent className="grid gap-4 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Titel</label>
                      <Input
                        value={currentEdit.title}
                        onChange={(e) => handleEditChange("title", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Beskrivning</label>
                    <Textarea
                      value={currentEdit.description}
                      onChange={(e) => handleEditChange("description", e.target.value)}
                      rows={5}
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
                <CardContent className="flex items-start justify-between p-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <ul className="mt-1 list-inside list-disc text-sm">
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
