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
        "Arbetshjälpmedel är produkter eller anpassningar som kompenserar för en funktionsnedsättning och gör det möjligt för en person att få eller behålla ett arbete. Det kan till exempel vara specialprogramvara, tekniska hjälpmedel eller annan utrustning som är särskilt utformad utifrån individens behov. Försäkringskassan kan ge ekonomiskt stöd för sådana hjälpmedel, men inte för utrustning som räknas som vanlig arbetsmiljöutrustning – till exempel höj- och sänkbara skrivbord eller ergonomiska stolar.",
    },
    {
      id: 2,
      question: "Vem kan ansöka om arbetshjälpmedel?",
      answer:
        "Du kan ansöka om arbetshjälpmedel om du har en funktionsnedsättning som påverkar din arbetsförmåga, är anställd eller egenföretagare, och har arbetat i minst 12 månader.  Du ska också vara mellan 18 och 69 år och försäkrad i Sverige. Om du är arbetssökande eller om du är precis i början av din ansälllning, ska du istället vända dig till Arbetsförmedlingen.",
    },
   
    {
      id: 3,
      question: "Hur fungerar ett utredningssamtal?",
      answer:
        "Ett utredningssamtal är ett möte där dina behov kartläggs. En handläggare kontaktar dig och eventuellt din arbetsgivare för att diskutera vilka hjälpmedel som kan underlätta ditt arbete.",
    },
    {
      id: 4,
      question: "Sparas mina uppgifter på Ansökshjälpen?",
      answer:
        "Dina uppgifter sparas i upp till 100 dagar om du samtycker till kakor (cookies). Om du inte godkänner kakor försvinner all data när du stänger ner webbläsarfönstret. All hantering sker i enlighet med GDPR och informationen delas aldrig med tredje part utan ditt samtycke.",
    },
  ];

  return (
    <motion.section
      id="vanligaFrågor"
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
