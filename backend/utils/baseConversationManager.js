import query from "./supabaseQuery.js";

// Shared function to detect user roles from conversation history
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

  const arbetstagarePatterns = [
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

// Generic function to fetch system message from database
export async function fetchSystemMessageFromDB(key, category, defaultMessage) {
  let systemMessage = defaultMessage;
  try {
    const systemResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1 AND category = $2",
      [key, category]
    );

    if (systemResult && systemResult.length > 0) {
      const systemMessageText = systemResult[0].value;

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
        console.log(`${key} system message loaded from database`);
      }
    }
  } catch (error) {
    console.error(`Error fetching ${key} system message from database:`, error);
    console.log(`Using default ${key} system message`);
  }
  return systemMessage;
}

// Generic function to fetch steps from database
export async function fetchSteps(key, defaultSteps) {
  let formattedSteps = {};
  try {
    const stepsResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      [key]
    );

    if (stepsResult && stepsResult.length > 0) {
      const stepsData = stepsResult[0].value;

      // Build an object with role-based welcome messages
      for (const [step, content] of Object.entries(stepsData)) {
        if (
          content &&
          content.welcomeArbetstagare &&
          content.welcomeArbetsgivare
        ) {
          formattedSteps[step] = {
            arbetstagare: content.welcomeArbetstagare,
            arbetsgivare: content.welcomeArbetsgivare,
          };
        }
      }

      console.log(`${key} loaded from database`);
      return formattedSteps;
    }
  } catch (error) {
    console.error(`Error fetching ${key} from database:`, error);
  }

  // Return default steps if database fetch fails
  console.log(`Using default ${key}`);
  return defaultSteps;
}

// Generic function to get step description
export async function getStepDescription(key, step, defaultDescriptions) {
  try {
    const stepsDescriptionResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      [key]
    );

    if (stepsDescriptionResult && stepsDescriptionResult.length > 0) {
      let stepsData = stepsDescriptionResult[0].value;

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
          `Description for ${step} loaded from database:`,
          stepsData[step].description
        );
        return stepsData[step].description;
      }
    }
  } catch (error) {
    console.error(
      `Error fetching step descriptions for ${key} from database:`,
      error
    );
  }

  console.log(`Using default description for ${step}`);
  return (
    defaultDescriptions[step] ||
    "Hjälp användaren med arbetshjälpmedel från Försäkringskassan."
  );
}

// Generic function to get welcome message based on role
export function getWelcomeMessageForRole(
  stepId,
  userRole,
  steps,
  neutralMessages
) {
  const stepData = steps[stepId];

  if (!stepData) {
    return "Välkommen! Hur kan jag hjälpa dig?";
  }

  // If no role is set or role is unknown, use a neutral welcome message
  if (!userRole || userRole === "unknown") {
    return (
      neutralMessages[stepId] ||
      "Välkommen! För att ge dig bästa möjliga hjälp, behöver jag veta om du är arbetstagare eller arbetsgivare?"
    );
  }

  // If a role IS specified, use the appropriate message
  if (userRole === "arbetstagare" && stepData.arbetstagare) {
    return stepData.arbetstagare;
  } else if (userRole === "arbetsgivare" && stepData.arbetsgivare) {
    return stepData.arbetsgivare;
  }

  // Last resort fallback
  return typeof stepData === "string"
    ? stepData
    : "Välkommen! Hur kan jag hjälpa dig?";
}

// Generic function to initialize conversations
export async function initializeConversations(
  systemMessageKey,
  systemMessageCategory,
  defaultSystemMessage,
  stepsKey,
  defaultSteps,
  stepDescriptionKey,
  defaultStepDescriptions
) {
  let stepConversations = {};
  const systemMessage = await fetchSystemMessageFromDB(
    systemMessageKey,
    systemMessageCategory,
    defaultSystemMessage
  );
  const steps = await fetchSteps(stepsKey, defaultSteps);

  // Initialize all step conversations
  for (let i = 1; i <= 6; i++) {
    const stepId = `step-${i}`;
    stepConversations[stepId] = [systemMessage];
  }

  // Add step descriptions and welcome messages
  for (const step in stepConversations) {
    const stepDescription = await getStepDescription(
      stepDescriptionKey,
      step,
      defaultStepDescriptions
    );

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
          text: getWelcomeMessageForRole(step, "arbetstagare", steps, {}),
        },
      ],
    };
    stepConversations[step] = [stepSystemMessage, welcomeMessage];
  }

  return { stepConversations, systemMessage, steps };
}

// Generic function to refresh conversation settings
export async function refreshConversationSettings(
  stepConversations,
  systemMessageKey,
  systemMessageCategory,
  defaultSystemMessage,
  stepDescriptionKey,
  defaultStepDescriptions
) {
  const systemMessage = await fetchSystemMessageFromDB(
    systemMessageKey,
    systemMessageCategory,
    defaultSystemMessage
  );

  for (const step in stepConversations) {
    if (stepConversations[step] && stepConversations[step].length > 0) {
      const stepDescription = await getStepDescription(
        stepDescriptionKey,
        step,
        defaultStepDescriptions
      );

      const updatedSystemMessage = {
        ...systemMessage,
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

  console.log(`${systemMessageKey} conversation settings refreshed`);
  return systemMessage;
}
