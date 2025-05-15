import query from "./supabaseQuery.js";

// Define a default system message as fallback
const defaultSystemMessage = {
  role: "system",
  content: [
    {
      type: "input_text",
      text: "Du är expert på arbetshjälpmedel.\n\nRegler:\nDu vägleder användaren (individer eller arbetsgivare) genom processen att ansöka om arbetshjälpmedel från Försäkringskassan, inklusive:\nVal av rätt blankett (FK 7545 eller FK 7546)\nStöd med svar vid utredningssamtal\nFörklaringar av regler och lagar (t.ex. AML, HSL, Diskrimineringslagen)\nTextförslag för fritextfält\nSekretesskyddad hantering av konversationer och dokument",
    },
  ],
};
export { defaultSystemMessage };
// Welcome messages for each step
export const stepWelcomeMessages = {
  "step-1":
    "Välkommen till processen för att ansöka om arbetshjälpmedel! I detta första steg behöver vi bestämma vilken typ av ärende du har. \n\nÄr du en arbetstagare som behöver hjälpmedel för att kunna arbeta, eller representerar du en arbetsgivare som ansöker för en anställds räkning? Detta avgör vilken blankett som ska användas (FK 7545 eller FK 7546).",

  "step-2":
    "Nu ska vi beskriva din funktionsnedsättning och hur den påverkar ditt arbete. \n\nBerätta om din funktionsnedsättning, diagnos (om du har en) och vilka begränsningar den medför i arbetslivet. Detaljerad information här hjälper Försäkringskassan att förstå dina behov bättre.",

  "step-3":
    "I detta steg ska vi identifiera dina grundläggande behov för att kunna utföra ditt arbete. \n\nVilka arbetsuppgifter har du svårt att utföra på grund av din funktionsnedsättning? Vilka specifika hinder möter du i arbetet? Konkreta exempel hjälper till att bygga din ansökan.",

  "step-4":
    "Nu ska vi undersöka andra behov som kan finnas för att du ska kunna utföra ditt arbete. \n\nDetta kan handla om behov som inte är direkt kopplade till din funktionsnedsättning men som ändå påverkar din arbetsförmåga. Det kan också innefatta sociala eller organisatoriska aspekter av arbetet.",

  "step-5":
    "I detta steg ska vi gå igenom vilket stöd du redan får idag. \n\nBerätta om du har några hjälpmedel eller anpassningar på din arbetsplats idag, eller om du får stöd från andra aktörer som kommun, region, eller Arbetsförmedlingen. Detta är viktigt för att undvika dubbla insatser.",

  "step-6":
    "Nu är det dags att granska och sammanfatta din ansökan. \n\nLåt oss gå igenom den information du har delat och se till att din ansökan är komplett innan den skickas in. Jag kan hjälpa dig att formulera texten för fritextfälten i blanketten.",
};

export let systemMessage = defaultSystemMessage;
export let stepConversations = {};

// Fetch system message from database
export async function fetchSystemMessageFromDB() {
  try {
    // Get application system message from database
    const appSystemResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1 AND category = $2",
      ["applicationSystemMessage", "AI-Behavior Configuration"]
    );

    if (appSystemResult && appSystemResult.length > 0) {
      // Use the value directly without JSON.parse if it's already a string
      const systemMessageText = appSystemResult[0].value;
      if (systemMessageText) {
        systemMessage = {
          role: "system",
          content: [
            {
              type: "input_text",
              text: systemMessageText,
            },
          ],
        };
        console.log("System message loaded from database");
      }
    }
  } catch (error) {
    console.error("Error fetching system message from database:", error);
    console.log("Using default system message");
  }
}

export async function initializeConversations() {
  // First fetch the system message
  await fetchSystemMessageFromDB();

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

// Helper function to get step descriptions (keep as is)
export function getStepDescription(step) {
  switch (step) {
    case "step-1":
      return "Välj ärendetyp - Hjälp användaren att bestämma om de ska använda blankett FK 7545 eller FK 7546 baserat på om de är arbetstagare eller arbetsgivare.";
    case "step-2":
      return "Funktionsnedsättning - Hjälp användaren att beskriva sin funktionsnedsättning och hur den påverkar arbetsförmågan.";
    case "step-3":
      return "Grundläggande behov - Hjälp användaren att identifiera vilka behov som finns för att kunna utföra arbetet.";
    case "step-4":
      return "Andra behov - Hjälp användaren att identifiera andra behov som kan finnas för att utföra arbetet, som inte är direkt kopplade till funktionsnedsättningen.";
    case "step-5":
      return "Nuvarande stöd - Hjälp användaren att beskriva vilket stöd de får idag och från vilka aktörer.";
    case "step-6":
      return "Granska och skicka - Hjälp användaren att sammanfatta sin ansökan och kontrollera att all nödvändig information finns med.";
    default:
      return "Hjälp användaren med arbetshjälpmedel från Försäkringskassan.";
  }
}

// Initialize conversations on startup
initializeConversations();
