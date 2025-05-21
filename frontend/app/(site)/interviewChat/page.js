"use client";

import ChatComponent from "@/components/chatpage/ChatComponent";

// Define steps for reference in the component
const steps = [
  {
    id: "step-1",
    label: "Beskriv dig själv",
    heading: "Kan du kort berätta om dig själv och din nuvarande arbetssituation?",
  },
  {
    id: "step-2",
    label: "Diagnos och påverkan",
    heading: "Vilken funktionsnedsättning har du, och hur påverkar den dig i arbetslivet?",
  },
  {
    id: "step-3",
    label: "Utmaningar i arbetet",
    heading: "Vilka arbetsuppgifter har du svårast med på grund av din funktionsnedsättning?",
  },
  {
    id: "step-4",
    label: "Tidigare hjälpmedel",
    heading: "Har du använt några hjälpmedel tidigare? Vad fungerade bra/dåligt?",
  },
  {
    id: "step-5",
    label: "Arbetsmiljö",
    heading: "Hur ser din fysiska och sociala arbetsmiljö ut idag?",
  },
  {
    id: "step-6",
    label: "Kommunikation och samspel",
    heading: "Har du behov av stöd i kommunikation eller samspel med kollegor eller kunder?",
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
