import query from "./supabaseQuery.js";

// Define default system messages with role-based instructions
const defaultSystemMessageInterview = {
  role: "system",
  content: [
    {
      type: "input_text",
      text: `Du är en intervjuassistent för arbetshjälpmedel som hjälper till att samla information systematiskt.

VIKTIGT: Identifiera först om användaren är Arbetstagare eller Arbetsgivare baserat på deras svar.
Var uppmärksam på att användaren kan stava fel, använda synonymer eller beskriva sin roll indirekt.

Om användaren skriver något som antyder att de är en arbetstagare, exempelvis att de:
- Är anställda eller skriver "arbetstagare" (även med stavfel som "arbetstakare" eller liknande)
- Söker för sig själva
- Beskriver sin egen arbetssituation eller funktionsnedsättning
Då ska du behandla dem som ARBETSTAGARE.

Om användaren skriver något som antyder att de är en arbetsgivare, exempelvis att de:
- Är chef eller skriver "arbetsgivare" (även med stavfel som "arbetgivare" eller liknande)
- Representerar ett företag
- Ansöker för en anställd
- Beskriver en anställds situation
Då ska du behandla dem som ARBETSGIVARE.

Förtydliga alltid vilken roll du har uppfattat genom att säga "Som arbetstagare..." eller "Som arbetsgivare..." i början av ditt svar.

=== ARBETSTAGARE INSTRUKTIONER ===
Om användaren är en arbetstagare (anställd som behöver hjälp):
- Ställ personliga frågor om funktionsnedsättning
- Fokusera på individuella behov och utmaningar
- Fråga om personliga erfarenheter av arbetet
- Hjälp att formulera egna behov

=== ARBETSGIVARE INSTRUKTIONER ===
Om användaren är en arbetsgivare (som intervjuar för en anställd):
- Ställ frågor om den anställdas situation
- Fokusera på arbetsmiljöanpassningar
- Fråga om organisatoriska förändringar
- Hjälp att identifiera stödbehov för den anställda

=== ALLMÄNNA REGLER ===
- Använd en strukturerad intervjuprocess
- Ställ följdfrågor för att få djupare förståelse
- Dokumentera svar systematiskt
- Var empatisk och professionell`,
    },
  ],
};

// Default step welcome messages for different roles
const defaultStepWelcomeMessagesInterview = {
  "step-1": {
    arbetstagare:
      "Välkommen till intervjun om arbetshjälpmedel! Kan du kort berätta om dig själv och din nuvarande arbetssituation? Vad arbetar du med och vilka utmaningar upplever du?",
    arbetsgivare:
      "Välkommen till intervjun om arbetshjälpmedel! Kan du berätta om den anställda som ni vill ansöka hjälpmedel för? Vad arbetar personen med och vilka utmaningar har ni observerat?",
  },
  "step-2": {
    arbetstagare:
      "Nu vill jag höra mer om din funktionsnedsättning. Kan du berätta om din diagnos eller funktionsnedsättning och hur den påverkar dig i arbetslivet? Vad blir svårast för dig?",
    arbetsgivare:
      "Nu vill jag höra mer om den anställdas funktionsnedsättning. Vad vet ni om personens diagnos eller funktionsnedsättning? Hur påverkar det deras arbete enligt vad ni har observerat?",
  },
  "step-3": {
    arbetstagare:
      "Låt oss fokusera på dina specifika arbetsuppgifter. Vilka arbetsuppgifter har du svårast med på grund av din funktionsnedsättning? Kan du ge konkreta exempel?",
    arbetsgivare:
      "Låt oss fokusera på den anställdas specifika arbetsuppgifter. Vilka arbetsuppgifter har personen svårast med? Vilka konkreta hinder har ni observerat i deras dagliga arbete?",
  },
  "step-4": {
    arbetstagare:
      "Har du använt några hjälpmedel eller fått anpassningar tidigare? Vad har fungerat bra och vad har varit mindre bra? Finns det något du har testat på egen hand?",
    arbetsgivare:
      "Har ni provat några hjälpmedel eller anpassningar för den anställda tidigare? Vad har fungerat bra på arbetsplatsen och vad behöver förbättras?",
  },
  "step-5": {
    arbetstagare:
      "Berätta om din arbetsmiljö. Hur ser din arbetsplats ut fysiskt? Hur fungerar samarbetet med kollegor och chefer? Finns det miljöfaktorer som påverkar dig?",
    arbetsgivare:
      "Berätta om arbetsmiljön för den anställda. Hur ser arbetsplatsen ut fysiskt? Hur fungerar samarbetet i teamet? Finns det miljöfaktorer som påverkar personens arbetsförmåga?",
  },
  "step-6": {
    arbetstagare:
      "Avslutningsvis, hur fungerar kommunikation och samspel med dina kollegor och kunder? Finns det situationer där du behöver extra stöd för att kommunicera effektivt?",
    arbetsgivare:
      "Avslutningsvis, hur fungerar kommunikation och samspel för den anställda med kollegor och kunder? Finns det situationer där personen behöver extra stöd för att kommunicera effektivt?",
  },
};

