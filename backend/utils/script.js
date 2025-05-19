// RUN SCRIPT TO ADD AI BEHAVIOR SETTINGS TO DB

import fetch from "node-fetch";

async function initializeConversationSettings() {
  const BASE_URL = process.env.API_URL || "http://localhost:4000";

  try {
    console.log("Fetching current behavior settings...");
    // First get current settings
    const response = await fetch(
      `${BASE_URL}/settingsRoutes/aiBehaviorConfigRoutes`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch current settings: ${response.status}`);
    }

    const data = await response.json();
    const behaviorConfig = data.behaviorConfig || {};

    // Add the conversation settings for Application bot
    behaviorConfig.conversationConfig = {
      systemMessage: {
        role: "system",
        content:
          "Du är expert på arbetshjälpmedel.\n\nRegler:\nDu vägleder användaren (individer eller arbetsgivare) genom processen att ansöka om arbetshjälpmedel från Försäkringskassan, inklusive:\nVal av rätt blankett (FK 7545 eller FK 7546)\nStöd med svar vid utredningssamtal\nFörklaringar av regler och lagar (t.ex. AML, HSL, Diskrimineringslagen)\nTextförslag för fritextfält\nSekretesskyddad hantering av konversationer och dokument",
      },
      stepWelcomeMessages: {
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
    };

    // Add the Interview bot settings for Interview
    behaviorConfig.interviewSystemMessage =
      "Du är en intervjuassistent för arbetshjälpmedel. Du hjälper till att samla information systematiskt genom en strukturerad intervjuprocess.";

    // Create interview steps configuration for Interview
    behaviorConfig.interviewSteps = {
      "step-1": {
        label: "Start av intervju",
        heading: "Förberedelse av intervju",
      },
      "step-2": {
        label: "Funktionsnedsättning",
        heading: "Om din funktionsnedsättning",
      },
      "step-3": {
        label: "Grundläggande behov",
        heading: "Dina arbetsrelaterade behov",
      },
      "step-4": {
        label: "Andra behov",
        heading: "Övriga behov i arbetet",
      },
      "step-5": {
        label: "Nuvarande stöd",
        heading: "Stöd du redan får",
      },
      "step-6": {
        label: "Granska och skicka",
        heading: "Sammanfatta och ladda ner",
      },
      "step-7": {
        label: "Arbetsuppgifter",
        heading: "Dina dagliga arbetsuppgifter",
      },
      "step-8": {
        label: "Arbetsplats",
        heading: "Din fysiska arbetsplats",
      },
      "step-9": {
        label: "Arbetsmiljö",
        heading: "Din arbetsmiljö",
      },
      "step-10": {
        label: "Tidigare anpassningar",
        heading: "Tidigare prövade anpassningar",
      },
      "step-11": {
        label: "Önskade hjälpmedel",
        heading: "Hjälpmedel du tror kan hjälpa",
      },
      "step-12": {
        label: "Sociala aspekter",
        heading: "Sociala aspekter av arbetet",
      },
      "step-13": {
        label: "Påverkan på kollegor",
        heading: "Påverkan på kollegor och teamarbete",
      },
      "step-14": {
        label: "Arbetsgivarens inställning",
        heading: "Din arbetsgivares inställning",
      },
      "step-15": {
        label: "Sammanfattning",
        heading: "Sammanfattning av intervjun",
      },
    };

    // Application step specific instructions
    behaviorConfig.applicationSystemMessage =
      "Du är en assistent för ansökning om arbetshjälpmedel. Du vägleder användaren genom ansökningsprocessen med Försäkringskassan.";

    behaviorConfig.applicationSteps = {
      "step-1": {
        welcome:
          "Välkommen till ansökningsprocessen för arbetshjälpmedel! Vi börjar med att bestämma vilken typ av blankett du behöver fylla i.",
        description:
          "Identifiera om användaren är arbetstagare eller arbetsgivare för att välja rätt blankett (FK 7545 eller FK 7546).",
      },
      "step-2": {
        welcome:
          "Nu ska vi beskriva din funktionsnedsättning och hur den påverkar ditt arbete.",
        description:
          "Hjälp användaren att formulera en tydlig beskrivning av sin funktionsnedsättning och dess påverkan på arbetsförmågan.",
      },
      "step-3": {
        welcome:
          "I detta steg ska vi identifiera dina grundläggande behov för att kunna utföra ditt arbete.",
        description:
          "Guida användaren att identifiera vilka behov som finns för att kunna utföra arbetet effektivt.",
      },
      "step-4": {
        welcome:
          "Nu ska vi undersöka andra behov som kan finnas för att du ska kunna utföra ditt arbete.",
        description:
          "Identifiera behov som inte är direkt kopplade till funktionsnedsättningen men påverkar arbetsförmågan.",
      },
      "step-5": {
        welcome: "I detta steg ska vi gå igenom vilket stöd du redan får idag.",
        description:
          "Dokumentera befintliga stöd och hjälpmedel för att undvika dubbla insatser.",
      },
      "step-6": {
        welcome: "Nu är det dags att granska och sammanfatta din ansökan.",
        description:
          "Hjälp användaren att kontrollera att all information är korrekt och fullständig innan ansökan skickas in.",
      },
    };

    // Save the updated settings
    console.log("Saving conversation settings to database...");
    const saveResponse = await fetch(
      `${BASE_URL}/settingsRoutes/aiBehaviorConfigRoutes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ behaviorConfig }),
      }
    );

    if (!saveResponse.ok) {
      throw new Error(`Failed to save settings: ${saveResponse.status}`);
    }

    const saveResult = await saveResponse.json();
    console.log(
      "Conversation settings saved successfully:",
      saveResult.message
    );
  } catch (error) {
    console.error("Error initializing conversation settings:", error);
  }
}

// Run the initialization
initializeConversationSettings();
