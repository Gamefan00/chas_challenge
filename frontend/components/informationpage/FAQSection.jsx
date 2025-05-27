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
      "Nej, Ansökshjälpen är helt kostnadsfri att använda. Tjänsten är framtagen för att hjälpa dig genom din ansökan utan kostnad, och du kan använda den så länge du behöver.",
  },
  {
    id: 2,
    question: "Hur lång tid tar hela ansökningsprocessen via Försäkringskassan?",
    answer:
      "Det tar normalt två månader från att du skickade in ansökan till att du får ett beslut. Men det kan ta längre tid om det saknas nödvändiga underlag.",
  },
  {
    id: 3,
    question: "Vad händer om min ansökan avslås trots hjälp från er tjänst?",
    answer:
      "Vi kan tyvärr inte garantera ett positivt resultat för alla ansökningar, men genom vår hjälp ökar chansen att få arbetshjälpmedel. Vår tjänst är ett stöd genom hela ansökningsprocessen, men beslutet fattas alltid av den ansvariga myndigheten och ligger utanför vår kontroll.",
  },
  {
    id: 4,
    question: "Kan arbetsgivaren använda er tjänst för att ansöka om hjälpmedel till anställda?",
    answer:
      "Ja, arbetsgivare kan använda vår tjänst för att hantera ansökningar för sina anställda.",
  },
  {
    id: 5,
    question: "Vilken typ av personlig information behöver jag dela med er tjänst?",
    answer:
      "För att kunna ge relevant vägledning behöver vi information om din funktionsnedsättning, arbetsuppgifter och vilka behov du har. All information hanteras i enlighet med GDPR och vi använder avancerad kryptering för att säkerställa att dina uppgifter är skyddade. Du kan när som helst begära att få dina uppgifter raderade. Informationen raderas automatiskt efter 100 dagar.",
  },
];

export default function FAQSection() {
  return (
    <motion.section
      className="mb-8 w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ y: 0, opacity: 100 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <motion.h2
              className="my-8 text-center"
              initial={{ opacity: 0, y: 10 }}
      animate={{ y: 0, opacity: 100 }}
      transition={{ duration: 0.5 }}
            >
              Vanliga frågor
            </motion.h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 10 }}
      animate={{ y: 0, opacity: 100 }}
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
