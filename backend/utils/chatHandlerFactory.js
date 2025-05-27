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
// Improve the extractRoleFromAIResponse function to be more robust
function extractRoleFromAIResponse(text) {
  if (!text) return null;

  const lowerText = text.toLowerCase();

  // Only extract role if AI explicitly confirms it with specific phrases
  const arbetstagareConfirmations = [
    /tack för att du bekräftade att du är arbetstagare/i,
    /jag förstår att du är arbetstagare/i,
    /som arbetstagare kommer vi att hjälpa dig/i,
    /du har angett att du är arbetstagare/i,
    /eftersom du är arbetstagare/i,
    /du är arbetstagare och kommer att/i,
    /för dig som arbetstagare/i,
  ];

  const arbetsgivareConfirmations = [
    /tack för att du bekräftade att du är arbetsgivare/i,
    /jag förstår att du är arbetsgivare/i,
    /som arbetsgivare kommer vi att hjälpa dig/i,
    /du har angett att du är arbetsgivare/i,
    /eftersom du är arbetsgivare/i,
    /du är arbetsgivare och kommer att/i,
    /för dig som arbetsgivare/i,
  ];

  // Check for explicit arbetstagare confirmations
  for (const pattern of arbetstagareConfirmations) {
    if (pattern.test(lowerText)) {
      console.log("AI explicitly confirmed arbetstagare role");
      return "arbetstagare";
    }
  }

  // Check for explicit arbetsgivare confirmations
  for (const pattern of arbetsgivareConfirmations) {
    if (pattern.test(lowerText)) {
      console.log("AI explicitly confirmed arbetsgivare role");
      return "arbetsgivare";
    }
  }

  // Don't detect role from casual mentions - only from explicit confirmations
  return null;
}

