import express from "express";
import OpenAI from "openai";
import {
  stepConversations,
  stepWelcomeMessages,
  systemMessage,
  getStepDescription,
} from "../utils/conversationManager.js";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { message, currentStep = "step-1" } = req.body;

    const stepHistory = stepConversations[currentStep] || [systemMessage];

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

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input,
      text: { format: { type: "text" } },
      reasoning: {},
      tools: [
        {
          type: "file_search",
          vector_store_ids: ["vs_67ee4b3df0f481918a769c7ee3c61880"],
        },
      ],
      temperature: 1,
      max_output_tokens: 2048,
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
