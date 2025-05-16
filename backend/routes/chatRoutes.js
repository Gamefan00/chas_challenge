import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import query from "../utils/supabaseQuery.js";
import {
  systemMessage,
  stepConversations,
  getStepDescription,
  fetchApplicationSteps,
} from "../utils/conversationManager.js";

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

    // Fetch application steps (it's a function, not an object)
    const applicationSteps = await fetchApplicationSteps();

    if (!applicationSteps[step]) {
      return res.status(404).json({ error: "Step not found" });
    }

    // Send welcome message for the requested step
    res.json({ message: applicationSteps[step] });
  } catch (error) {
    console.error("Error fetching welcome message:", error);
    res.status(500).json({ error: "Failed to fetch welcome message" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { message, currentStep = "step-1" } = req.body;

    // Get AI settings with fallback values
    const { model, temperature, maxTokens } = await getAISettings();

    // Fetch application steps
    const applicationSteps = await fetchApplicationSteps();

    // Get the step history from the imported stepConversations, with initial welcome message if needed
    if (
      !stepConversations[currentStep] ||
      stepConversations[currentStep].length === 0
    ) {
      // Initialize conversation for this step if it doesn't exist
      stepConversations[currentStep] = [
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

    const stepHistory = stepConversations[currentStep];

    const stepContext = {
      role: "system",
      content: [
        {
          type: "input_text",
          text: `User is currently on step "${currentStep}": ${getStepDescription(
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

    const input = [stepContext, ...stepHistory, userMessage];

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
        systemMessage,
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

    // Fetch application steps - IMPORTANT: This is a function call
    const applicationSteps = await fetchApplicationSteps();

    if (!applicationSteps[step]) {
      return res.status(404).json({ error: "Step not found" });
    }

    // Send welcome message for the requested step
    res.json({ message: applicationSteps[step] });
  } catch (error) {
    console.error("Error fetching welcome message:", error);
    res.status(500).json({ error: "Failed to fetch welcome message" });
  }
});

router.post("/interview/", async (req, res) => {
  try {
    const { message, currentStep = "step-1" } = req.body;

    // Get AI settings with fallback values
    const { model, temperature, maxTokens } = await getAISettings();

    // Fetch application steps - IMPORTANT: This is a function call
    const applicationSteps = await fetchApplicationSteps();

    // Get the step history from the imported stepConversations, with initial welcome message if needed
    if (
      !stepConversations[currentStep] ||
      stepConversations[currentStep].length === 0
    ) {
      // Initialize conversation for this step if it doesn't exist
      stepConversations[currentStep] = [
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

    const stepHistory = stepConversations[currentStep];

    const stepContext = {
      role: "system",
      content: [
        {
          type: "input_text",
          text: `User is currently on step "${currentStep}": ${getStepDescription(
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

    const input = [stepContext, ...stepHistory, userMessage];

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
        systemMessage,
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

export default router;
