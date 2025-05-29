import {
  detectUserRole,
  fetchSystemMessageFromDB,
  fetchSteps,
  getStepDescription,
  getWelcomeMessageForRole as baseGetWelcomeMessageForRole,
} from "./baseConversationManager.js";

// Application specific constants
const defaultSystemMessageApplication = {
  role: "system",
  content: [
    {
      type: "input_text",
      text: `Du är expert på arbetshjälpmedel.

VIKTIGT: Identifiera först om användaren är Arbetstagare eller Arbetsgivare baserat på deras svar.
Var uppmärksam på att användaren kan stava fel, använda synonymer eller beskriva sin roll indirekt.

Om användaren skriver något som antyder att de är en arbetstagare, exempelvis att de:
- Är anställda
- Söker för sig själva
- Beskriver sin egen arbetssituation eller funktionsnedsättning
Då ska du behandla dem som ARBETSTAGARE.

Om användaren skriver något som antyder att de är en arbetsgivare, exempelvis att de:
- Är chef
- Representerar ett företag
- Ansöker för en anställd
- Beskriver en anställds situation
Då ska du behandla dem som ARBETSGIVARE.

Förtydliga alltid vilken roll du har uppfattat genom att säga "Som arbetstagare..." eller "Som arbetsgivare..." i ditt svar.

=== ARBETSTAGARE INSTRUKTIONER ===
Om användaren är en arbetstagare (anställd som ansöker för sig själv):
- Använd blankett FK 7545
- Fokusera på personliga behov och funktionsnedsättning
- Vägled genom personlig ansökan
- Hjälp med att beskriva egen arbetssituation

=== ARBETSGIVARE INSTRUKTIONER ===
Om användaren är en arbetsgivare (ansöker för en anställd):
- Använd blankett FK 7546
- Fokusera på anpassningar av arbetsplatsen
- Vägled genom ansökan för anställd
- Hjälp med att beskriva arbetsmiljön

=== ALLMÄNNA REGLER ===
Du vägleder användaren genom processen att ansöka om arbetshjälpmedel från Försäkringskassan, inklusive:
- Val av rätt blankett (FK 7545 eller FK 7546)
- Stöd med svar vid utredningssamtal
- Förklaringar av regler och lagar (t.ex. AML, HSL, Diskrimineringslagen)
- Textförslag för fritextfält
- Sekretesskyddad hantering av konversationer och dokument`,
    },
  ],
};

// Default step welcome messages for different roles
const defaultStepWelcomeMessagesApplication = {
  "step-1": {
    arbetstagare:
      "Välkommen till processen för att ansöka om arbetshjälpmedel! Som arbetstagare kommer vi att hjälpa dig fylla i blankett FK 7545. Berätta kort om din arbetssituation och vad du behöver hjälp med.",
    arbetsgivare:
      "Välkommen till processen för att ansöka om arbetshjälpmedel! Som arbetsgivare kommer vi att hjälpa dig fylla i blankett FK 7546 för din anställd. Berätta om vilken anställd du ansöker för och deras behov.",
  },
  "step-2": {
    arbetstagare:
      "Nu ska vi beskriva din funktionsnedsättning och hur den påverkar ditt arbete. Berätta om din diagnos, funktionsnedsättning och vilka begränsningar detta medför i ditt dagliga arbete.",
    arbetsgivare:
      "Nu ska vi beskriva den anställdas funktionsnedsättning och hur den påverkar arbetet. Berätta vad du vet om den anställdas funktionsnedsättning och hur detta påverkar deras arbetsuppgifter.",
  },
  "step-3": {
    arbetstagare:
      "I detta steg ska vi identifiera dina grundläggande behov för att kunna utföra ditt arbete. Vilka arbetsuppgifter har du svårt att utföra? Vilka specifika hinder möter du?",
    arbetsgivare:
      "I detta steg ska vi identifiera den anställdas grundläggande behov för att kunna utföra arbetet. Vilka arbetsuppgifter har den anställda svårt med? Vilka anpassningar tror du behövs?",
  },
  "step-4": {
    arbetstagare:
      "Nu ska vi undersöka andra behov som kan finnas för att du ska kunna utföra ditt arbete optimalt. Detta kan handla om sociala eller organisatoriska aspekter av arbetet.",
    arbetsgivare:
      "Nu ska vi undersöka andra behov som kan finnas för den anställda. Detta kan handla om arbetsmiljöanpassningar, tekniska lösningar eller organisatoriska förändringar.",
  },
  "step-5": {
    arbetstagare:
      "I detta steg ska vi gå igenom vilket stöd du redan får idag. Har du några hjälpmedel eller anpassningar på din arbetsplats? Får du stöd från andra aktörer?",
    arbetsgivare:
      "I detta steg ska vi gå igenom vilket stöd den anställda redan får idag. Vilka anpassningar eller hjälpmedel finns redan på arbetsplatsen? Vilket stöd får ni från andra aktörer?",
  },
  "step-6": {
    arbetstagare:
      "Nu är det dags att granska och sammanfatta din ansökan. Vi går igenom all information och ser till att din ansökan är komplett innan den skickas in.",
    arbetsgivare:
      "Nu är det dags att granska och sammanfatta ansökan för er anställda. Vi går igenom all information och ser till att ansökan är komplett innan den skickas in.",
  },
};

