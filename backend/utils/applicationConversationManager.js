import query from "./supabaseQuery.js";

// Define a default system message as fallback
const defaultSystemMessageApplication = {
  role: "system",
  content: [
    {
      type: "input_text",
      text: "Du är expert på arbetshjälpmedel.\n\nRegler:\nDu vägleder användaren (individer eller arbetsgivare) genom processen att ansöka om arbetshjälpmedel från Försäkringskassan, inklusive:\nVal av rätt blankett (FK 7545 eller FK 7546)\nStöd med svar vid utredningssamtal\nFörklaringar av regler och lagar (t.ex. AML, HSL, Diskrimineringslagen)\nTextförslag för fritextfält\nSekretesskyddad hantering av konversationer och dokument",
    },
  ],
};
export { defaultSystemMessageApplication };
const defaultStepWelcomeMessagesApplication = {
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
const defaultStepDescriptionsApplication = {
  "step-1":
    "Välj ärendetyp - Hjälp användaren att bestämma om de ska använda blankett FK 7545 eller FK 7546 baserat på om de är arbetstagare eller arbetsgivare.",
  "step-2":
    "Funktionsnedsättning - Hjälp användaren att beskriva sin funktionsnedsättning och hur den påverkar arbetsförmågan.",
  "step-3":
    "Grundläggande behov - Hjälp användaren att identifiera vilka behov som finns för att kunna utföra arbetet.",
  "step-4":
    "Andra behov - Hjälp användaren att identifiera andra behov som kan finnas för att utföra arbetet, som inte är direkt kopplade till funktionsnedsättningen.",
  "step-5":
    "Nuvarande stöd - Hjälp användaren att beskriva vilket stöd de får idag och från vilka aktörer.",
  "step-6":
    "Granska och skicka - Hjälp användaren att sammanfatta sin ansökan och kontrollera att all nödvändig information finns med.",
};

// Welcome messages for each step
// Query to fetch applicationSteps from admin_setting
export async function fetchApplicationSteps() {
  let formattedApplicationSteps = {};
  try {
    const applicationStepsResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      ["applicationSteps"]
    );

    if (applicationStepsResult && applicationStepsResult.length > 0) {
      // Parse the JSON value from the database
      const stepsData = applicationStepsResult[0].value;

      // Build an object with the required structure
      for (const [step, content] of Object.entries(stepsData)) {
        if (content && content.welcome) {
          formattedApplicationSteps[step] = content.welcome;
        }
      }

      console.log("Application steps loaded from database");
      return formattedApplicationSteps;
    }
  } catch (error) {
    console.error("Error fetching applicationSteps from database:", error);
  }

  // Return default steps if database fetch fails
  console.log("Using default application steps");
  return defaultStepWelcomeMessagesApplication;
}

let systemMessage = defaultSystemMessageApplication;
export let stepConversations = {};

// Fetch system message from database

export async function fetchApplicationSystemMessageFromDB() {
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
  // Always return the system message, whether it's the updated one or the default
  return systemMessage;
}

export async function initializeApplicationConversations() {
  // First fetch the system message
  await fetchApplicationSystemMessageFromDB();

  // Then fetch application steps
  const applicationSteps = await fetchApplicationSteps();

  stepConversations = {
    "step-1": [systemMessage],
    "step-2": [systemMessage],
    "step-3": [systemMessage],
    "step-4": [systemMessage],
    "step-5": [systemMessage],
    "step-6": [systemMessage],
  };

  for (const step in stepConversations) {
    const stepDescription = await getApplicationStepsDescription(step);

    const stepSystemMessage = {
      ...systemMessage,
      content: [
        ...systemMessage.content,
        {
          type: "input_text",
          text: `Step instructions: ${stepDescription}`,
        },
      ],
    };

    const welcomeMessage = {
      role: "assistant",
      content: [
        {
          type: "output_text",
          text:
            applicationSteps[step] ||
            defaultStepWelcomeMessagesApplication[step],
        },
      ],
    };
    stepConversations[step] = [stepSystemMessage, welcomeMessage];
  }
}

// Helper function to get step descriptions
export async function getApplicationStepsDescription(step) {
  try {
    // Always fetch fresh data from database
    const applicationStepsDescriptionResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      ["applicationSteps"]
    );

    if (
      applicationStepsDescriptionResult &&
      applicationStepsDescriptionResult.length > 0
    ) {
      // Handle the database value properly
      let stepsData = applicationStepsDescriptionResult[0].value;

      // If the value is a string and looks like JSON, try to parse it
      if (
        typeof stepsData === "string" &&
        (stepsData.startsWith("{") || stepsData.startsWith("["))
      ) {
        try {
          stepsData = JSON.parse(stepsData);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          // Continue with the string value if parsing fails
        }
      }

      // Check if the step exists and has a description property
      if (stepsData && stepsData[step] && stepsData[step].description) {
        console.log(
          `Application description for ${step} loaded from database:`,
          stepsData[step].description
        );
        return stepsData[step].description;
      }
    }
  } catch (error) {
    console.error("Error fetching step descriptions from database:", error);
  }

  // If we reach here, either there was an error or no valid description was found
  console.log(`Using default description for ${step}`);
  return (
    defaultStepDescriptionsApplication[step] ||
    "Hjälp användaren med arbetshjälpmedel från Försäkringskassan."
  );
}

export async function refreshApplicationConversationSettings() {
  // Fetch fresh system message
  await fetchApplicationSystemMessageFromDB();

  // Refresh step conversations with new system message
  for (const step in stepConversations) {
    if (stepConversations[step] && stepConversations[step].length > 0) {
      // Get fresh step description
      const stepDescription = await getApplicationStepsDescription(step);

      // Update the system message in the conversation
      const updatedSystemMessage = {
        role: "system",
        content: [
          ...systemMessage.content,
          {
            type: "input_text",
            text: `Step instructions: ${stepDescription}`,
          },
        ],
      };

      // Replace the system message in the conversation
      stepConversations[step][0] = updatedSystemMessage;
    }
  }

  console.log("Application conversation settings refreshed");
}

// Initialize conversations on startup
initializeApplicationConversations();
