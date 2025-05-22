import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import query from "../utils/supabaseQuery.js";
import {
  fetchApplicationSystemMessageFromDB,
  stepConversations,
  getApplicationStepsDescription,
  fetchApplicationSteps,
} from "../utils/applicationConversationManager.js";
import {
  fetchInterviewSystemMessageFromDB,
  stepConversations as interviewStepConversations,
  getInterviewStepsDescription,
  fetchInterviewSteps,
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

    console.log("temp result:", temperatureResult);

    const maxTokensResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      ["maxTokens"]
    );

    console.log("token result:", maxTokensResult);

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

/////////////////////////////////////////////////
// Application bot data fetching from database //
/////////////////////////////////////////////////

router.get("/welcome/:step", async (req, res) => {
  try {
    const { step } = req.params;

    // Fetch fresh application steps on each request
    const applicationSteps = await fetchApplicationSteps();

    if (!applicationSteps[step]) {
      return res.status(404).json({ error: "Step not found" });
    }

    res.json({ message: applicationSteps[step] });
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

    const { message, currentStep = "step-1", userId } = req.body;

    // Get AI settings with fallback values
    const { model, temperature, maxTokens } = await getAISettings();

    // Fetch application steps
    const applicationSteps = await fetchApplicationSteps();

    // Get the step description freshly for this request
    const stepDescription = await getApplicationStepsDescription(currentStep);

    // Build the step system message with fresh data
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
      ],
    };

    // Initialize or update the conversation for this step
    if (
      !stepConversations[currentStep] ||
      stepConversations[currentStep].length === 0
    ) {
      const welcomeMessage = {
        role: "assistant",
        content: [
          {
            type: "output_text",
            text:
              applicationSteps[currentStep] ||
              defaultStepWelcomeMessagesApplication[currentStep] ||
              "Välkommen! Vad kan jag hjälpa dig med?",
          },
        ],
      };

      stepConversations[currentStep] = [stepSystemMessage, welcomeMessage];
    } else {
      // Update the system message to reflect any changes in settings
      stepConversations[currentStep][0] = stepSystemMessage;
    }

    const stepHistory = stepConversations[currentStep];

    // Get full step history to send to bot as context
    let previousStepsContext = [];
    if (userId) {
      try {
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
            "SELECT history FROM chat_histories_application WHERE user_id = $1 AND step_id = $2",
            [userId, stepId]
          );

          if (historyResult.length > 0 && historyResult[0].history) {
            let stepHistory = historyResult[0].history;

            // Only add if there's actual conversation (more than just the welcome message)
            if (stepHistory.length > 1) {
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

              // Add the conversation history from this step
              previousStepsContext.push(
                ...stepHistory.map((msg) => ({
                  role: msg.role,
                  content: [
                    {
                      type: msg.role === "user" ? "input_text" : "output_text",
                      text: msg.text,
                    },
                  ],
                }))
              );
            }
          }
        }

        // Get context from interview steps
        const allInterviewSteps = [
          "step-1",
          "step-2",
          "step-3",
          "step-4",
          "step-5",
          "step-6",
        ];

        for (const stepId of allInterviewSteps) {
          const historyResult = await query(
            "SELECT history FROM chat_histories_interview_test WHERE user_id = $1 AND step_id = $2",
            [userId, stepId]
          );

          if (historyResult.length > 0 && historyResult[0].history) {
            let stepHistory = historyResult[0].history;

            // Only add if there's actual conversation (more than just the welcome message)
            if (stepHistory.length > 1) {
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
                  role: msg.role,
                  content: [
                    {
                      type: msg.role === "user" ? "input_text" : "output_text",
                      text: msg.text,
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
          `Added context from ${previousStepsContext.length} messages from other steps`
        );
      } catch (error) {
        console.error("Error getting step history:", error);
        // Continue without previous context if there's an error
      }
    }

    const stepContext = {
      role: "system",
      content: [
        {
          type: "input_text",
          text: `User is currently on step "${currentStep}": ${getApplicationStepsDescription(
            currentStep
          )}`,
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

    console.log("previousStepsContext", previousStepsContext);

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

    res.json({ message: response.output_text });
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

    // Fetch fresh interview steps on each request
    const interviewSteps = await fetchInterviewSteps();

    if (!interviewSteps[step]) {
      return res.status(404).json({ error: "Step not found" });
    }

    res.json({ message: interviewSteps[step] });
  } catch (error) {
    console.error("Error fetching welcome message:", error);
    res.status(500).json({ error: "Failed to fetch welcome message" });
  }
});

router.post("/interview/", async (req, res) => {
  try {
    const systemMessage = await fetchInterviewSystemMessageFromDB();

    const { message, currentStep = "step-1", userId } = req.body;

    // Get AI settings with fallback values
    const { model, temperature, maxTokens } = await getAISettings();

    // Fetch application steps - IMPORTANT: This is a function call
    const applicationSteps = await fetchInterviewSteps();

    // Get the step history from the imported stepConversations, with initial welcome message if needed
    if (
      !interviewStepConversations[currentStep] ||
      interviewStepConversations[currentStep].length === 0
    ) {
      // Initialize conversation for this step if it doesn't exist
      interviewStepConversations[currentStep] = [
        systemMessage,
        {
          role: "assistant",
          content: [
            {
              type: "output_text",
              text:
                applicationSteps[currentStep] ||
                "Välkommen! Vad kan jag hjälpa dig med?",
            },
          ],
        },
      ];
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
            let stepHistory = historyResult[0].history;

            // Decrypt history if it's encrypted
            try {
              if (typeof stepHistory === "string") {
                // Try to decrypt or parse the string
                stepHistory = decrypt(stepHistory);
              }

              // Only add if it's an array with actual conversation
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
                        type:
                          msg.role === "user" ? "input_text" : "output_text",
                        text: msg.text || "",
                      },
                    ],
                  }))
                );
              }
            } catch (error) {
              console.error(
                `Error processing history for step ${stepId}:`,
                error
              );
              // Continue without this step's history
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
            "SELECT history FROM chat_histories_application WHERE user_id = $1 AND step_id = $2",
            [userId, stepId]
          );

          if (historyResult.length > 0 && historyResult[0].history) {
            let stepHistory;

            // Parse history if it's a string
            if (typeof historyResult[0].history === "string") {
              try {
                stepHistory = JSON.parse(historyResult[0].history);
              } catch (parseError) {
                console.error(
                  `Error parsing history for application step ${stepId}:`,
                  parseError
                );
                continue;
              }
            } else {
              stepHistory = historyResult[0].history;
            }

            // Only add if there's actual conversation (more than just the welcome message)
            if (stepHistory.length > 1) {
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
                  role: msg.role,
                  content: [
                    {
                      type: msg.role === "user" ? "input_text" : "output_text",
                      text: msg.text,
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

    console.log("previousStepsContext for interview bot", previousStepsContext);

    const stepContext = {
      role: "system",
      content: [
        {
          type: "input_text",
          text: `User is currently on step "${currentStep}": ${getInterviewStepsDescription(
            currentStep
          )}`,
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

    // Rest of your code remains the same
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
        systemMessage,
        welcomeMessage,
        ...interviewStepConversations[currentStep].slice(-18),
      ];
    }

    res.json({ message: response.output_text });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process your request" });
  }
});

export default router;
