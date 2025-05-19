"use client";

import ChatComponent from "@/components/chatpage/ChatComponent";

// Define steps for reference in the component
const steps = [
  { id: "step-1", label: "Välj ärendetyp", heading: "Vem ansöker?" },
  { id: "step-2", label: "Funktionsnedsättning", heading: "Om din funktionsnedsättning" },
  { id: "step-3", label: "Grundläggande behov", heading: "Dina arbetsrelaterade behov" },
  { id: "step-4", label: "Andra behov", heading: "Övriga behov i arbetet" },
  { id: "step-5", label: "Nuvarande stöd", heading: "Stöd du redan får" },
  { id: "step-6", label: "Granska och skicka", heading: "Sammanfatta och ladda ner" },
];

export default function ApplicationChat() {
  return (
    <ChatComponent
      steps={steps}
      historyEndpoint="/history"
      welcomeEndpoint="/chat/welcome"
      type="application"
    />
  );
}
