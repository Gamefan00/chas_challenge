import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import query from "../utils/supabaseQuery.js";
import {
  fetchApplicationSystemMessageFromDB,
  stepConversations as applicationStepConversations,
  getApplicationStepsDescription,
  fetchApplicationSteps,
  detectUserRole as detectApplicationUserRole,
  getWelcomeMessageForRole as getApplicationWelcomeMessageForRole,
} from "../utils/applicationConversationManager.js";

import {
  fetchInterviewSystemMessageFromDB,
  stepConversations as interviewStepConversations,
  getInterviewStepsDescription,
  fetchInterviewSteps,
  detectUserRole as detectInterviewUserRole,
  getWelcomeMessageForRole as getInterviewWelcomeMessageForRole,
} from "../utils/interviewConversationManager.js";

import { decrypt } from "../utils/encryptionHelper.js";

// Load environment variables
dotenv.config();

const router = express.Router();

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

// Helper function to safely decrypt history (ONLY decrypt, no JSON parsing fallback)
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
    // If decryption fails, return empty array (no JSON fallback since everything should be encrypted)
    return [];
  }
}

// Helper function to extract AI-detected role from response
function extractRoleFromAIResponse(text) {
  if (!text) return null;

  const lowerText = text.toLowerCase();

  // Check for explicit statements about the user's role
  if (
    lowerText.includes("som arbetstagare") ||
    lowerText.includes("du är arbetstagare") ||
    lowerText.includes("för dig som arbetstagare") ||
    lowerText.includes("blankett fk 7545")
  ) {
    return "arbetstagare";
  }

  if (
    lowerText.includes("som arbetsgivare") ||
    lowerText.includes("du är arbetsgivare") ||
    lowerText.includes("för dig som arbetsgivare") ||
    lowerText.includes("blankett fk 7546") ||
    lowerText.includes("blankett fk 7547")
  ) {
    return "arbetsgivare";
  }

  return null;
}

/////////////////////////////////////////////////
// Application bot data fetching from database //
/////////////////////////////////////////////////

router.get("/welcome/:step", async (req, res) => {
  try {
    const { step } = req.params;
    const { role } = req.query;

    // Only use role if it's valid (not unknown)
    const roleToUse = role && role !== "unknown" ? role : null;

    // Fetch fresh application steps on each request
    const applicationSteps = await fetchApplicationSteps();

    if (!applicationSteps[step]) {
      return res.status(404).json({ error: "Step not found" });
    }

    // Get role-appropriate welcome message
    const welcomeMessage = getApplicationWelcomeMessageForRole(
      step,
      roleToUse,
      applicationSteps
    );

    res.json({ message: welcomeMessage });
  } catch (error) {
    console.error("Error fetching welcome message:", error);
    res.status(500).json({ error: "Failed to fetch welcome message" });
  }
});

