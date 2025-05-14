import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PenLine, PlusCircle, Save, X } from "lucide-react";
import ModelConfig from "./InfoModelConfig";

export default function GeneralSettings({ welcomeMessage, assistent, history, session }) {
  const faqDataForResource = [
    {
      title: "Omfattande guide till ansökningsprocessen",
      description:
        "Att ansöka om arbetshjälpmedel kan vara en komplicerad process med många steg och krav som måste uppfyllas. Vår tjänst har utvecklats för att förenkla denna process och hjälpa dig att maximera dina chanser att få det stöd du behöver. Vi har samlat all relevant information på ett ställe och erbjuder personlig vägledning från experter inom området.",
    },
  ];

  // State for feature cards
  const [features, setFeatures] = useState(faqDataForResource);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentEdit, setCurrentEdit] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeature, setNewFeature] = useState({
    title: "",
    description: "",
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

  return (
    <div className="flex flex-col gap-20">
      <Card className="w-full shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Redigera hero sektion</CardTitle>
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
      <ModelConfig />
    </div>
  );
}
