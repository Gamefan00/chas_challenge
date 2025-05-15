import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Save, X } from "lucide-react";
import ModelConfig from "./ApplyProcessSettings";

export default function GeneralSettings({ welcomeMessage, assistent, history, session }) {
  const GeneralData = [
    {
      title: "Omfattande guide till ansökningsprocessen",
      description:
        "Att ansöka om arbetshjälpmedel kan vara en komplicerad process med många steg och krav som måste uppfyllas. Vår tjänst har utvecklats för att förenkla denna process och hjälpa dig att maximera dina chanser att få det stöd du behöver. Vi har samlat all relevant information på ett ställe och erbjuder personlig vägledning från experter inom området.",
    },
  ];

  // State for general cards
  const [generalSettings, setGeneralSettings] = useState(GeneralData);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentEdit, setCurrentEdit] = useState({});

  // Start editing a general
  const handleEdit = (index) => {
    setEditingIndex(index);
    setCurrentEdit({ ...generalSettings[index] });
  };

  // Save edited general
  const handleSave = () => {
    const updatedGeneral = [...generalSettings];
    updatedGeneral[editingIndex] = currentEdit;
    setGeneralSettings(updatedGeneral);
    setEditingIndex(null);
  };

  return (
    <div className="flex flex-col gap-10">
      <Card className="w-full shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Redigera hero sektion</CardTitle>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Generals List */}
          <div className="space-y-4">
            {generalSettings.map((general, index) => (
              <Card
                key={index}
                className={`border ${editingIndex === index ? "border-primary" : "border-border"}`}
              >
                {editingIndex === index ? (
                  // Edit Form
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
                      <label>Beskrivning</label>
                      <Textarea
                        value={currentEdit.description}
                        onChange={(e) => handleEditChange("description", e.target.value)}
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
                        <h3>{general.title}</h3>
                        <p>{general.description}</p>
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
      <ModelConfig />
    </div>
  );
}
