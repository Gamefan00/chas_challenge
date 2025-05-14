"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const FAQSettings = () => {
  const [faqData, setFaqData] = useState([
    {
      id: 1,
      question: "Vad är arbetshjälpmedel?",
      answer:
        "Arbetshjälpmedel är produkter, verktyg eller anpassningar som gör det möjligt för personer med funktionsnedsättning att utföra sitt arbete. Det kan vara allt från ergonomiska möbler till specialiserad programvara eller tekniska hjälpmedel.",
    },
    {
      id: 2,
      question: "Vem kan ansöka om arbetshjälpmedel?",
      answer:
        "Personer med funktionsnedsättning som är anställda, egenföretagare, eller som ska börja ett arbete eller arbetsmarknadsutbildning kan ansöka om arbetshjälpmedel.",
    },
    {
      id: 3,
      question: "Hur fungerar ett utredningssamtal?",
      answer:
        "Ett utredningssamtal är ett möte där dina behov kartläggs. En handläggare träffar dig och eventuellt din arbetsgivare för att diskutera vilka hjälpmedel som kan underlätta ditt arbete. Samtalet kan ske på arbetsplatsen eller digitalt.",
    },
    {
      id: 4,
      question: "Sparas mina uppgifter på Ansökshjälpen?",
      answer:
        "Ja, dina uppgifter sparas säkert och i enlighet med GDPR. De används endast för att hantera din ansökan och kommer inte att delas med tredje part utan ditt samtycke.",
    },
  ]);

  // Function to handle changes to questions or answers
  const handleChange = (id, field, value) => {
    setFaqData((prevData) =>
      prevData.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq)),
    );
  };

  // Function to save changes (typically you'd send this to a backend)
  const handleSave = () => {
    console.log("Saving FAQ data:", faqData);
    // Add your save functionality here (for example, API call to save data)
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-center">Redigera Vanliga Frågor</CardTitle>{" "}
        <Button onClick={handleSave} className="">
          Spara ändringar
        </Button>
      </CardHeader>
      <CardContent>
        <Accordion type="single" className="w-full" collapsible>
          {faqData.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="cursor-pointer">
                <Input
                  value={faq.question}
                  onChange={(e) => handleChange(faq.id, "question", e.target.value)}
                  className="w-full"
                />
              </AccordionTrigger>
              <AccordionContent>
                <Textarea
                  value={faq.answer}
                  onChange={(e) => handleChange(faq.id, "answer", e.target.value)}
                  rows={4}
                  className="w-full"
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FAQSettings;

// Template Code - delete this if not needed

// import { useState } from "react";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";

// export default function FAQ() {
//   const [settings, setSettings] = useState({
//     successMessage:
//       "Bra jobbat! Du har nu fyllt i all nödvändig information för din ansökan. Dina svar uppfyller Försäkringskassans krav och din ansökan har goda chanser att bli godkänd.",
//     incompleteMessage:
//       "Det ser ut som att vi behöver mer information för att stärka din ansökan. För att öka chanserna till godkännande behöver vi komplettera med följande:",
//   });

//   const handleChange = (field, value) => {
//     setSettings({
//       ...settings,
//       [field]: value,
//     });
//   };

//   //save to backend
//   const handleSave = () => {
//     console.log("Saving responses settings:", settings);
//   };

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between">
//         <div>
//           <CardTitle>Svar och feedback</CardTitle>
//           <CardDescription>
//             Anpassa hur assistenten svarar på användares frågor och ger feedback.
//           </CardDescription>
//         </div>
//         <Button onClick={handleSave}>Spara ändringar</Button>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="space-y-2">
//           <Label htmlFor="success-message">Framgångsmeddelande</Label>
//           <Textarea
//             id="success-message"
//             value={settings.successMessage}
//             onChange={(e) => handleChange("successMessage", e.target.value)}
//             rows={4}
//           />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="incomplete-message">Meddelande vid ofullständig information</Label>
//           <Textarea
//             id="incomplete-message"
//             value={settings.incompleteMessage}
//             onChange={(e) => handleChange("incompleteMessage", e.target.value)}
//             rows={4}
//           />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
