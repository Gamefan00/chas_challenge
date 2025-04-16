import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  // Array of FAQ data containing questions and their corresponding answers
  const faqData = [
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
  ];

  return (
    <motion.section
      className="w-full"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <motion.h2
              className="my-8 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Accordion type="single" className="w-full" collapsible>
              {faqData.map((faq, index) => (
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
};

export default FAQ;
