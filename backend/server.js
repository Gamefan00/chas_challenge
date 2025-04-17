import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";

// Load .env file before server starts, needed for dev environment
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define your system message - this will be consistent across requests
const systemMessage = {
  role: "system",
  content: [
    {
      type: "input_text",
      text: "Du är expert på arbetshjälpmedel.\n\nRegler:\nDu vägleder användaren (individer eller arbetsgivare) genom processen att ansöka om arbetshjälpmedel från Försäkringskassan, inklusive:\nVal av rätt blankett (FK 7545 eller FK 7546)\nStöd med svar vid utredningssamtal\nFörklaringar av regler och lagar (t.ex. AML, HSL, Diskrimineringslagen)\nTextförslag för fritextfält\nSekretesskyddad hantering av konversationer och dokument",
    },
  ],
};

// Store conversation history
let conversationHistory = [systemMessage];

// Endpoint to process user messages and get responses
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Add user message to history
    const userMessage = {
      role: "user",
      content: [
        {
          type: "input_text",
          text: message,
        },
      ],
    };

    // Create input for the API call
    const input = [...conversationHistory, userMessage];

    // Call the Responses API
    const response = await openai.responses.create({
      model: "gpt-4.1-mini", // Or your preferred model
      input: input,
      text: {
        format: {
          type: "text",
        },
      },
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

    // Add assistant response to history
    const assistantMessage = {
      role: "assistant",
      content: [
        {
          type: "output_text",
          text: response.output_text,
        },
      ],
    };

    // Update conversation history (limit size if needed)
    conversationHistory = [
      ...conversationHistory,
      userMessage,
      assistantMessage,
    ];

    // Optionally limit history size to prevent token overflow
    if (conversationHistory.length > 20) {
      // Keep system message and last N messages
      conversationHistory = [
        systemMessage,
        ...conversationHistory.slice(conversationHistory.length - 19),
      ];
    }

    // Send response back to client
    res.json({ message: response.output_text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process your request" });
  }
});

// Get conversation history
app.get("/history", (req, res) => {
  // Return only the text part of the conversation for display purposes
  const formattedHistory = conversationHistory
    .filter((msg) => msg.role !== "system") // Exclude system message
    .map((msg) => ({
      role: msg.role,
      content: msg.content[0].text,
    }));

  res.json(formattedHistory);
});

// Clear conversation history
app.post("/clear", (req, res) => {
  conversationHistory = [systemMessage];
  res.json({ message: "Conversation history cleared" });
});

// Start server
app.listen(PORT, () => {
  console.log("Started on port: " + PORT);
});