// Create a chat handler factory
export function createChatHandler(config) {
  const {
    botType, // 'application' or 'interview'
    fetchSystemMessage,
    stepConversations,
    getStepDescription,
    fetchSteps,
    detectUserRole,
    getWelcomeMessageForRole,
  } = config;

  // Return the actual handler function
  return async (req, res) => {
    try {
      // Always fetch fresh system message on each request
      const systemMessage = await fetchSystemMessage();
      if (
        !systemMessage ||
        !systemMessage.content ||
        systemMessage.content.length === 0
      ) {
        throw new Error("Invalid system message format");
      }

      const { message, currentStep = "step-1", userId, detectRole } = req.body;

      // Get AI settings with fallback values
      const { model, temperature, maxTokens } = await getAISettings();

      // Fetch steps
      const steps = await fetchSteps();

      // Get conversation history for role detection
      let conversationHistory = [];
      if (userId) {
        try {
          const historyResult = await query(
            `SELECT history FROM chat_histories_${botType}_test WHERE user_id = $1 AND step_id = $2`,
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
          console.error(
            `Error getting conversation history for role detection:`,
            error
          );
        }
      }

      let detectedRole = req.body.existingRole || "unknown";

      // Only attempt detection if explicitly requested by the frontend
      if (detectRole === true) {
        const roleFromPatterns = detectUserRole([
          ...conversationHistory,
          { role: "user", text: message },
        ]);

        // Only update the role if the detection is confident
        if (roleFromPatterns && roleFromPatterns !== "unknown") {
          detectedRole = roleFromPatterns;
          console.log(`Role detected from patterns: ${detectedRole}`);
        }
      }

      // Get the step description freshly for this request
      const stepDescription = await getStepDescription(currentStep);

      // Build the step system message with fresh data and role information
      const stepSystemMessage = {
        role: "system",
        content: [
          {
            type: "input_text",
            text: systemMessage.content[0].text,
          },
          {
            type: "input_text",
            text: `Step instructions: ${stepDescription}`,
          },
          {
            type: "input_text",
            text: `DETEKTERAD ANVÄNDARROLL: ${detectedRole}. Anpassa dina ${
              botType === "interview" ? "intervjufrågor och " : ""
            }svar efter denna roll.`,
          },
        ],
      };

      // If detectRole flag is set or no role detected yet, modify the system message
      if (detectRole || !detectedRole || detectedRole === "unknown") {
        stepSystemMessage.content.push({
          type: "input_text",
          text: "PRIORITET: Det är mycket viktigt att identifiera om användaren är arbetstagare eller arbetsgivare. Var extra uppmärksam på alla indikationer i användarens meddelande som kan avslöja deras roll. Om användaren skriver 'arbetstagare', 'anställd', eller liknande, anta att de är arbetstagare. Om de skriver 'arbetsgivare', 'chef', 'företag', eller liknande, anta att de är arbetsgivare. Om det fortfarande är oklart, börja ditt svar med en direkt fråga om de är arbetstagare eller arbetsgivare.",
        });
      }

      // Initialize or update the conversation for this step
      if (
        !stepConversations[currentStep] ||
        stepConversations[currentStep].length === 0
      ) {
        // Use role-appropriate welcome message
        const roleBasedWelcome = getWelcomeMessageForRole(
          currentStep,
          detectedRole,
          steps
        );

        const welcomeMessage = {
          role: "assistant",
          content: [
            {
              type: "output_text",
              text: roleBasedWelcome,
            },
          ],
        };

        stepConversations[currentStep] = [stepSystemMessage, welcomeMessage];
      } else {
        // Update the system message to reflect any changes in settings and role detection
        stepConversations[currentStep][0] = stepSystemMessage;
      }

      const stepHistory = stepConversations[currentStep];

      // Get full step history to send to bot as context
      let previousStepsContext = [];
      if (userId) {
        try {
          console.log(
            `Building context for ${botType} bot with userId:`,
            userId
          );

          // Define all steps
          const allSteps = [
            "step-1",
            "step-2",
            "step-3",
            "step-4",
            "step-5",
            "step-6",
          ];
          const otherSteps = allSteps.filter(
            (stepId) => stepId !== currentStep
          );

          // For each step in the current bot type, get its history from the database
          for (const stepId of otherSteps) {
            const historyResult = await query(
              `SELECT history FROM chat_histories_${botType}_test WHERE user_id = $1 AND step_id = $2`,
              [userId, stepId]
            );

            if (historyResult.length > 0 && historyResult[0].history) {
              const stepHistory = safelyDecryptHistory(
                historyResult[0].history,
                stepId,
                botType
              );

              // Only add if there's actual conversation (more than just the welcome message)
              if (Array.isArray(stepHistory) && stepHistory.length > 1) {
                // Add a separator to clearly mark different steps
                previousStepsContext.push({
                  role: "system",
                  content: [
                    {
                      type: "input_text",
                      text: `--- History from ${botType} ${stepId} ---`,
                    },
                  ],
                });

                // Add the conversation history from this step
                previousStepsContext.push(
                  ...stepHistory.map((msg) => ({
                    role: msg.role || "assistant",
                    content: [
                      {
                        type:
                          msg.role === "user" ? "input_text" : "output_text",
                        text: msg.text || msg.content || "",
                      },
                    ],
                  }))
                );
              }
            }
          }

          // Get cross-context from the other bot type
          const otherBotType =
            botType === "application" ? "interview" : "application";
          for (const stepId of allSteps) {
            const historyResult = await query(
              `SELECT history FROM chat_histories_${otherBotType}_test WHERE user_id = $1 AND step_id = $2`,
              [userId, stepId]
            );

            if (historyResult.length > 0 && historyResult[0].history) {
              const stepHistory = safelyDecryptHistory(
                historyResult[0].history,
                stepId,
                otherBotType
              );

              // Only add if there's actual conversation
              if (Array.isArray(stepHistory) && stepHistory.length > 1) {
                // Add a separator
                previousStepsContext.push({
                  role: "system",
                  content: [
                    {
                      type: "input_text",
                      text: `--- History from ${otherBotType} ${stepId} ---`,
                    },
                  ],
                });

                // Add the conversation history
                previousStepsContext.push(
                  ...stepHistory.map((msg) => ({
                    role: msg.role || "assistant",
                    content: [
                      {
                        type:
                          msg.role === "user" ? "input_text" : "output_text",
                        text: msg.text || msg.content || "",
                      },
                    ],
                  }))
                );
              }
            }
          }

          // Prevent token limit issues
          const MAX_CONTEXT_MESSAGES = 100;
          if (previousStepsContext.length > MAX_CONTEXT_MESSAGES) {
            console.log(
              `Truncating context from ${previousStepsContext.length} to ${MAX_CONTEXT_MESSAGES} messages`
            );
            previousStepsContext = previousStepsContext.slice(
              -MAX_CONTEXT_MESSAGES
            );
          }

          console.log(
            `Added context from ${previousStepsContext.length} messages from other steps for ${botType} bot`
          );
        } catch (error) {
          console.error(
            `Error getting step history for ${botType} bot:`,
            error
          );
        }
      } else {
        console.log(`No userId provided for ${botType} bot context`);
      }

      const stepContext = {
        role: "system",
        content: [
          {
            type: "input_text",
            text: `User is currently on step "${currentStep}": ${getStepDescription(
              currentStep
            )}. Detected role: ${detectedRole}`,
          },
        ],
      };

      const userMessage = {
        role: "user",
        content: [
          {
            type: "input_text",
            text: message,
          },
        ],
      };

      const input = [
        stepContext,
        ...previousStepsContext,
        ...stepHistory,
        userMessage,
      ];

      console.log(model);
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

      const assistantMessage = {
        role: "assistant",
        content: [
          {
            type: "output_text",
            text: response.output_text,
          },
        ],
      };

      stepConversations[currentStep] = [
        ...stepHistory,
        userMessage,
        assistantMessage,
      ];

      if (stepConversations[currentStep].length > 20) {
        const welcomeMessage = stepConversations[currentStep][1];
        stepConversations[currentStep] = [
          stepSystemMessage,
          welcomeMessage,
          ...stepConversations[currentStep].slice(-18),
        ];
      }

      // Check if AI's response indicates a role when our pattern detection didn't find one
      if (
        currentStep === "step-1" &&
        detectedRole === "unknown" &&
        response.output_text
      ) {
        const aiDetectedRole = extractRoleFromAIResponse(response.output_text);
        if (aiDetectedRole) {
          console.log(`Role detected from AI response: ${aiDetectedRole}`);
          detectedRole = aiDetectedRole;
        }
      }

      // Only return a detected role if it's actually known
      const roleToReturn =
        detectedRole && detectedRole !== "unknown" ? detectedRole : null;

      res.json({
        message: response.output_text,
        detectedRole: roleToReturn,
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
