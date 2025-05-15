"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenLine, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";

const FAQSettings = () => {
  // Default FAQ data
  const landingPageFaqs = [
    {
      title: "Vad är arbetshjälpmedel?",
      description:
        "Arbetshjälpmedel är produkter, verktyg eller anpassningar som gör det möjligt för personer med funktionsnedsättning att utföra sitt arbete. Det kan vara allt från ergonomiska möbler till specialiserad programvara eller tekniska hjälpmedel.",
    },
    {
      title: "Vem kan söka om arbetshjälpmedel?",
      description:
        "Personer med funktionsnedsättning som är anställda, egenföretagare, eller som ska börja ett arbete eller arbetsmarknadsutbildning kan ansöka om arbetshjälpmedel.",
    },
    {
      title: "Hur fungerar ett utredningssamtal?",
      description:
        "Ett utredningssamtal är ett möte där dina behov kartläggs. En handläggare träffar dig och eventuellt din arbetsgivare för att diskutera vilka hjälpmedel som kan underlätta ditt arbete. Samtalet kan ske på arbetsplatsen eller digitalt",
    },
    {
      title: "Sparas mina uppgifter på Ansökshjälpen?",
      description:
        "Ja, dina uppgifter sparas säkert och i enlighet med GDPR. De används endast för att hantera din ansökan och kommer inte att delas med tredje part utan ditt samtycke.",
    },
  ];

  // State for Faq cards
  const [faqs, setFaqs] = useState(landingPageFaqs);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentEdit, setCurrentEdit] = useState({});

  // Start editing a Faq
  const handleEdit = (index) => {
    setEditingIndex(index);
    setCurrentEdit({ ...faqs[index] });
  };

  // Save edited Faq
  const handleSave = () => {
    const updatedFaq = [...faqs];
    updatedFaq[editingIndex] = currentEdit;
    setFaqs(updatedfaqs);
    setEditingIndex(null);
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Redigera Hur det fungerar</CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Faqs List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
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
                      <h3 className="font-medium">{faq.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{faq.description}</p>
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
};

export default FAQSettings;
