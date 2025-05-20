import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    id: 1,
    question: "Kostar det något att använda Ansökshjälpen?",
    answer:
      "Basversionen av vår tjänst är kostnadsfri för alla användare. Vi erbjuder även en premiumversion med utökad personlig rådgivning och prioriterad support för 295 kr per månad. Du kan använda tjänsten så länge du behöver och avsluta när din ansökan är klar.",
  },
  {
    id: 2,
    question: "Hur lång tid tar hela ansökningsprocessen i genomsnitt?",
    answer:
      "Den totala tiden varierar beroende på komplexiteten i ditt ärende och vilken myndighet som handlägger ansökan. Med vår tjänst kan du räkna med att själva ansökningsförfarandet (insamling av dokument och ifyllande av formulär) tar ca 2-3 veckor. Handläggningstiden hos myndigheten är vanligtvis 6-12 veckor, men kan vara både kortare och längre.",
  },
  {
    id: 3,
    question: "Vad händer om min ansökan avslås trots hjälp från er tjänst?",
    answer:
      "Om din ansökan avslås erbjuder vi en grundlig analys av avslagsbeslutet och hjälper dig att utforma en överklagan om det finns grund för detta. Vår statistik visar att cirka 40% av överklaganden som förbereds med vår hjälp leder till ett ändrat beslut.",
  },
  {
    id: 4,
    question: "Kan arbetsgivaren använda er tjänst för att ansöka om hjälpmedel till anställda?",
    answer:
      "Ja, arbetsgivare kan använda vår tjänst för att hantera ansökningar för sina anställda. Vi erbjuder särskilda företagsabonnemang för organisationer som vill underlätta processen för flera anställda. Kontakta vår företagsavdelning för mer information.",
  },
  {
    id: 5,
    question: "Vilken typ av personlig information behöver jag dela med er tjänst?",
    answer:
      "För att kunna ge relevant vägledning behöver vi information om din funktionsnedsättning, arbetsuppgifter och vilka behov du har. All information hanteras i enlighet med GDPR och vi använder avancerad kryptering för att säkerställa att dina uppgifter är skyddade. Du kan när som helst begära att få dina uppgifter raderade.",
  },
];

export default function FAQSection() {
  return (
    <motion.section
      className="mb-8 w-full"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <motion.h2
              className="my-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Vanliga frågor
            </motion.h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Accordion type="single" className="w-full" collapsible>
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="cursor-pointer">{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="pb-2 leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