router.post("/", async (req, res) => {
  try {
    // Always fetch fresh system message on each request and ensure it's not undefined
    const freshSystemMessage = await fetchApplicationSystemMessageFromDB();
    if (
      !freshSystemMessage ||
      !freshSystemMessage.content ||
      freshSystemMessage.content.length === 0
    ) {
      throw new Error("Invalid system message format");
    }

    const { message, currentStep = "step-1", userId, detectRole } = req.body;

    // Get AI settings with fallback values
    const { model, temperature, maxTokens } = await getAISettings();

    // Fetch application steps
    const applicationSteps = await fetchApplicationSteps();

    // Get conversation history for role detection
    let conversationHistory = [];
    if (userId) {
      try {
        const historyResult = await query(
          "SELECT history FROM chat_histories_application_test WHERE user_id = $1 AND step_id = $2",
          [userId, currentStep]
        );

        if (historyResult.length > 0 && historyResult[0].history) {
          conversationHistory = safelyDecryptHistory(
            historyResult[0].history,
            currentStep,
            "application"
          );
        }
      } catch (error) {
        console.error(
          "Error getting conversation history for role detection:",
          error
        );
      }
    }

    // Detect user role from conversation
    let detectedRole = detectApplicationUserRole([
      ...conversationHistory,
      { role: "user", text: message },
    ]);

    // Add an extra field to track if AI should confirm role detection
    let aiShouldConfirmRole = detectedRole === "unknown" || detectRole === true;

    // Get the step description freshly for this request
    const stepDescription = await getApplicationStepsDescription(currentStep);

    // Build the step system message with fresh data and role information
    const stepSystemMessage = {
      role: "system",
      content: [
        {
          type: "input_text",
          text: freshSystemMessage.content[0].text,
        },
        {
          type: "input_text",
          text: `Step instructions: ${stepDescription}`,
        },
        {
          type: "input_text",
          text: `DETEKTERAD ANVÄNDARROLL: ${detectedRole}. Anpassa dina svar och råd efter denna roll.`,
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
      !applicationStepConversations[currentStep] ||
      applicationStepConversations[currentStep].length === 0
    ) {
      // Use role-appropriate welcome message
      const roleBasedWelcome = getApplicationWelcomeMessageForRole(
        currentStep,
        detectedRole,
        applicationSteps
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

      applicationStepConversations[currentStep] = [
        stepSystemMessage,
        welcomeMessage,
      ];
    } else {
      // Update the system message to reflect any changes in settings and role detection
      applicationStepConversations[currentStep][0] = stepSystemMessage;
    }

    const stepHistory = applicationStepConversations[currentStep];

    // Get full step history to send to bot as context
    let previousStepsContext = [];
    if (userId) {
      try {
        console.log(
          "Building context for application bot with userId:",
          userId
        );

        // Get context from application steps
        const allApplicationSteps = [
          "step-1",
          "step-2",
          "step-3",
          "step-4",
          "step-5",
          "step-6",
        ];
        const otherApplicationSteps = allApplicationSteps.filter(
          (stepId) => stepId !== currentStep
        );

        // For each step, get its history from the database if it exists
        for (const stepId of otherApplicationSteps) {
          const historyResult = await query(
            "SELECT history FROM chat_histories_application_test WHERE user_id = $1 AND step_id = $2",
            [userId, stepId]
          );

          if (historyResult.length > 0 && historyResult[0].history) {
            const stepHistory = safelyDecryptHistory(
              historyResult[0].history,
              stepId,
              "application"
            );

            // Only add if there's actual conversation (more than just the welcome message)
            if (Array.isArray(stepHistory) && stepHistory.length > 1) {
              // Add a separator to clearly mark different steps
              previousStepsContext.push({
                role: "system",
                content: [
                  {
                    type: "input_text",
                    text: `--- History from application ${stepId} ---`,
                  },
                ],
              });

              // Add the conversation history from this step (with safety check)
              previousStepsContext.push(
                ...stepHistory.map((msg) => ({
                  role: msg.role || "assistant",
                  content: [
                    {
                      type: msg.role === "user" ? "input_text" : "output_text",
                      text: msg.text || msg.content || "",
                    },
                  ],
                }))
              );
            }
          }
        }

        // Get context from interview steps
        for (const stepId of allApplicationSteps) {
          const historyResult = await query(
            "SELECT history FROM chat_histories_interview_test WHERE user_id = $1 AND step_id = $2",
            [userId, stepId]
          );

          if (historyResult.length > 0 && historyResult[0].history) {
            const stepHistory = safelyDecryptHistory(
              historyResult[0].history,
              stepId,
              "interview"
            );

            // Only add if there's actual conversation (more than just the welcome message)
            if (Array.isArray(stepHistory) && stepHistory.length > 1) {
              // Add a separator to clearly mark interview context
              previousStepsContext.push({
                role: "system",
                content: [
                  {
                    type: "input_text",
                    text: `--- History from interview ${stepId} ---`,
                  },
                ],
              });

              // Add the interview conversation history from this step
              previousStepsContext.push(
                ...stepHistory.map((msg) => ({
                  role: msg.role || "assistant",
                  content: [
                    {
                      type: msg.role === "user" ? "input_text" : "output_text",
                      text: msg.text || msg.content || "",
                    },
                  ],
                }))
              );
            }
          }
        }

        // Prevent token limit issues by truncating context if it gets too large
        const MAX_CONTEXT_MESSAGES = 100; // Adjust based on your token limits
        if (previousStepsContext.length > MAX_CONTEXT_MESSAGES) {
          console.log(
            `Truncating context from ${previousStepsContext.length} to ${MAX_CONTEXT_MESSAGES} messages`
          );
          // Keep only the most recent messages
          previousStepsContext = previousStepsContext.slice(
            -MAX_CONTEXT_MESSAGES
          );
        }

        console.log(
          `Added context from ${previousStepsContext.length} messages from other steps for application bot`
        );
      } catch (error) {
        console.error("Error getting step history for application bot:", error);
        // Continue without previous context if there's an error
      }
    } else {
      console.log("No userId provided for application bot context");
    }

    const stepContext = {
      role: "system",
      content: [
        {
          type: "input_text",
          text: `User is currently on step "${currentStep}": ${getApplicationStepsDescription(
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

    applicationStepConversations[currentStep] = [
      ...stepHistory,
      userMessage,
      assistantMessage,
    ];

    if (applicationStepConversations[currentStep].length > 20) {
      const welcomeMessage = applicationStepConversations[currentStep][1];
      applicationStepConversations[currentStep] = [
        stepSystemMessage,
        welcomeMessage,
        ...applicationStepConversations[currentStep].slice(-18),
      ];
    }

    // Check if AI's response indicates a role when our pattern detection didn't find one
    if ((detectedRole === "unknown" || !detectedRole) && response.output_text) {
      const aiDetectedRole = extractRoleFromAIResponse(response.output_text);
      if (aiDetectedRole) {
        console.log(`Role detected from AI response: ${aiDetectedRole}`);
        detectedRole = aiDetectedRole;
      }
    }

    res.json({
      message: response.output_text,
      detectedRole: detectedRole,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process your request" });
  }
});

///////////////////////////////////////////////
// Interview bot data fetching from database //
///////////////////////////////////////////////

router.get("/interview/welcome/:step", async (req, res) => {
  try {
    const { step } = req.params;
    const { role } = req.query;

    // Only use role if it's valid (not unknown)
    const roleToUse = role && role !== "unknown" ? role : null;

    // Fetch fresh interview steps on each request
    const interviewSteps = await fetchInterviewSteps();

    if (!interviewSteps[step]) {
      return res.status(404).json({ error: "Step not found" });
    }

    // Get role-appropriate welcome message
    const welcomeMessage = getInterviewWelcomeMessageForRole(
      step,
      roleToUse,
      interviewSteps
    );

    res.json({ message: welcomeMessage });
  } catch (error) {
    console.error("Error fetching interview welcome message:", error);
    res.status(500).json({ error: "Failed to fetch welcome message" });
  }
});

router.post("/interview/", async (req, res) => {
  try {
    // Always fetch fresh system message on each request
    const systemMessage = await fetchInterviewSystemMessageFromDB();
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

    // Fetch interview steps - IMPORTANT: This is a function call
    const interviewSteps = await fetchInterviewSteps();

    // Get conversation history for role detection
    let conversationHistory = [];
    if (userId) {
      try {
        const historyResult = await query(
          "SELECT history FROM chat_histories_interview_test WHERE user_id = $1 AND step_id = $2",
          [userId, currentStep]
        );

        if (historyResult.length > 0 && historyResult[0].history) {
          conversationHistory = safelyDecryptHistory(
            historyResult[0].history,
            currentStep,
            "interview"
          );
        }
      } catch (error) {
        console.error(
          "Error getting conversation history for role detection:",
          error
        );
      }
    }

    // Detect user role from conversation - same approach as application route
    let detectedRole = detectInterviewUserRole([
      ...conversationHistory,
      { role: "user", text: message },
    ]);

    // Add an extra field to track if AI should confirm role detection
    let aiShouldConfirmRole = detectedRole === "unknown" || detectRole === true;

    // Get the step description freshly for this request
    const stepDescription = await getInterviewStepsDescription(currentStep);

    // Build the step system message with fresh data and role information
    const enhancedSystemMessage = {
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
          text: `DETEKTERAD ANVÄNDARROLL: ${detectedRole}. Anpassa dina intervjufrågor och svar efter denna roll.`,
        },
      ],
    };

    // If detectRole flag is set or no role detected yet, modify the system message
    if (detectRole || !detectedRole || detectedRole === "unknown") {
      enhancedSystemMessage.content.push({
        type: "input_text",
        text: "PRIORITET: Det är mycket viktigt att identifiera om användaren är arbetstagare eller arbetsgivare. Var extra uppmärksam på alla indikationer i användarens meddelande som kan avslöja deras roll. Om användaren skriver 'arbetstagare', 'anställd', eller liknande, anta att de är arbetstagare. Om de skriver 'arbetsgivare', 'chef', 'företag', eller liknande, anta att de är arbetsgivare. Om det fortfarande är oklart, börja ditt svar med en direkt fråga om de är arbetstagare eller arbetsgivare.",
      });
    }

    // Initialize or update the conversation for this step
    if (
      !interviewStepConversations[currentStep] ||
      interviewStepConversations[currentStep].length === 0
    ) {
      // Use role-appropriate welcome message
      const roleBasedWelcome = getInterviewWelcomeMessageForRole(
        currentStep,
        detectedRole,
        interviewSteps
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

      interviewStepConversations[currentStep] = [
        enhancedSystemMessage,
        welcomeMessage,
      ];
    } else {
      // Update the system message to reflect any changes in settings and role detection
      interviewStepConversations[currentStep][0] = enhancedSystemMessage;
    }

    const stepHistory = interviewStepConversations[currentStep];

    // Get full step history to send to bot as context
    let previousStepsContext = [];
    if (userId) {
      try {
        console.log("Building context for interview bot with userId:", userId);

        // Get context from interview steps
        const allInterviewSteps = [
          "step-1",
          "step-2",
          "step-3",
          "step-4",
          "step-5",
          "step-6",
        ];
        const otherInterviewSteps = allInterviewSteps.filter(
          (stepId) => stepId !== currentStep
        );

        // For each step, get its history from the database if it exists
        for (const stepId of otherInterviewSteps) {
          const historyResult = await query(
            "SELECT history FROM chat_histories_interview_test WHERE user_id = $1 AND step_id = $2",
            [userId, stepId]
          );

          if (historyResult.length > 0 && historyResult[0].history) {
            const stepHistory = safelyDecryptHistory(
              historyResult[0].history,
              stepId,
              "interview"
            );

            // Only add if there's actual conversation (more than just the welcome message)
            if (Array.isArray(stepHistory) && stepHistory.length > 1) {
              // Add a separator to clearly mark different steps
              previousStepsContext.push({
                role: "system",
                content: [
                  {
                    type: "input_text",
                    text: `--- History from interview ${stepId} ---`,
                  },
                ],
              });

              // Add the conversation history from this step (with safety check)
              previousStepsContext.push(
                ...stepHistory.map((msg) => ({
                  role: msg.role || "assistant",
                  content: [
                    {
                      type: msg.role === "user" ? "input_text" : "output_text",
                      text: msg.text || msg.content || "",
                    },
                  ],
                }))
              );
            }
          }
        }

        // Get context from application steps
        const allApplicationSteps = [
          "step-1",
          "step-2",
          "step-3",
          "step-4",
          "step-5",
          "step-6",
        ];

        for (const stepId of allApplicationSteps) {
          const historyResult = await query(
            "SELECT history FROM chat_histories_application_test WHERE user_id = $1 AND step_id = $2",
            [userId, stepId]
          );

          if (historyResult.length > 0 && historyResult[0].history) {
            const stepHistory = safelyDecryptHistory(
              historyResult[0].history,
              stepId,
              "application"
            );

            // Only add if there's actual conversation (more than just the welcome message)
            if (Array.isArray(stepHistory) && stepHistory.length > 1) {
              // Add a separator to clearly mark application context
              previousStepsContext.push({
                role: "system",
                content: [
                  {
                    type: "input_text",
                    text: `--- History from application ${stepId} ---`,
                  },
                ],
              });

              // Add the application conversation history from this step
              previousStepsContext.push(
                ...stepHistory.map((msg) => ({
                  role: msg.role || "assistant",
                  content: [
                    {
                      type: msg.role === "user" ? "input_text" : "output_text",
                      text: msg.text || msg.content || "",
                    },
                  ],
                }))
              );
            }
          }
        }

        // Prevent token limit issues by truncating context if it gets too large
        const MAX_CONTEXT_MESSAGES = 100; // Adjust based on your token limits
        if (previousStepsContext.length > MAX_CONTEXT_MESSAGES) {
          console.log(
            `Truncating context from ${previousStepsContext.length} to ${MAX_CONTEXT_MESSAGES} messages`
          );
          // Keep only the most recent messages
          previousStepsContext = previousStepsContext.slice(
            -MAX_CONTEXT_MESSAGES
          );
        }

        console.log(
          `Added context from ${previousStepsContext.length} messages from other steps for interview bot`
        );
      } catch (error) {
        console.error("Error getting step history for interview bot:", error);
        // Continue without previous context if there's an error
      }
    } else {
      console.log("No userId provided for interview bot context");
    }

    const stepContext = {
      role: "system",
      content: [
        {
          type: "input_text",
          text: `User is currently on step "${currentStep}": ${getInterviewStepsDescription(
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

    // Update input to include previousStepsContext
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

    interviewStepConversations[currentStep] = [
      ...stepHistory,
      userMessage,
      assistantMessage,
    ];

    if (interviewStepConversations[currentStep].length > 20) {
      const welcomeMessage = interviewStepConversations[currentStep][1];
      interviewStepConversations[currentStep] = [
        enhancedSystemMessage,
        welcomeMessage,
        ...interviewStepConversations[currentStep].slice(-18),
      ];
    }

    // Check if AI's response indicates a role when our pattern detection didn't find one
    if ((detectedRole === "unknown" || !detectedRole) && response.output_text) {
      const aiDetectedRole = extractRoleFromAIResponse(response.output_text);
      if (aiDetectedRole) {
        console.log(
          `Role detected from AI response (interview): ${aiDetectedRole}`
        );
        detectedRole = aiDetectedRole;
      }
    }

    res.json({
      message: response.output_text,
      detectedRole: detectedRole,
    });
  } catch (error) {
    console.error("Interview chat error:", error);
    res.status(500).json({ error: "Failed to process your request" });
  }
});

export default router;
