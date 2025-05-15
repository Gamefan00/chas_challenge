"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenLine, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";

const FAQSettings = () => {
  const initialFAQItems = [
    {
      title: "Kostar det något att använda Ansökshjälpen?",
      description:
        "Basversionen av vår tjänst är kostnadsfri för alla användare. Vi erbjuder även en premiumversion med utökad personlig rådgivning och prioriterad support för 295 kr per månad. Du kan använda tjänsten så länge du behöver och avsluta när din ansökan är klar.",
    },
    {
      title: "Hur lång tid tar hela ansökningsprocessen i genomsnitt?",
      description:
        "Den totala tiden varierar beroende på komplexiteten i ditt ärende och vilken myndighet som handlägger ansökan. Med vår tjänst kan du räkna med att själva ansökningsförfarandet (insamling av dokument och ifyllande av formulär) tar ca 2-3 veckor. Handläggningstiden hos myndigheten är vanligtvis 6-12 veckor, men kan vara både kortare och längre.",
    },
    {
      title: "Vad händer om min ansökan avslås trots hjälp från er tjänst?",
      description:
        "Om din ansökan avslås erbjuder vi en grundlig analys av avslagsbeslutet och hjälper dig att utforma en överklagan om det finns grund för detta. Vår statistik visar att cirka 40% av överklaganden som förbereds med vår hjälp leder till ett ändrat beslut.",
    },
    {
      title: "Kan arbetsgivaren använda er tjänst för att ansöka om hjälpmedel till anställda?",
      description:
        "Ja, arbetsgivare kan använda vår tjänst för att hantera ansökningar för sina anställda. Vi erbjuder särskilda företagsabonnemang för organisationer som vill underlätta processen för flera anställda. Kontakta vår företagsavdelning för mer information.",
    },
    {
      title: "Vilken typ av personlig information behöver jag dela med er tjänst?",
      description:
        "För att kunna ge relevant vägledning behöver vi information om din funktionsnedsättning, arbetsuppgifter och vilka behov du har. All information hanteras i enlighet med GDPR och vi använder avancerad kryptering för att säkerställa att dina uppgifter är skyddade. Du kan när som helst begära att få dina uppgifter raderade.",
    },
  ];

  // State for faq cards
  const [faqs, setFaqs] = useState(initialFAQItems);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentEdit, setCurrentEdit] = useState({});

  // Start editing a faq
  const handleEdit = (index) => {
    setEditingIndex(index);
    setCurrentEdit({ ...faqs[index] });
  };

  // Save edited faq
  const handleSave = () => {
    const updatedFaqs = [...faqs];
    updatedFaqs[editingIndex] = currentEdit;
    setFaqs(updatedFaqs);
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
        <CardTitle className="text-xl font-bold">Redigera Vanliga frågor</CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        {/* List with faqs Cards */}
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
                      <h3>{faq.title}</h3>
                      <p>{faq.description}</p>
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
