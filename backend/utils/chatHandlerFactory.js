import OpenAI from "openai";
import query from "./supabaseQuery.js";
import { decrypt } from "./encryptionHelper.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get AI settings from database with fallback values
async function getAISettings() {
  try {
    // Default fallback values
    const defaults = {
      model: "gpt-4.1-mini",
      temperature: 1,
      maxTokens: 2048,
    };

    // Fetch settings from database
    const modelResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      ["model"]
    );

    const temperatureResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      ["temperature"]
    );

    const maxTokensResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      ["maxTokens"]
    );

    // Parse values from database (if they exist) or use defaults
    const model =
      modelResult.length > 0 ? modelResult[0].value : defaults.model;
    const temperature =
      temperatureResult.length > 0
        ? temperatureResult[0].value
        : defaults.temperature;
    const maxTokens =
      maxTokensResult.length > 0
        ? maxTokensResult[0].value
        : defaults.maxTokens;

    console.log("Using AI settings:", { model, temperature, maxTokens });

    return { model, temperature, maxTokens };
  } catch (error) {
    console.error("Error fetching AI settings:", error);
    // Return defaults if there's an error
    return {
      model: "gpt-4.1-mini",
      temperature: 1,
      maxTokens: 2048,
    };
  }
}

// Helper function to safely decrypt history
function safelyDecryptHistory(historyData, stepId, botType = "application") {
  try {
    const stepHistory = decrypt(historyData);

    // Ensure it's an array
    if (!Array.isArray(stepHistory)) {
      console.warn(
        `History for ${botType} step ${stepId} is not an array after decryption:`,
        typeof stepHistory
      );
      return [];
    }

    return stepHistory;
  } catch (decryptError) {
    console.error(
      `Error decrypting history for ${botType} step ${stepId}:`,
      decryptError
    );
    return [];
  }
}

// Helper function to extract AI-detected role from response
function extractRoleFromAIResponse(text) {
  if (!text) return null;

  const lowerText = text.toLowerCase();

  // only when AI explicitly confirms user's role
  const arbetstagareConfirmations = [
    /tack.*bekräfta.*arbetstagare/i,
    /förstår att du är arbetstagare/i,
    /eftersom du sa.*arbetstagare/i,
    /du har berättat.*arbetstagare/i,
    /som arbetstagare.*kommer vi att använda.*fk 7545/i,
  ];

  const arbetsgivareConfirmations = [
    /tack.*bekräfta.*arbetsgivare/i,
    /förstår att du är arbetsgivare/i,
    /eftersom du sa.*arbetsgivare/i,
    /du har berättat.*arbetsgivare/i,
    /som arbetsgivare.*kommer vi att använda.*fk 7546/i,
  ];

  // Only detect role when AI is clearly confirming what user said
  for (const pattern of arbetstagareConfirmations) {
    if (pattern.test(lowerText)) {
      return "arbetstagare";
    }
  }

  for (const pattern of arbetsgivareConfirmations) {
    if (pattern.test(lowerText)) {
      return "arbetsgivare";
    }
  }

  // Don't detect role from general explanations or questions
  return null;
}

