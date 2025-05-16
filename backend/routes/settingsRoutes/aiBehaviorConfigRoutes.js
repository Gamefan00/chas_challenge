import express from "express";
import query from "../../utils/supabaseQuery.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await query(
      `SELECT key, value FROM admin_settings WHERE category = $1`,
      ["AI-Behavior Configuration"]
    );

    if (!result || result.length === 0) {
      // Return default structure if no settings found
      return res.json({
        behaviorConfig: {
          applicationSystemMessage: "",
          applicationSteps: {},
          interviewSystemMessage: "",
          interviewSteps: {},
          conversationConfig: {
            systemMessage: {
              role: "system",
              content:
                "Du är expert på arbetshjälpmedel.\n\nRegler:\nDu vägleder användaren (individer eller arbetsgivare) genom processen att ansöka om arbetshjälpmedel från Försäkringskassan, inklusive:\nVal av rätt blankett (FK 7545 eller FK 7546)\nStöd med svar vid utredningssamtal\nFörklaringar av regler och lagar (t.ex. AML, HSL, Diskrimineringslagen)\nTextförslag för fritextfält\nSekretesskyddad hantering av konversationer och dokument",
            },
            stepWelcomeMessagesApplication: {
              "step-1":
                "Välkommen till processen för att ansöka om arbetshjälpmedel! I detta första steg behöver vi bestämma vilken typ av ärende du har.",
              "step-2":
                "Nu ska vi beskriva din funktionsnedsättning och hur den påverkar ditt arbete.",
              "step-3":
                "I detta steg ska vi identifiera dina grundläggande behov för att kunna utföra ditt arbete.",
              "step-4":
                "Nu ska vi undersöka andra behov som kan finnas för att du ska kunna utföra ditt arbete.",
              "step-5":
                "I detta steg ska vi gå igenom vilket stöd du redan får idag.",
              "step-6":
                "Nu är det dags att granska och sammanfatta din ansökan.",
            },
            stepDescriptions: {
              "step-1":
                "Välj ärendetyp - Hjälp användaren att bestämma om de ska använda blankett FK 7545 eller FK 7546 baserat på om de är arbetstagare eller arbetsgivare.",
              "step-2":
                "Funktionsnedsättning - Hjälp användaren att beskriva sin funktionsnedsättning och hur den påverkar arbetsförmågan.",
              "step-3":
                "Grundläggande behov - Hjälp användaren att identifiera vilka behov som finns för att kunna utföra arbetet.",
              "step-4":
                "Andra behov - Hjälp användaren att identifiera andra behov som kan finnas för att utföra arbetet, som inte är direkt kopplade till funktionsnedsättningen.",
              "step-5":
                "Nuvarande stöd - Hjälp användaren att beskriva vilket stöd de får idag och från vilka aktörer.",
              "step-6":
                "Granska och skicka - Hjälp användaren att sammanfatta sin ansökan och kontrollera att all nödvändig information finns med.",
            },
          },
        },
      });
    }

    const behaviorConfig = {};
    result.forEach((item) => {
      try {
        behaviorConfig[item.key] = JSON.parse(item.value);
      } catch (e) {
        behaviorConfig[item.key] = item.value;
      }
    });

    res.json({ behaviorConfig });
  } catch (error) {
    console.error("Error fetching AI behavior settings:", error);
    res.status(500).json({ error: "Failed to fetch behavior settings" });
  }
});

router.post("/", async (req, res) => {
  const { behaviorConfig } = req.body;

  if (!behaviorConfig) {
    return res
      .status(400)
      .json({ error: "Missing behaviorConfig in request body" });
  }

  try {
    // Extract each major section as a separate database entry
    const settings = [
      {
        key: "applicationSystemMessage",
        value: JSON.stringify(behaviorConfig.applicationSystemMessage || ""),
        description: "System instructions for Application AI assistant",
      },
      {
        key: "applicationSteps",
        value: JSON.stringify(behaviorConfig.applicationSteps || {}),
        description:
          "Configuration for application steps, welcome messages and descriptions",
      },
      {
        key: "interviewSystemMessage",
        value: JSON.stringify(behaviorConfig.interviewSystemMessage || ""),
        description: "System instructions for Interview AI assistant",
      },
      {
        key: "interviewSteps",
        value: JSON.stringify(behaviorConfig.interviewSteps || {}),
        description: "Configuration for interview questions and labels",
      },
      {
        key: "conversationConfig",
        value: JSON.stringify(
          behaviorConfig.conversationConfig || {
            systemMessage: {
              role: "system",
              content:
                "Du är expert på arbetshjälpmedel.\n\nRegler:\nDu vägleder användaren (individer eller arbetsgivare) genom processen att ansöka om arbetshjälpmedel från Försäkringskassan, inklusive:\nVal av rätt blankett (FK 7545 eller FK 7546)\nStöd med svar vid utredningssamtal\nFörklaringar av regler och lagar (t.ex. AML, HSL, Diskrimineringslagen)\nTextförslag för fritextfält\nSekretesskyddad hantering av konversationer och dokument",
            },
            stepWelcomeMessagesApplication: {
              "step-1":
                "Välkommen till processen för att ansöka om arbetshjälpmedel! I detta första steg behöver vi bestämma vilken typ av ärende du har.",
              "step-2":
                "Nu ska vi beskriva din funktionsnedsättning och hur den påverkar ditt arbete.",
              "step-3":
                "I detta steg ska vi identifiera dina grundläggande behov för att kunna utföra ditt arbete.",
              "step-4":
                "Nu ska vi undersöka andra behov som kan finnas för att du ska kunna utföra ditt arbete.",
              "step-5":
                "I detta steg ska vi gå igenom vilket stöd du redan får idag.",
              "step-6":
                "Nu är det dags att granska och sammanfatta din ansökan.",
            },
            stepDescriptions: {
              "step-1":
                "Välj ärendetyp - Hjälp användaren att bestämma om de ska använda blankett FK 7545 eller FK 7546 baserat på om de är arbetstagare eller arbetsgivare.",
              "step-2":
                "Funktionsnedsättning - Hjälp användaren att beskriva sin funktionsnedsättning och hur den påverkar arbetsförmågan.",
              "step-3":
                "Grundläggande behov - Hjälp användaren att identifiera vilka behov som finns för att kunna utföra arbetet.",
              "step-4":
                "Andra behov - Hjälp användaren att identifiera andra behov som kan finnas för att utföra arbetet, som inte är direkt kopplade till funktionsnedsättningen.",
              "step-5":
                "Nuvarande stöd - Hjälp användaren att beskriva vilket stöd de får idag och från vilka aktörer.",
              "step-6":
                "Granska och skicka - Hjälp användaren att sammanfatta sin ansökan och kontrollera att all nödvändig information finns med.",
            },
          }
        ),
        description:
          "System messages and step configurations from applicationConversationManager",
      },
    ];

    for (const { key, value, description } of settings) {
      await query(
        `INSERT INTO admin_settings (key, value, category, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (key)
         DO UPDATE SET value = EXCLUDED.value`,
        [key, value, "AI-Behavior Configuration", description]
      );
    }

    res.json({ message: "AI behavior settings saved successfully" });
  } catch (error) {
    console.error("Error saving settings:", error);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

export default router;