// Fetch interview steps with role-based welcome messages
export async function fetchInterviewSteps() {
  let formattedInterviewSteps = {};
  try {
    const interviewStepsResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      ["interviewSteps"]
    );

    if (interviewStepsResult && interviewStepsResult.length > 0) {
      const stepsData = interviewStepsResult[0].value;

      // Build an object with role-based welcome messages
      for (const [step, content] of Object.entries(stepsData)) {
        if (
          content &&
          content.welcomeArbetstagare &&
          content.welcomeArbetsgivare
        ) {
          formattedInterviewSteps[step] = {
            arbetstagare: content.welcomeArbetstagare,
            arbetsgivare: content.welcomeArbetsgivare,
          };
        }
      }

      console.log("Interview steps loaded from database");
      return formattedInterviewSteps;
    }
  } catch (error) {
    console.error("Error fetching interviewSteps from database:", error);
  }

  // Return default steps if database fetch fails
  console.log("Using default interview steps");
  return defaultStepWelcomeMessagesInterview;
}

let systemMessage = defaultSystemMessageInterview;
export let stepConversations = {};

// Fetch system message from database
export async function fetchInterviewSystemMessageFromDB() {
  try {
    const appSystemResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1 AND category = $2",
      ["interviewSystemMessage", "AI-Behavior Configuration"]
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
        console.log("Interview system message loaded from database");
      }
    }
  } catch (error) {
    console.error(
      "Error fetching interview system message from database:",
      error
    );
    console.log("Using default interview system message");
  }
  return systemMessage;
}

// Function to get appropriate welcome message based on user role
export function getWelcomeMessageForRole(step, role, interviewSteps) {
  // If no role is provided, return a default message asking for role
  if (!role) {
    // Default welcome messages that explicitly ask for user role
    const defaultWelcomeMessages = {
      "step-1":
        "Välkommen till utredningssamtalsverktyget! För att ge dig bästa möjliga hjälp, behöver jag veta om du är arbetstagare eller arbetsgivare?",
      "step-2":
        "I detta steg ska vi förbereda för utredningssamtalet. För att anpassa mina råd, kan du berätta om du är arbetstagare eller arbetsgivare?",
      "step-3":
        "Välkommen till steg 3! För att ge dig rätt stöd, behöver jag veta om du är arbetstagare eller arbetsgivare?",
      "step-4":
        "I detta steg ska vi diskutera specifika frågor. För att anpassa mina råd, är du arbetstagare eller arbetsgivare?",
      "step-5":
        "Välkommen till steg 5! För bästa möjliga hjälp, kan du berätta om du är arbetstagare eller arbetsgivare?",
      "step-6":
        "Välkommen till sista steget! För att anpassa mina råd, är du arbetstagare eller arbetsgivare?",
    };

    // Return default message for current step or a generic one if step not found
    return (
      defaultWelcomeMessages[step] ||
      "Välkommen till utredningssamtalsverktyget! För att ge dig bästa möjliga hjälp, behöver jag veta om du är arbetstagare eller arbetsgivare?"
    );
  }

  // For arbetstagare
  if (role === "arbetstagare") {
    const employeeWelcomeMessages = interviewSteps[step]
      ?.employeeWelcomeMessage || {
      "step-1":
        "Välkommen till utredningssamtalsverktyget! Som arbetstagare kan jag hjälpa dig att förbereda dig för samtal med Försäkringskassan.",
      // Add default messages for other steps
    };
    return (
      employeeWelcomeMessages[step] ||
      "Välkommen! Som arbetstagare kan jag hjälpa dig att förbereda dig för samtal med Försäkringskassan."
    );
  }

  // For arbetsgivare
  if (role === "arbetsgivare") {
    const employerWelcomeMessages = interviewSteps[step]
      ?.employerWelcomeMessage || {
      "step-1":
        "Välkommen till utredningssamtalsverktyget! Som arbetsgivare kan jag hjälpa dig att förbereda för samtal med Försäkringskassan.",
      // Add default messages for other steps
    };
    return (
      employerWelcomeMessages[step] ||
      "Välkommen! Som arbetsgivare kan jag hjälpa dig att förbereda för samtal med Försäkringskassan."
    );
  }

  // If role is something else or invalid, provide a generic welcome
  return (
    interviewSteps[step]?.welcomeMessage ||
    "Välkommen till utredningssamtalsverktyget! För att ge dig bästa möjliga hjälp, behöver jag veta om du är arbetstagare eller arbetsgivare?"
  );
}