// Create a chat handler factory
export function createChatHandler(config) {
  const {
    botType,
    fetchSystemMessage,
    stepConversations,
    getStepDescription,
    fetchSteps,
    detectUserRole,
    getWelcomeMessageForRole,
  } = config;

  return async (req, res) => {
    try {
      const systemMessage = await fetchSystemMessage();
      const { message, currentStep = "step-1", userId, detectRole } = req.body;
      const { model, temperature, maxTokens } = await getAISettings();
      const steps = await fetchSteps();

      // Get conversation history
      let conversationHistory = [];
      if (userId) {
        try {
          const historyResult = await query(
            `SELECT history FROM chat_histories_${botType}_new WHERE user_id = $1 AND step_id = $2`,
            [userId, currentStep]
          );

          if (historyResult.length > 0 && historyResult[0].history) {
            conversationHistory = safelyDecryptHistory(
              historyResult[0].history,
              currentStep,
              botType
            );
          }
        } catch (error) {
          console.error(`Error getting conversation history:`, error);
        }
      }

      let detectedRole = req.body.existingRole || "unknown";

      // Role detection logic - simplified
      if (detectRole === true && currentStep === "step-1") {
        // First try pattern detection on user message
        const roleFromUser = detectUserRole([{ role: "user", text: message }]);
        if (roleFromUser && roleFromUser !== "unknown") {
          detectedRole = roleFromUser;
        }
      }

      // Build system message - don't assume role until confirmed
      const stepDescription = await getStepDescription(currentStep);
      const stepSystemMessage = {
        role: "system",
        content: [
          { type: "input_text", text: systemMessage.content[0].text },
          { type: "input_text", text: `Step instructions: ${stepDescription}` },
        ],
      };

      // Only add role info if we actually have a confirmed role
      if (detectedRole && detectedRole !== "unknown") {
        stepSystemMessage.content.push({
          type: "input_text",
          text: `BEKRÄFTAD ANVÄNDARROLL: ${detectedRole}. Anpassa dina svar efter denna roll.`,
        });
      }

      // Add role detection instructions only if we need to detect role
      if (
        (detectRole || detectedRole === "unknown") &&
        currentStep === "step-1"
      ) {
        stepSystemMessage.content.push({
          type: "input_text",
          text: "VIKTIGT: Användaren har inte angivit sin roll än. Fråga tydligt om de är arbetstagare eller arbetsgivare. När de svarar, bekräfta deras roll med fraser som 'Tack för att du bekräftade att du är arbetstagare/arbetsgivare.'",
        });
      }

      // Get context from other steps (simplified)
      let previousStepsContext = [];
      if (userId) {
        // Add minimal context to avoid token limits
        // You can expand this if needed
      }

      // Build conversation
      if (
        !stepConversations[currentStep] ||
        stepConversations[currentStep].length === 0
      ) {
        const roleBasedWelcome = getWelcomeMessageForRole(
          currentStep,
          detectedRole,
          steps
        );
        const welcomeMessage = {
          role: "assistant",
          content: [{ type: "output_text", text: roleBasedWelcome }],
        };
        stepConversations[currentStep] = [stepSystemMessage, welcomeMessage];
      } else {
        stepConversations[currentStep][0] = stepSystemMessage;
      }

      const stepHistory = stepConversations[currentStep];
      const userMessage = {
        role: "user",
        content: [{ type: "input_text", text: message }],
      };

      const input = [...previousStepsContext, ...stepHistory, userMessage];

      // Call OpenAI
      const response = await openai.responses.create({
        model: model,
        input,
        text: { format: { type: "text" } },
        reasoning: {},
        tools: [
          {
            type: "file_search",
            vector_store_ids: ["vs_67ee4b3df0f481918a769c7ee3c61880"],
          },
        ],
        temperature: temperature,
        max_output_tokens: maxTokens,
        top_p: 1,
        store: true,
      });

      // Update conversation
      const assistantMessage = {
        role: "assistant",
        content: [{ type: "output_text", text: response.output_text }],
      };

      stepConversations[currentStep] = [
        ...stepHistory,
        userMessage,
        assistantMessage,
      ];

      // Trim conversation if too long
      if (stepConversations[currentStep].length > 20) {
        const welcomeMessage = stepConversations[currentStep][1];
        stepConversations[currentStep] = [
          stepSystemMessage,
          welcomeMessage,
          ...stepConversations[currentStep].slice(-18),
        ];
      }

      // SIMPLIFIED ROLE DETECTION FROM AI RESPONSE
      let roleFromAI = null;
      if (
        currentStep === "step-1" &&
        (detectedRole === "unknown" || detectRole)
      ) {
        roleFromAI = extractRoleFromAIResponse(response.output_text);
      }

      // Return the detected role (either from user input or AI confirmation)
      const finalDetectedRole =
        roleFromAI || (detectedRole !== "unknown" ? detectedRole : null);

      res.json({
        message: response.output_text,
        detectedRole: finalDetectedRole,
      });
    } catch (error) {
      console.error(`${botType} chat error:`, error);
      res.status(500).json({ error: "Failed to process your request" });
    }
  };
}

// Similarly for welcome message handler
export function createWelcomeHandler(config) {
  const { botType, fetchSteps, getWelcomeMessageForRole } = config;

  return async (req, res) => {
    try {
      const { step } = req.params;
      const { role } = req.query;

      // Only use role if it's valid (not unknown)
      const roleToUse = role && role !== "unknown" ? role : null;

      // Fetch fresh steps on each request
      const steps = await fetchSteps();

      if (!steps[step]) {
        return res.status(404).json({ error: "Step not found" });
      }

      // Get role-appropriate welcome message
      const welcomeMessage = getWelcomeMessageForRole(step, roleToUse, steps);

      res.json({ message: welcomeMessage });
    } catch (error) {
      console.error(`Error fetching ${botType} welcome message:`, error);
      res.status(500).json({ error: "Failed to fetch welcome message" });
    }
  };
}
