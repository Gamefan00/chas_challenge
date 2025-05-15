"use client";
import React, { useState } from "react";
import { PenLine, PlusCircle, Save, X, FileText, MessageSquareText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function HowItWorksSettings() {
  // steps for the "How It Works" section
  const howItWorksSettings = [
    {
      step: "1.",
      title: "Beskriv din situation",
      description:
        "Berätta om din funktionsnedsättning och dina behov på arbetsplatsen i en enkel konversation.",
    },
    {
      step: "2.",
      title: "Få personlig vägledning",
      description:
        "Vår AI analyserar dina uppgifter och ger skräddarsydd hjälp för just dina behov.",
    },
    {
      step: "3.",
      title: "Skapa din ansökan",
      description: "Få förslag på formuleringar som matchar Försäkringskassans krav och riktlinjer",
    },
    {
      step: "4.",
      title: "Ladda ner & använd",
      description:
        "Spara dina dokument och förbered dig för nästa steg i processen med våra stöddokument.",
    },
  ];

  // State for step cards
  const [steps, setSteps] = useState(howItWorksSettings);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentEdit, setCurrentEdit] = useState({});

  // Start editing a step
  const handleEdit = (index) => {
    setEditingIndex(index);
    setCurrentEdit({ ...steps[index] });
  };

  // Save edited step
  const handleSave = () => {
    const updatedHowItWorks = [...steps];
    updatedHowItWorks[editingIndex] = currentEdit;
    setSteps(updatedHowItWorks);
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
        <CardTitle className="text-xl font-bold">Redigera hur det fungerar</CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((step, index) => (
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
                      <h3>{step.step}</h3>
                      <h3> {step.title}</h3>
                      <p>{step.description}</p>
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
