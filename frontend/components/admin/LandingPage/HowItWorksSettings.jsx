"use client";
import React, { useState } from "react";
import { PenLine, PlusCircle, Save, X, FileText, MessageSquareText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HowItWorksSettings() {
  // Default feature cards data
  const defaultFeatures = [
    {
      title: "Beskriv din situation",
      description:
        "Berätta om din funktionsnedsättning och dina behov på arbetsplatsen i en enkel konversation.",
    },
    {
      title: "Få personlig vägledning",
      description:
        "Vår AI analyserar dina uppgifter och ger skräddarsydd hjälp för just dina behov.",
    },
    {
      title: "Skapa din ansökan",
      description: "Få förslag på formuleringar som matchar Försäkringskassans krav och riktlinjer",
    },
    {
      title: "Ladda ner & använd",
      description:
        "Spara dina dokument och förbered dig för nästa steg i processen med våra stöddokument.",
    },
  ];

  // State for feature cards
  const [features, setFeatures] = useState(defaultFeatures);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentEdit, setCurrentEdit] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeature, setNewFeature] = useState({
    title: "",
    description: "",
  });

  // Available icons for selection
  const availableIcons = [
    { name: "FileText", component: <FileText className="h-4 w-4" /> },
    { name: "MessageSquareText", component: <MessageSquareText className="h-4 w-4" /> },
    { name: "PenLine", component: <PenLine className="h-4 w-4" /> },
  ];

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

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Redigera Hur det fungerar</CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Add New Feature Form */}
        {showAddForm && (
          <Card className="mb-6 border-2 border-dashed border-gray-200 p-4">
            <CardContent className="p-0">
              <h3 className="mb-4 text-lg font-medium"></h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Icon</label>
                  </div>
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
                    value={newFeature.description}
                    onChange={(e) => handleAddChange("description", e.target.value)}
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Button Text</label>
                    <Input
                      value={newFeature.buttonText}
                      onChange={(e) => handleAddChange("buttonText", e.target.value)}
                      placeholder="Enter button text"
                    />
                  </div>
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
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
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
