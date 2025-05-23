import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Bedömning av behov",
    description:
      "Första steget är att få en bedömning av dina specifika behov. Detta görs ofta i samråd med en arbetsterapeut, läkare eller annan specialist som kan dokumentera vilka hjälpmedel som kan underlätta din arbetssituation.",
  },
  {
    title: "Insamling av dokumentation",
    description:
      "Du behöver samla in relevant medicinsk dokumentation, arbetsplatsbeskrivning och annan information som styrker ditt behov. Vår tjänst hjälper dig att identifiera exakt vilka dokument du behöver.",
  },
  {
    title: "Ifyllande av ansökningsformulär",
    description:
      "Vår AI-assistent hjälper dig att fylla i ansökningsformulären korrekt och fullständigt, vilket minimerar risken för avslag på grund av formella brister.",
  },
  {
    title: "Inlämning av ansökan",
    description:
      "Efter att alla dokument är samlade och formulär ifyllda, lämnas ansökan in till relevant myndighet eller organisation. Vi guidar dig till rätt instans.",
  },
  {
    title: "Uppföljning under handläggning",
    description:
      "Under handläggningstiden kan kompletteringar behövas. Vi hjälper dig att förstå vad som efterfrågas och hur du bäst bemöter detta.",
  },
  {
    title: "Beslut och eventuell överklagan",
    description:
      "När beslut är fattat hjälper vi dig att förstå beslutet. Om ansökan avslås hjälper vi dig att bedöma om en överklagan är lämplig och hur den i så fall ska utformas.",
  },
];

export default function StepsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="border-b pb-2">Steg-för-steg i ansökningsprocessen</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-6 font-semibold"
          >
            Här är en detaljerad beskrivning av ansökningsprocessen från start till slut:
          </motion.p>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="border-b p-4"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <Badge
                    variant="outline"
                    className="bg-primary text-primary-foreground flex h-8 w-8 rounded-full"
                  >
                    {index + 1}
                  </Badge>
                  <div>
                    <h3 className="font-extrabold">{step.title}</h3>
                    <p className="text-foreground mt-1">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
