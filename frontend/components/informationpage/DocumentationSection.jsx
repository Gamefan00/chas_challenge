import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Briefcase, Receipt, UserCircle, Copy } from "lucide-react";

const documents = [
  {
    title: "Läkarintyg/Medicinskt utlåtande",
    description:
      "Ett aktuellt intyg som beskriver din funktionsnedsättning och dess påverkan på arbetsförmågan.",
    icon: <FileText className="text-primary h-6 w-6" />,
    tip: "Bör inte vara äldre än 6 månader",
  },
  {
    title: "Arbetsterapeututlåtande",
    description:
      "Bedömning från arbetsterapeut om vilka hjälpmedel som kan underlätta din arbetssituation.",
    icon: <CheckCircle className="text-primary h-6 w-6" />,
  },
  {
    title: "Arbetsgivarintyg",
    description: "Bekräftelse från arbetsgivare om anställning och beskrivning av arbetsuppgifter.",
    icon: <Briefcase className="text-primary h-6 w-6" />,
  },
  {
    title: "Offert för hjälpmedel",
    description: "Prisförslag från leverantör av de hjälpmedel som ansökan gäller.",
    icon: <Receipt className="text-primary h-6 w-6" />,
  },
  {
    title: "Personbevis",
    description: "För att bekräfta din identitet och adress.",
    icon: <UserCircle className="text-primary h-6 w-6" />,
  },
];

export default function DocumentationSection() {
  const copyToClipboard = () => {
    const list = documents.map((doc) => `• ${doc.title}: ${doc.description}`).join("\n");
    navigator.clipboard.writeText(list);

    // Visual feedback without toast
    const button = document.querySelector(".copy-button");
    const originalText = button.querySelector("span").textContent;
    button.querySelector("span").textContent = "Kopierad!";
    setTimeout(() => {
      button.querySelector("span").textContent = originalText;
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ y: 0, opacity: 100 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hiddens mb-8">
        <CardHeader>
          <CardTitle className="text-center">
            <span className="text-center text-xl md:text-2xl">
              Nödvändig dokumentation till Försäkringskassan
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {documents.map((doc, index) => (
              <motion.div
              key={index}
                 initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="rounded-lg border p-4 shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">{doc.icon}</div>
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h3 className="font-semibold">{doc.title}</h3>
                        </TooltipTrigger>
                      </Tooltip>
                    </TooltipProvider>
                    <p className="text-muted-foreground mt-1 text-sm">{doc.description}</p>
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
