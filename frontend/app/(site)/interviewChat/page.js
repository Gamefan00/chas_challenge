"use client";

import ChatComponent from "@/components/chatpage/ChatComponent";

// Define steps for reference in the component
const steps = [
  {
    id: "step-1",
    label: "Arbetsuppgifter",
    heading: "Kan du beskriva vilka arbetsuppgifter som ingår i rollen?",
  },
  {
    id: "step-2",
    label: "Svårigheter i arbetet",
    heading: "Finns det arbetsuppgifter som är svåra att utföra eller problematiska?",
  },
  {
    id: "step-3",
    label: "Tidigare lösningar",
    heading: "Har ni försökt lösa eller anpassa arbetsuppgifterna tidigare?",
  },
  {
    id: "step-4",
    label: "Arbetsmiljö",
    heading: "Hur ser arbetsmiljön och förutsättningarna på arbetsplatsen ut?",
  },
  {
    id: "step-5",
    label: "Gjorda åtgärder",
    heading: "Vilka åtgärder har redan gjorts för att underlätta arbetet?",
  },
  {
    id: "step-6",
    label: "Stöd utanför arbetet",
    heading: "Finns det stöd eller hjälpmedel från hälso- och sjukvården?",
  },
  {
    id: "step-7",
    label: "Arbete vs Fritid",
    heading: "Hur skiljer sig behoven på arbetet jämfört med fritiden?",
  },
  {
    id: "step-8",
    label: "Användning av hjälpmedel",
    heading: "Vem ska använda hjälpmedlet och hur i arbetet?",
  },
  {
    id: "step-9",
    label: "Ekonomi och ansvar",
    heading: "Finns ekonomiskt stöd eller andra möjligheter för hjälpmedlet?",
  },
  {
    id: "step-10",
    label: "Sammanfattning",
    heading: "Sammanfattning av intervjun",
  },
];

export default function InterviewChat() {
  return (
    <ChatComponent
      steps={steps}
      historyEndpoint="/history/interview"
      welcomeEndpoint="/chat/interview/welcome"
      type="interview"
    />
  );
}