const defaultStepDescriptionsApplication = {
  "step-1":
    "Välj ärendetyp - Hjälp användaren att bestämma om de ska använda blankett FK 7545 eller FK 7546 baserat på om de är arbetstagare eller arbetsgivare.",
  "step-2":
    "Funktionsnedsättning - Hjälp användaren att beskriva funktionsnedsättning och hur den påverkar arbetsförmågan.",
  "step-3":
    "Grundläggande behov - Hjälp användaren att identifiera vilka behov som finns för att kunna utföra arbetet.",
  "step-4":
    "Andra behov - Hjälp användaren att identifiera andra behov som kan finnas för att utföra arbetet.",
  "step-5":
    "Nuvarande stöd - Hjälp användaren att beskriva vilket stöd de får idag och från vilka aktörer.",
  "step-6":
    "Sammanfattning - Hjälp användaren att sammanfatta ansökan och kontrollera att all information finns med.",
};

// Application-specific neutral messages
const applicationNeutralWelcomes = {
  "step-1":
    "Välkommen till ansökningsguiden för arbetshjälpmedel! För att ge dig bästa möjliga hjälp, behöver jag veta om du är arbetstagare (ansöker för dig själv) eller arbetsgivare (ansöker för en anställd)?",
  "step-2":
    "I detta steg ska vi beskriva funktionsnedsättningen. Men först behöver jag veta om du är arbetstagare eller arbetsgivare för att kunna ge rätt vägledning.",
  // Add similar neutral messages for all steps
};

export let systemMessage = defaultSystemMessageApplication;
export let applicationSteps = defaultStepWelcomeMessagesApplication;

// Export application-specific versions of utility functions
export { detectUserRole };

export async function fetchApplicationSteps() {
  applicationSteps = await fetchSteps(
    "applicationSteps",
    defaultStepWelcomeMessagesApplication
  );
  return applicationSteps;
}

export async function fetchApplicationSystemMessageFromDB() {
  systemMessage = await fetchSystemMessageFromDB(
    "applicationSystemMessage",
    "AI-Behavior Configuration",
    defaultSystemMessageApplication
  );
  return systemMessage;
}

export async function getApplicationStepsDescription(step) {
  return getStepDescription(
    "applicationSteps",
    step,
    defaultStepDescriptionsApplication
  );
}

export function getApplicationWelcomeMessageForRole(stepId, userRole = null) {
  return baseGetWelcomeMessageForRole(
    stepId,
    userRole,
    applicationSteps,
    applicationNeutralWelcomes
  );
}

export async function initializeApplicationConversations() {
  // Just load system message and steps
  systemMessage = await fetchApplicationSystemMessageFromDB();
  applicationSteps = await fetchApplicationSteps();

  console.log("Application conversation manager initialized (stateless)");
}

export async function refreshApplicationConversationSettings() {
  systemMessage = await fetchApplicationSystemMessageFromDB();
  applicationSteps = await fetchApplicationSteps();

  console.log("Application conversation settings refreshed (stateless)");
}

export { defaultSystemMessageApplication };

// Initialize on module load
initializeApplicationConversations();
