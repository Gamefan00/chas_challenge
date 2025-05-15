import React, { useState } from "react";
import { PenLine, PlusCircle, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function FeatureCardSettings() {
  // Default feature cards data
  const featureCards = [
    {
      title: "Fylla i formulär",
      description:
        "Få hjälp med att välja rätt formulär och formulera dina svar på ett sätt som ökar dina chanser att få rätt stöd.",
      buttonText: "Starta formulärguide",
      link: "/applicationChat",
    },
    {
      title: "Förbered utredningssamtal",
      description:
        "Simulera ett utredningssamtal med vår AI och lär dig svara på handläggarens frågor på ett tydligt och effektivt sätt.",
      buttonText: "Förbered samtal",
      link: "/interviewChat",
    },
    {
      title: "Lär dig mer",
      description:
        "Förstår dina rättigheter och skyldigheter kring arbetshjälpmedel genom att läsa guider, artiklar och expertråd.",
      buttonText: "Utforska resurser",
      link: "/informationpage",
    },
  ];

  // State for feature cards
  const [features, setFeatures] = useState(featureCards);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentEdit, setCurrentEdit] = useState({});

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

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Redigera Kort på framsidan Admin</CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Features List */}
        <div className="space-y-4">
          {features.map((feature, index) => (
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label>Knapp Text</label>
                      <Input
                        value={currentEdit.buttonText}
                        onChange={(e) => handleEditChange("buttonText", e.target.value)}
                      />
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
                // View Card
                <CardContent className="flex items-start justify-between p-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                      <Button disabled>{feature.buttonText}</Button>
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
