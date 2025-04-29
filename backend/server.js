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

// Welcome messages for each step
const stepWelcomeMessages = {
  "step-1":
    "Välkommen till processen för att ansöka om arbetshjälpmedel! I detta första steg behöver vi bestämma vilken typ av ärende du har. \n\nÄr du en arbetstagare som behöver hjälpmedel för att kunna arbeta, eller representerar du en arbetsgivare som ansöker för en anställds räkning? Detta avgör vilken blankett som ska användas (FK 7545 eller FK 7546).",

  "step-2":
    "Nu ska vi beskriva din funktionsnedsättning och hur den påverkar ditt arbete. \n\nBerätta om din funktionsnedsättning, diagnos (om du har en) och vilka begränsningar den medför i arbetslivet. Detaljerad information här hjälper Försäkringskassan att förstå dina behov bättre.",

  "step-3":
    "I detta steg ska vi identifiera dina grundläggande behov för att kunna utföra ditt arbete. \n\nVilka arbetsuppgifter har du svårt att utföra på grund av din funktionsnedsättning? Vilka specifika hinder möter du i arbetet? Konkreta exempel hjälper till att bygga din ansökan.",

  "step-4":
    "Nu ska vi undersöka andra behov som kan finnas för att du ska kunna utföra ditt arbete. \n\nDetta kan handla om behov som inte är direkt kopplade till din funktionsnedsättning men som ändå påverkar din arbetsförmåga. Det kan också innefatta sociala eller organisatoriska aspekter av arbetet.",

  "step-5":
    "I detta steg ska vi gå igenom vilket stöd du redan får idag. \n\nBerätta om du har några hjälpmedel eller anpassningar på din arbetsplats idag, eller om du får stöd från andra aktörer som kommun, region, eller Arbetsförmedlingen. Detta är viktigt för att undvika dubbla insatser.",

  "step-6":
    "Nu är det dags att granska och sammanfatta din ansökan. \n\nLåt oss gå igenom den information du har delat och se till att din ansökan är komplett innan den skickas in. Jag kan hjälpa dig att formulera texten för fritextfälten i blanketten.",
};

// Store separate conversation history for each step
let stepConversations = {
  "step-1": [systemMessage],
  "step-2": [systemMessage],
  "step-3": [systemMessage],
  "step-4": [systemMessage],
  "step-5": [systemMessage],
  "step-6": [systemMessage],
};

// Initialize conversations with welcome messages
for (const step in stepConversations) {
  // Add welcome message as assistant's first message
  const welcomeMessage = {
    role: "assistant",
    content: [
      {
        type: "output_text",
        text: stepWelcomeMessages[step],
      },
    ],
  };

  // If no conversation exists yet, add the welcome message
  stepConversations[step] = [systemMessage, welcomeMessage];
}

// Endpoint to process user messages and get responses
app.post("/chat", async (req, res) => {
  try {
    const { message, currentStep = "step-1" } = req.body;

    // Get the conversation history for this step
    const stepHistory = stepConversations[currentStep] || [systemMessage];

    // Add step context to the prompt
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

    // Add user message
    const userMessage = {
      role: "user",
      content: [
        {
          type: "input_text",
          text: message,
        },
      ],
    };

    // Create input for the API call with step-specific context
    const input = [stepContext, ...stepHistory, userMessage];

    // Call the Responses API
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
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

    // Update the step-specific conversation history
    stepConversations[currentStep] = [
      ...stepHistory,
      userMessage,
      assistantMessage,
    ];

    // Optionally limit history size to prevent token overflow
    if (stepConversations[currentStep].length > 20) {
      // Keep system message and welcome message, then add the most recent messages
      const welcomeMessage = stepConversations[currentStep][1];
      stepConversations[currentStep] = [
        systemMessage,
        welcomeMessage,
        ...stepConversations[currentStep].slice(
          stepConversations[currentStep].length - 18
        ),
      ];
    }

    // Send response back to client
    res.json({ message: response.output_text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process your request" });
  }
});

// Get history for all steps (legacy endpoint for backward compatibility)
app.get("/history", (req, res) => {
  // Get the first step with any messages, or default to step-1
  const firstStepWithMessages =
    Object.entries(stepConversations).find(
      ([_, messages]) => messages.length > 1
    )?.[0] || "step-1";

  // Return that step's history
  const history = stepConversations[firstStepWithMessages] || [systemMessage];

  const formattedHistory = history
    .filter((msg) => msg.role !== "system")
    .map((msg) => ({
      role: msg.role,
      content: msg.content[0].text,
    }));

  res.json(formattedHistory);
});

// Get history for a specific step
app.get("/history/:stepId", (req, res) => {
  const { stepId } = req.params;
  const history = stepConversations[stepId] || [systemMessage];

  const formattedHistory = history
    .filter((msg) => msg.role !== "system")
    .map((msg) => ({
      role: msg.role,
      content: msg.content[0].text,
    }));

  res.json(formattedHistory);
});

// Clear all conversation histories
app.post("/clear", (req, res) => {
  initializeConversations();
  res.json({
    message: "All conversation histories cleared and welcome messages restored",
  });
});

// Clear a specific step's conversation history
app.post("/clear/:stepId", (req, res) => {
  const { stepId } = req.params;

  if (stepConversations[stepId]) {
    // Reset but keep welcome message
    const welcomeMessage = {
      role: "assistant",
      content: [
        {
          type: "output_text",
          text: stepWelcomeMessages[stepId],
        },
      ],
    };

    stepConversations[stepId] = [systemMessage, welcomeMessage];
    res.json({
      message: `Conversation history for ${stepId} cleared and welcome message restored`,
    });
  } else {
    res.status(404).json({ error: "Step not found" });
  }
});

// Helper function to initialize all conversations with welcome messages
function initializeConversations() {
  stepConversations = {
    "step-1": [systemMessage],
    "step-2": [systemMessage],
    "step-3": [systemMessage],
    "step-4": [systemMessage],
    "step-5": [systemMessage],
    "step-6": [systemMessage],
  };

  // Add welcome messages to each step
  for (const step in stepConversations) {
    const welcomeMessage = {
      role: "assistant",
      content: [
        {
          type: "output_text",
          text: stepWelcomeMessages[step],
        },
      ],
    };

    stepConversations[step] = [systemMessage, welcomeMessage];
  }
}

// Initialize conversations on startup
initializeConversations();

// Helper function to get step descriptions
function getStepDescription(step) {
  switch (step) {
    case "step-1":
      return "Välj ärendetyp - Hjälp användaren att bestämma om de ska använda blankett FK 7545 eller FK 7546 baserat på om de är arbetstagare eller arbetsgivare.";
    case "step-2":
      return "Funktionsnedsättning - Hjälp användaren att beskriva sin funktionsnedsättning och hur den påverkar arbetsförmågan.";
    case "step-3":
      return "Grundläggande behov - Hjälp användaren att identifiera vilka behov som finns för att kunna utföra arbetet.";
    case "step-4":
      return "Andra behov - Hjälp användaren att identifiera andra behov som kan finnas för att utföra arbetet, som inte är direkt kopplade till funktionsnedsättningen.";
    case "step-5":
      return "Nuvarande stöd - Hjälp användaren att beskriva vilket stöd de får idag och från vilka aktörer.";
    case "step-6":
      return "Granska och skicka - Hjälp användaren att sammanfatta sin ansökan och kontrollera att all nödvändig information finns med.";
    default:
      return "Hjälp användaren med arbetshjälpmedel från Försäkringskassan.";
  }
}

// Start server
app.listen(PORT, () => {
  console.log("Started on port: " + PORT);
});
