import OpenAI from "openai";
import query from "./supabaseQuery.js";
import { decrypt } from "./encryptionHelper.js";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get AI settings from database with fallback values
async function getAISettings() {
  try {
    const defaults = {
      model: "gpt-4o-mini",
      temperature: 1,
      maxTokens: 2048,
    };

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
    return {
      model: "gpt-4o-mini",
      temperature: 1,
      maxTokens: 2048,
    };
  }
}

// Helper function to safely decrypt history
function safelyDecryptHistory(historyData, stepId, botType = "application") {
  try {
    const stepHistory = decrypt(historyData);

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

  return null;
}

// Get conversation history for a specific user and step from database ONLY
async function getUserStepHistory(userId, stepId, botType) {
  try {
    const historyResult = await query(
      `SELECT history FROM chat_histories_${botType}_new WHERE user_id = $1 AND step_id = $2`,
      [userId, stepId]
    );

    if (historyResult.length > 0 && historyResult[0].history) {
      return safelyDecryptHistory(historyResult[0].history, stepId, botType);
    }

    return [];
  } catch (error) {
    console.error(
      `Error getting conversation history for user ${userId}, step ${stepId}:`,
      error
    );
    return [];
  }
}

// Get context from previous steps for a user
async function getPreviousStepsContext(
  userId,
  currentStep,
  botType,
  maxMessages = 10
) {
  const previousContext = [];

  try {
    // Get the step number (e.g., "step-3" -> 3)
    const currentStepNum = parseInt(currentStep.split("-")[1]);

    // Get history from all previous steps
    for (let i = 1; i < currentStepNum; i++) {
      const stepId = `step-${i}`;
      const stepHistory = await getUserStepHistory(userId, stepId, botType);

      // Take only the last few user-assistant exchanges from each step
      const userAssistantPairs = [];
      for (let j = stepHistory.length - 1; j >= 0; j--) {
        const msg = stepHistory[j];
        if (msg.role === "user" || msg.role === "assistant") {
          userAssistantPairs.unshift(msg);
          if (userAssistantPairs.length >= 4) break; // Last 2 exchanges per step
        }
      }

      previousContext.push(...userAssistantPairs);
    }

    // Limit total context to prevent token overflow
    return previousContext.slice(-maxMessages);
  } catch (error) {
    console.error("Error getting previous steps context:", error);
    return [];
  }
}

// Get cross-chat context (memory from other chat type)
async function getCrossChatContext(userId, currentBotType, maxMessages = 8) {
  const crossChatContext = [];

  try {
    // Determine the other chat type
    const otherBotType =
      currentBotType === "application" ? "interview" : "application";

    console.log(
      `Getting cross-chat context from ${otherBotType} for user ${userId}`
    );

    // Get all history from the other chat type
    const historyResults = await query(
      `SELECT step_id, history, created_at
       FROM chat_histories_${otherBotType}_new
       WHERE user_id = $1
       ORDER BY step_id ASC, created_at ASC`,
      [userId]
    );

    if (historyResults.length === 0) {
      console.log(`No cross-chat history found from ${otherBotType}`);
      return [];
    }

    // Process and extract relevant information
    for (const historyItem of historyResults) {
      const decryptedHistory = safelyDecryptHistory(
        historyItem.history,
        historyItem.step_id,
        otherBotType
      );

      if (Array.isArray(decryptedHistory)) {
        // Only take user messages that contain personal information
        const relevantMessages = decryptedHistory.filter((msg) => {
          if (msg.role === "user") {
            const text = (msg.text || msg.content || "").toLowerCase();
            // Look for personal information patterns
            return (
              text.includes("heter") ||
              text.includes("namn") ||
              text.includes("arbetar") ||
              text.includes("jobbar") ||
              text.includes("företag") ||
              text.includes("diagnos") ||
              text.includes("funktionsnedsättning") ||
              text.length > 20 // Substantial messages
            );
          }
          return false;
        });

        crossChatContext.push(...relevantMessages);
      }
    }

    // Limit and return most recent relevant context
    const limitedContext = crossChatContext.slice(-maxMessages);
    console.log(`Found ${limitedContext.length} cross-chat context messages`);

    return limitedContext;
  } catch (error) {
    console.error("Error getting cross-chat context:", error);
    return [];
  }
}

// Create a chat handler factory
export function createChatHandler(config) {
  const {
    botType,
    fetchSystemMessage,
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

      console.log(
        `Processing ${botType} chat for user ${userId}, step ${currentStep}`
      );

      // Get ONLY this user's conversation history for the current step
      let conversationHistory = [];
      if (userId) {
        conversationHistory = await getUserStepHistory(
          userId,
          currentStep,
          botType
        );
      }

      let detectedRole = req.body.existingRole || "unknown";

      // Role detection logic
      if (detectRole === true && currentStep === "step-1") {
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

      // Build the conversation using ONLY this user's history
      let userSpecificConversation = [];

      // Add system message
      userSpecificConversation.push(stepSystemMessage);

      // Add cross-chat context if available
      if (userId) {
        const crossChatContext = await getCrossChatContext(userId, botType);

        if (crossChatContext.length > 0) {
          userSpecificConversation.push({
            role: "system",
            content: [
              {
                type: "input_text",
                text: `Tidigare konversationskontext från ${
                  botType === "application" ? "intervju" : "ansökan"
                }: Användaren har tidigare delat följande information som kan vara relevant:`,
              },
            ],
          });

          // Add cross-chat context messages
          crossChatContext.forEach((msg) => {
            userSpecificConversation.push({
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: `[Tidigare: ${msg.text || msg.content || ""}]`,
                },
              ],
            });
          });

          userSpecificConversation.push({
            role: "system",
            content: [
              {
                type: "input_text",
                text: "Använd denna tidigare information om det är relevant för den aktuella konversationen, men fråga om förtydliganden vid behov.",
              },
            ],
          });
        }
      }

      // Add previous context from other steps BEFORE current step conversation
      if (userId && currentStep !== "step-1") {
        const previousContext = await getPreviousStepsContext(
          userId,
          currentStep,
          botType
        );

        if (previousContext.length > 0) {
          // Add a context separator
          userSpecificConversation.push({
            role: "system",
            content: [
              {
                type: "input_text",
                text: "Previous conversation context from earlier steps:",
              },
            ],
          });

          // Add context messages
          previousContext.forEach((msg) => {
            if (msg.role === "user") {
              userSpecificConversation.push({
                role: "user",
                content: [
                  { type: "input_text", text: msg.text || msg.content || "" },
                ],
              });
            } else if (msg.role === "assistant") {
              userSpecificConversation.push({
                role: "assistant",
                content: [
                  { type: "output_text", text: msg.text || msg.content || "" },
                ],
              });
            }
          });

          // Add separator for current step
          userSpecificConversation.push({
            role: "system",
            content: [
              {
                type: "input_text",
                text: `Now continuing conversation for ${currentStep}:`,
              },
            ],
          });
        }
      }

      // Add welcome message if this is a fresh conversation for current step
      if (conversationHistory.length === 0) {
        const roleBasedWelcome = getWelcomeMessageForRole(
          currentStep,
          detectedRole,
          steps
        );
        const welcomeMessage = {
          role: "assistant",
          content: [{ type: "output_text", text: roleBasedWelcome }],
        };
        userSpecificConversation.push(welcomeMessage);
      } else {
        // Add the user's existing conversation history for current step
        conversationHistory.forEach((msg) => {
          if (msg.role === "user") {
            userSpecificConversation.push({
              role: "user",
              content: [
                { type: "input_text", text: msg.text || msg.content || "" },
              ],
            });
          } else if (msg.role === "assistant") {
            userSpecificConversation.push({
              role: "assistant",
              content: [
                { type: "output_text", text: msg.text || msg.content || "" },
              ],
            });
          }
        });
      }

      // Add the current user message
      const userMessage = {
        role: "user",
        content: [{ type: "input_text", text: message }],
      };
      userSpecificConversation.push(userMessage);

      console.log(
        `Built conversation for user ${userId} with ${userSpecificConversation.length} messages (including cross-chat context)`
      );

      // Call OpenAI with the user-specific conversation
      const response = await openai.chat.completions.create({
        model: model,
        messages: userSpecificConversation.map((msg) => ({
          role: msg.role,
          content: Array.isArray(msg.content)
            ? msg.content
                .map((c) => c.text || c.output_text || c.input_text)
                .join("\n")
            : msg.content,
        })),
        temperature: temperature,
        max_tokens: maxTokens,
        top_p: 1,
      });

      const responseText = response.choices[0].message.content;

      // Role detection from AI response
      let roleFromAI = null;
      if (
        currentStep === "step-1" &&
        (detectedRole === "unknown" || detectRole)
      ) {
        roleFromAI = extractRoleFromAIResponse(responseText);
      }

      const finalDetectedRole =
        roleFromAI || (detectedRole !== "unknown" ? detectedRole : null);

      console.log(
        `Response generated for user ${userId}, detected role: ${finalDetectedRole}`
      );

      res.json({
        message: responseText,
        detectedRole: finalDetectedRole,
      });
    } catch (error) {
      console.error(`${botType} chat error:`, error);
      res.status(500).json({ error: "Failed to process your request" });
    }
  };
}

// Welcome message handler - also stateless
export function createWelcomeHandler(config) {
  const { botType, fetchSteps, getWelcomeMessageForRole } = config;

  return async (req, res) => {
    try {
      const { step } = req.params;
      const { role } = req.query;

      const roleToUse = role && role !== "unknown" ? role : null;
      const steps = await fetchSteps();

      if (!steps[step]) {
        return res.status(404).json({ error: "Step not found" });
      }

      const welcomeMessage = getWelcomeMessageForRole(step, roleToUse, steps);

      res.json({ message: welcomeMessage });
    } catch (error) {
      console.error(`Error fetching ${botType} welcome message:`, error);
      res.status(500).json({ error: "Failed to fetch welcome message" });
    }
  };
}
