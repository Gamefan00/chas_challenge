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
  {
    id: "step-7",
    label: "Kognitiva behov",
    heading:
      "Har du svårt att koncentrera dig, planera, komma ihåg eller strukturera arbetsuppgifter?",
  },
  {
    id: "step-8",
    label: "Fysiska behov",
    heading:
      "Behöver du fysiska anpassningar i din arbetsmiljö, t.ex. ergonomiska möbler eller hjälpmedel?",
  },
  {
    id: "step-9",
    label: "Digitala hjälpmedel",
    heading: "Använder du dator, mobil eller annan teknik i arbetet? Vad behöver du där?",
  },
  {
    id: "step-10",
    label: "Resor och transporter",
    heading: "Behöver du hjälp med att ta dig till och från arbetet?",
  },
  {
    id: "step-11",
    label: "Tidsaspekter",
    heading: "Behöver du anpassning av arbetstider eller arbetstakt?",
  },
  {
    id: "step-12",
    label: "Stöd från arbetsgivare",
    heading: "Får du idag något stöd från din arbetsgivare? Vad fungerar bra/mindre bra?",
  },
  {
    id: "step-13",
    label: "Stöd från andra aktörer",
    heading:
      "Har du kontakt med andra instanser, t.ex. arbetsförmedlingen, företagshälsovård eller sjukvård?",
  },
  {
    id: "step-14",
    label: "Önskade hjälpmedel",
    heading: "Vad tror du skulle hjälpa dig att utföra ditt arbete bättre?",
  },
  {
    id: "step-15",
    label: "Sammanfattning och avslut",
    heading: "Vill du lägga till något innan vi avslutar intervjun?",
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
