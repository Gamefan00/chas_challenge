import query from "./supabaseQuery.js";

const defaultSystemMessageApplication = {
  role: "system",
  content: [
    {
      type: "input_text",
      text: `Du är expert på arbetshjälpmedel.

VIKTIGT: Identifiera först om användaren är Arbetstagare eller Arbetsgivare baserat på deras svar.
Var uppmärksam på att användaren kan stava fel, använda synonymer eller beskriva sin roll indirekt.

Om användaren skriver något som antyder att de är en arbetstagare, exempelvis att de:
- Är anställda
- Söker för sig själva
- Beskriver sin egen arbetssituation eller funktionsnedsättning
Då ska du behandla dem som ARBETSTAGARE.

Om användaren skriver något som antyder att de är en arbetsgivare, exempelvis att de:
- Är chef
- Representerar ett företag
- Ansöker för en anställd
- Beskriver en anställds situation
Då ska du behandla dem som ARBETSGIVARE.

Förtydliga alltid vilken roll du har uppfattat genom att säga "Som arbetstagare..." eller "Som arbetsgivare..." i ditt svar.

=== ARBETSTAGARE INSTRUKTIONER ===
Om användaren är en arbetstagare (anställd som ansöker för sig själv):
- Använd blankett FK 7545
- Fokusera på personliga behov och funktionsnedsättning
- Vägled genom personlig ansökan
- Hjälp med att beskriva egen arbetssituation

=== ARBETSGIVARE INSTRUKTIONER ===
Om användaren är en arbetsgivare (ansöker för en anställd):
- Använd blankett FK 7546
- Fokusera på anpassningar av arbetsplatsen
- Vägled genom ansökan för anställd
- Hjälp med att beskriva arbetsmiljön

=== ALLMÄNNA REGLER ===
Du vägleder användaren genom processen att ansöka om arbetshjälpmedel från Försäkringskassan, inklusive:
- Val av rätt blankett (FK 7545 eller FK 7546)
- Stöd med svar vid utredningssamtal
- Förklaringar av regler och lagar (t.ex. AML, HSL, Diskrimineringslagen)
- Textförslag för fritextfält
- Sekretesskyddad hantering av konversationer och dokument`,
    },
  ],
};

// Default step welcome messages for different roles
const defaultStepWelcomeMessagesApplication = {
  "step-1": {
    arbetstagare:
      "Välkommen till processen för att ansöka om arbetshjälpmedel! Som arbetstagare kommer vi att hjälpa dig fylla i blankett FK 7545. Berätta kort om din arbetssituation och vad du behöver hjälp med.",
    arbetsgivare:
      "Välkommen till processen för att ansöka om arbetshjälpmedel! Som arbetsgivare kommer vi att hjälpa dig fylla i blankett FK 7546 för din anställd. Berätta om vilken anställd du ansöker för och deras behov.",
  },
  "step-2": {
    arbetstagare:
      "Nu ska vi beskriva din funktionsnedsättning och hur den påverkar ditt arbete. Berätta om din diagnos, funktionsnedsättning och vilka begränsningar detta medför i ditt dagliga arbete.",
    arbetsgivare:
      "Nu ska vi beskriva den anställdas funktionsnedsättning och hur den påverkar arbetet. Berätta vad du vet om den anställdas funktionsnedsättning och hur detta påverkar deras arbetsuppgifter.",
  },
  "step-3": {
    arbetstagare:
      "I detta steg ska vi identifiera dina grundläggande behov för att kunna utföra ditt arbete. Vilka arbetsuppgifter har du svårt att utföra? Vilka specifika hinder möter du?",
    arbetsgivare:
      "I detta steg ska vi identifiera den anställdas grundläggande behov för att kunna utföra arbetet. Vilka arbetsuppgifter har den anställda svårt med? Vilka anpassningar tror du behövs?",
  },
  "step-4": {
    arbetstagare:
      "Nu ska vi undersöka andra behov som kan finnas för att du ska kunna utföra ditt arbete optimalt. Detta kan handla om sociala eller organisatoriska aspekter av arbetet.",
    arbetsgivare:
      "Nu ska vi undersöka andra behov som kan finnas för den anställda. Detta kan handla om arbetsmiljöanpassningar, tekniska lösningar eller organisatoriska förändringar.",
  },
  "step-5": {
    arbetstagare:
      "I detta steg ska vi gå igenom vilket stöd du redan får idag. Har du några hjälpmedel eller anpassningar på din arbetsplats? Får du stöd från andra aktörer?",
    arbetsgivare:
      "I detta steg ska vi gå igenom vilket stöd den anställda redan får idag. Vilka anpassningar eller hjälpmedel finns redan på arbetsplatsen? Vilket stöd får ni från andra aktörer?",
  },
  "step-6": {
    arbetstagare:
      "Nu är det dags att granska och sammanfatta din ansökan. Vi går igenom all information och ser till att din ansökan är komplett innan den skickas in.",
    arbetsgivare:
      "Nu är det dags att granska och sammanfatta ansökan för er anställda. Vi går igenom all information och ser till att ansökan är komplett innan den skickas in.",
  },
};