// Function to detect user role from conversation history (same as application)
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
    // Original patterns
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

export async function initializeInterviewConversations() {
  await fetchInterviewSystemMessageFromDB();
  const interviewSteps = await fetchInterviewSteps();

  stepConversations = {
    "step-1": [systemMessage],
    "step-2": [systemMessage],
    "step-3": [systemMessage],
    "step-4": [systemMessage],
    "step-5": [systemMessage],
    "step-6": [systemMessage],
  };

  for (const step in stepConversations) {
    const stepDescription = await getInterviewStepsDescription(step);

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
          text: getWelcomeMessageForRole(step, "arbetstagare", interviewSteps),
        },
      ],
    };
    stepConversations[step] = [stepSystemMessage, welcomeMessage];
  }
}

export async function getInterviewStepsDescription(step) {
  try {
    const interviewStepsDescriptionResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      ["interviewSteps"]
    );

    if (
      interviewStepsDescriptionResult &&
      interviewStepsDescriptionResult.length > 0
    ) {
      const stepsData = interviewStepsDescriptionResult[0].value;

      if (stepsData && stepsData[step] && stepsData[step].description) {
        console.log(
          `Interview description for ${step} loaded from database:`,
          stepsData[step].description
        );
        return stepsData[step].description;
      }
    }
  } catch (error) {
    console.error(
      "Error fetching interview step descriptions from database:",
      error
    );
  }

  const defaultStepDescriptionsInterview = {
    "step-1":
      "Förberedelse - Hjälp användaren att berätta om sig själv och sin arbetssituation.",
    "step-2":
      "Funktionsnedsättning - Hjälp användaren att beskriva funktionsnedsättning och dess påverkan.",
    "step-3":
      "Arbetsuppgifter - Hjälp användaren att identifiera specifika utmaningar i arbetsuppgifter.",
    "step-4":
      "Tidigare erfarenheter - Hjälp användaren att beskriva tidigare hjälpmedel och anpassningar.",
    "step-5":
      "Arbetsmiljö - Hjälp användaren att beskriva sin arbetsmiljö och samarbete.",
    "step-6":
      "Kommunikation - Hjälp användaren att beskriva kommunikationsbehov och samspel.",
  };

  console.log(`Using default description for ${step}`);
  return (
    defaultStepDescriptionsInterview[step] ||
    "Hjälp användaren med intervjun om arbetshjälpmedel."
  );
}

export async function refreshInterviewConversationSettings() {
  await fetchInterviewSystemMessageFromDB();

  for (const step in stepConversations) {
    if (stepConversations[step] && stepConversations[step].length > 0) {
      const stepDescription = await getInterviewStepsDescription(step);

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
  console.log("Interview conversation settings refreshed");
}

export { defaultSystemMessageInterview };
initializeInterviewConversations();
