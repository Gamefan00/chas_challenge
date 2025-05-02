export const systemMessage = {
  role: "system",
  content: [
    {
      type: "input_text",
      text: `Du är expert på arbetshjälpmedel.
  
  Regler:
  Du vägleder användaren (individer eller arbetsgivare) genom processen att ansöka om arbetshjälpmedel från Försäkringskassan, inklusive:
  Val av rätt blankett (FK 7545 eller FK 7546)
  Stöd med svar vid utredningssamtal
  Förklaringar av regler och lagar (t.ex. AML, HSL, Diskrimineringslagen)
  Textförslag för fritextfält
  Sekretesskyddad hantering av konversationer och dokument`,
    },
  ],
};

export const stepWelcomeMessages = {
  "step-1":
    "Välkommen till processen för att ansöka om arbetshjälpmedel! [...]",
  "step-2": "Nu ska vi beskriva din funktionsnedsättning [...]",
  "step-3": "I detta steg ska vi identifiera dina grundläggande behov [...]",
  "step-4": "Nu ska vi undersöka andra behov som kan finnas [...]",
  "step-5": "I detta steg ska vi gå igenom vilket stöd du redan får [...]",
  "step-6": "Nu är det dags att granska och sammanfatta din ansökan [...]",
};

export let stepConversations = {};

export function initializeConversations() {
  stepConversations = {
    "step-1": [systemMessage],
    "step-2": [systemMessage],
    "step-3": [systemMessage],
    "step-4": [systemMessage],
    "step-5": [systemMessage],
    "step-6": [systemMessage],
  };

  for (const step in stepConversations) {
    const welcomeMessage = {
      role: "assistant",
      content: [
        {
          type: "output_text",
          text: stepWelcomeMessages[step],
        },
      ],
    };

    stepConversations[step] = [systemMessage, welcomeMessage];
  }
}

export function getStepDescription(step) {
  switch (step) {
    case "step-1":
      return "Välj ärendetyp [...]";
    case "step-2":
      return "Funktionsnedsättning [...]";
    case "step-3":
      return "Grundläggande behov [...]";
    case "step-4":
      return "Andra behov [...]";
    case "step-5":
      return "Nuvarande stöd [...]";
    case "step-6":
      return "Granska och skicka [...]";
    default:
      return "Hjälp användaren med arbetshjälpmedel från Försäkringskassan.";
  }
}

// Initialize at import
initializeConversations();
