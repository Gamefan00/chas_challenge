import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PenLine, Save, X } from "lucide-react";

export default function NecessaryDocSettings() {
  const documentationData = [
    {
      title: "Läkarintyg/Medicinskt utlåtande?",
      description:
        "Ett aktuellt intyg som beskriver din funktionsnedsättning och dess påverkan på arbetsförmågan.",
    },
    {
      title: "Arbetsterapeututlåtande?",
      description:
        "Bedömning från arbetsterapeut om vilka hjälpmedel som kan underlätta din arbetssituation..",
    },
    {
      title: "Arbetsgivarintyg",
      description:
        "Bekräftelse från arbetsgivare om anställning och beskrivning av arbetsuppgifter..",
    },
    {
      title: "Offert för hjälpmedel",
      description: "Prisförslag från leverantör av de hjälpmedel som ansökan gäller.",
    },
    {
      title: "Personbevis",
      description: "För att bekräfta din identitet och adress.",
    },
  ];

  // State for document cards
  const [documents, setDocuments] = useState(documentationData);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentEdit, setCurrentEdit] = useState({});

  // Start editing a document
  const handleEdit = (index) => {
    setEditingIndex(index);
    setCurrentEdit({ ...documents[index] });
  };

  // Save  edited document
  const handleSave = () => {
    const updatedDocuments = [...documents];
    updatedDocuments[editingIndex] = currentEdit;
    setDocuments(updatedDocuments);
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
        <CardTitle className="text-xl font-bold">Redigera Nödvändig dokumentation</CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Documents List */}
        <div className="space-y-4">
          {documents.map((document, index) => (
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
                      <h3>{document.title}</h3>
                      <p>{document.description}</p>
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
