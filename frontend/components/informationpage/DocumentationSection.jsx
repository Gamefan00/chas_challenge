import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const documents = [
  {
    title: "Läkarintyg/Medicinskt utlåtande",
    description:
      "Ett aktuellt intyg som beskriver din funktionsnedsättning och dess påverkan på arbetsförmågan.",
  },
  {
    title: "Arbetsterapeututlåtande",
    description:
      "Bedömning från arbetsterapeut om vilka hjälpmedel som kan underlätta din arbetssituation.",
  },
  {
    title: "Arbetsgivarintyg",
    description: "Bekräftelse från arbetsgivare om anställning och beskrivning av arbetsuppgifter.",
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

export default function DocumentationSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Nödvändig dokumentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <motion.div
                key={index}
                className="flex items-start border-b p-3"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                <div className="mr-4">📄</div>
                <div>
                  <h3 className="font-semibold">{doc.title}</h3>
                  <p className="text-foreground mt-1">{doc.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
