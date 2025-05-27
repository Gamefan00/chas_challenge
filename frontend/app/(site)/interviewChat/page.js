"use client";

import ChatComponent from "@/components/chatpage/ChatComponent";

// Define steps for reference in the component
const steps = [
  {
    id: "step-1",
    label: "Bakgrund",
    heading: "Kan du kort berätta om arbetssituationen och bakgrunden?",
  },
  {
    id: "step-2",
    label: "Funktionsnedsättning",
    heading: "Vilken funktionsnedsättning gäller, och hur påverkar den arbetet?",
  },
  {
    id: "step-3",
    label: "Arbetsutmaningar",
    heading: "Vilka arbetsuppgifter är mest utmanande på grund av funktionsnedsättningen?",
  },
  {
    id: "step-4",
    label: "Tidigare erfarenheter",
    heading: "Har det använts några hjälpmedel tidigare? Vad fungerade bra/dåligt?",
  },
  {
    id: "step-5",
    label: "Arbetsmiljö",
    heading: "Hur ser den fysiska och sociala arbetsmiljön ut idag?",
  },
  {
    id: "step-6",
    label: "Kommunikation och samspel",
    heading: "Finns det behov av stöd i kommunikation eller samspel med kollegor eller kunder?",
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