// Fetch application steps with role-based welcome messages
export async function fetchApplicationSteps() {
  let formattedApplicationSteps = {};
  try {
    const applicationStepsResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      ["applicationSteps"]
    );

    if (applicationStepsResult && applicationStepsResult.length > 0) {
      const stepsData = applicationStepsResult[0].value;

      // Build an object with role-based welcome messages
      for (const [step, content] of Object.entries(stepsData)) {
        if (
          content &&
          content.welcomeArbetstagare &&
          content.welcomeArbetsgivare
        ) {
          formattedApplicationSteps[step] = {
            arbetstagare: content.welcomeArbetstagare,
            arbetsgivare: content.welcomeArbetsgivare,
          };
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
    const appSystemResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1 AND category = $2",
      ["applicationSystemMessage", "AI-Behavior Configuration"]
    );

    if (appSystemResult && appSystemResult.length > 0) {
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
  return systemMessage;
}

// Function to get appropriate welcome message based on user role
export function getWelcomeMessageForRole(
  stepId,
  userRole = null,
  applicationSteps
) {
  const stepData = applicationSteps[stepId];

  if (!stepData) {
    return "Välkommen! Hur kan jag hjälpa dig?";
  }

  // If no role is set or role is unknown, use a neutral welcome message
  if (!userRole || userRole === "unknown") {
    // Specific neutral messages for each step that don't assume a role
    const neutralWelcomes = {
      "step-1":
        "Välkommen till ansökningsguiden för arbetshjälpmedel! För att ge dig bästa möjliga hjälp, behöver jag veta om du är arbetstagare (ansöker för dig själv) eller arbetsgivare (ansöker för en anställd)?",
      "step-2":
        "I detta steg ska vi beskriva funktionsnedsättningen. Men först behöver jag veta om du är arbetstagare eller arbetsgivare för att kunna ge rätt vägledning.",
      // Add similar neutral messages for all steps
    };

    return (
      neutralWelcomes[stepId] ||
      "Välkommen! För att ge dig bästa möjliga hjälp, behöver jag veta om du är arbetstagare eller arbetsgivare?"
    );
  }

  // If a role IS specified, use the appropriate message
  if (userRole === "arbetstagare" && stepData.arbetstagare) {
    return stepData.arbetstagare;
  } else if (userRole === "arbetsgivare" && stepData.arbetsgivare) {
    return stepData.arbetsgivare;
  }

  // Last resort fallback - but should be generic, not arbetstagare-specific
  return typeof stepData === "string"
    ? stepData
    : "Välkommen! Hur kan jag hjälpa dig?";
}

// Function to detect user role from conversation history
export function detectUserRole(messages) {
  // Skip empty messages array
  if (!messages || messages.length === 0) return "unknown";

  // Get the latest user message
  const latestUserMessages = messages
    .filter((msg) => msg.role === "user" || msg.role === "human")
    .map((msg) => msg.text || msg.content || "")
    .filter((text) => text.trim() !== "");

  if (latestUserMessages.length === 0) return "unknown";

  const latestMessage =
    latestUserMessages[latestUserMessages.length - 1].toLowerCase();

  // Expanded patterns that are more inclusive of different ways users might specify their role
  const arbetstagarePatterns = [
    // Original patterns
    /jag är (?:en)? ?arbetstagare/i,
    /jag ansöker för mig själv/i,
    /jag är anställd/i,
    /jag är den som behöver hjälpmedel/i,
    /som arbetstagare/i,
    /^arbetstagare$/i,
    /^anställd$/i,
    /arbetstagare/i,
  ];

  const arbetsgivarePatterns = [
    /jag är (?:en)? ?arbetsgivare/i,
    /jag ansöker för en anställd/i,
    /jag är chef/i,
    /jag representerar företaget/i,
    /som arbetsgivare/i,
    /^arbetsgivare$/i,
    /^chef$/i,
    /arbetsgivare/i,
  ];

  // Check for any arbetstagare pattern
  for (const pattern of arbetstagarePatterns) {
    if (pattern.test(latestMessage)) {
      return "arbetstagare";
    }
  }

  // Check for any arbetsgivare pattern
  for (const pattern of arbetsgivarePatterns) {
    if (pattern.test(latestMessage)) {
      return "arbetsgivare";
    }
  }

  // If no clear pattern, don't try to guess
  return "unknown";
}

// Rest of the existing functions remain the same...
export async function initializeApplicationConversations() {
  await fetchApplicationSystemMessageFromDB();
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

    // Use default arbetstagare welcome message for initialization
    const welcomeMessage = {
      role: "assistant",
      content: [
        {
          type: "output_text",
          text: getWelcomeMessageForRole(
            step,
            "arbetstagare",
            applicationSteps
          ),
        },
      ],
    };
    stepConversations[step] = [stepSystemMessage, welcomeMessage];
  }
}

export async function getApplicationStepsDescription(step) {
  try {
    const applicationStepsDescriptionResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      ["applicationSteps"]
    );

    if (
      applicationStepsDescriptionResult &&
      applicationStepsDescriptionResult.length > 0
    ) {
      let stepsData = applicationStepsDescriptionResult[0].value;

      if (
        typeof stepsData === "string" &&
        (stepsData.startsWith("{") || stepsData.startsWith("["))
      ) {
        try {
          stepsData = JSON.parse(stepsData);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
        }
      }

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

  const defaultStepDescriptionsApplication = {
    "step-1":
      "Välj ärendetyp - Hjälp användaren att bestämma om de ska använda blankett FK 7545 eller FK 7546 baserat på om de är arbetstagare eller arbetsgivare.",
    "step-2":
      "Funktionsnedsättning - Hjälp användaren att beskriva funktionsnedsättning och hur den påverkar arbetsförmågan.",
    "step-3":
      "Grundläggande behov - Hjälp användaren att identifiera vilka behov som finns för att kunna utföra arbetet.",
    "step-4":
      "Andra behov - Hjälp användaren att identifiera andra behov som kan finnas för att utföra arbetet.",
    "step-5":
      "Nuvarande stöd - Hjälp användaren att beskriva vilket stöd de får idag och från vilka aktörer.",
    "step-6":
      "Sammanfattning - Hjälp användaren att sammanfatta ansökan och kontrollera att all information finns med.",
  };

  console.log(`Using default description for ${step}`);
  return (
    defaultStepDescriptionsApplication[step] ||
    "Hjälp användaren med arbetshjälpmedel från Försäkringskassan."
  );
}

export async function refreshApplicationConversationSettings() {
  await fetchApplicationSystemMessageFromDB();

  for (const step in stepConversations) {
    if (stepConversations[step] && stepConversations[step].length > 0) {
      const stepDescription = await getApplicationStepsDescription(step);

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

      stepConversations[step][0] = updatedSystemMessage;
    }
  }

  console.log("Application conversation settings refreshed");
}

export { defaultSystemMessageApplication };
initializeApplicationConversations();
