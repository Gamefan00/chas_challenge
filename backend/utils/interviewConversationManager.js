import {
  detectUserRole,
  fetchSystemMessageFromDB,
  fetchSteps,
  getStepDescription,
  getWelcomeMessageForRole as baseGetWelcomeMessageForRole,
  initializeConversations,
  refreshConversationSettings,
} from "./baseConversationManager.js";

// Interview specific constants
const defaultSystemMessageInterview = {
  role: "system",
  content: [
    {
      type: "input_text",
      text: `Du är en intervjuassistent för arbetshjälpmedel som hjälper till att samla information systematiskt.

VIKTIGT: Identifiera först om användaren är Arbetstagare eller Arbetsgivare baserat på deras svar.
Var uppmärksam på att användaren kan stava fel, använda synonymer eller beskriva sin roll indirekt.

Om användaren skriver något som antyder att de är en arbetstagare, exempelvis att de:
- Är anställda eller skriver "arbetstagare" (även med stavfel som "arbetstakare" eller liknande)
- Söker för sig själva
- Beskriver sin egen arbetssituation eller funktionsnedsättning
Då ska du behandla dem som ARBETSTAGARE.

Om användaren skriver något som antyder att de är en arbetsgivare, exempelvis att de:
- Är chef eller skriver "arbetsgivare" (även med stavfel som "arbetgivare" eller liknande)
- Representerar ett företag
- Ansöker för en anställd
- Beskriver en anställds situation
Då ska du behandla dem som ARBETSGIVARE.

Förtydliga alltid vilken roll du har uppfattat genom att säga "Som arbetstagare..." eller "Som arbetsgivare..." i början av ditt svar.

=== ARBETSTAGARE INSTRUKTIONER ===
Om användaren är en arbetstagare (anställd som behöver hjälp):
- Ställ personliga frågor om funktionsnedsättning
- Fokusera på individuella behov och utmaningar
- Fråga om personliga erfarenheter av arbetet
- Hjälp att formulera egna behov

=== ARBETSGIVARE INSTRUKTIONER ===
Om användaren är en arbetsgivare (som intervjuar för en anställd):
- Ställ frågor om den anställdas situation
- Fokusera på arbetsmiljöanpassningar
- Fråga om organisatoriska förändringar
- Hjälp att identifiera stödbehov för den anställda

=== ALLMÄNNA REGLER ===
- Använd en strukturerad intervjuprocess
- Ställ följdfrågor för att få djupare förståelse
- Dokumentera svar systematiskt
- Var empatisk och professionell`,
    },
  ],
};

// Default step welcome messages for different roles
const defaultStepWelcomeMessagesInterview = {
  "step-1": {
    arbetstagare:
      "Välkommen till intervjun om arbetshjälpmedel! Kan du kort berätta om dig själv och din nuvarande arbetssituation? Vad arbetar du med och vilka utmaningar upplever du?",
    arbetsgivare:
      "Välkommen till intervjun om arbetshjälpmedel! Kan du berätta om den anställda som ni vill ansöka hjälpmedel för? Vad arbetar personen med och vilka utmaningar har ni observerat?",
  },
  "step-2": {
    arbetstagare:
      "Nu vill jag höra mer om din funktionsnedsättning. Kan du berätta om din diagnos eller funktionsnedsättning och hur den påverkar dig i arbetslivet? Vad blir svårast för dig?",
    arbetsgivare:
      "Nu vill jag höra mer om den anställdas funktionsnedsättning. Vad vet ni om personens diagnos eller funktionsnedsättning? Hur påverkar det deras arbete enligt vad ni har observerat?",
  },
  "step-3": {
    arbetstagare:
      "Låt oss fokusera på dina specifika arbetsuppgifter. Vilka arbetsuppgifter har du svårast med på grund av din funktionsnedsättning? Kan du ge konkreta exempel?",
    arbetsgivare:
      "Låt oss fokusera på den anställdas specifika arbetsuppgifter. Vilka arbetsuppgifter har personen svårast med? Vilka konkreta hinder har ni observerat i deras dagliga arbete?",
  },
  "step-4": {
    arbetstagare:
      "Har du använt några hjälpmedel eller fått anpassningar tidigare? Vad har fungerat bra och vad har varit mindre bra? Finns det något du har testat på egen hand?",
    arbetsgivare:
      "Har ni provat några hjälpmedel eller anpassningar för den anställda tidigare? Vad har fungerat bra på arbetsplatsen och vad behöver förbättras?",
  },
  "step-5": {
    arbetstagare:
      "Berätta om din arbetsmiljö. Hur ser din arbetsplats ut fysiskt? Hur fungerar samarbetet med kollegor och chefer? Finns det miljöfaktorer som påverkar dig?",
    arbetsgivare:
      "Berätta om arbetsmiljön för den anställda. Hur ser arbetsplatsen ut fysiskt? Hur fungerar samarbetet i teamet? Finns det miljöfaktorer som påverkar personens arbetsförmåga?",
  },
  "step-6": {
    arbetstagare:
      "Avslutningsvis, hur fungerar kommunikation och samspel med dina kollegor och kunder? Finns det situationer där du behöver extra stöd för att kommunicera effektivt?",
    arbetsgivare:
      "Avslutningsvis, hur fungerar kommunikation och samspel för den anställda med kollegor och kunder? Finns det situationer där personen behöver extra stöd för att kommunicera effektivt?",
  },
};

const defaultStepDescriptionsInterview = {
  "step-1":
    "Förberedelse - Hjälp användaren att berätta om sig själv och sin arbetssituation.",
  "step-2":
    "Funktionsnedsättning - Hjälp användaren att beskriva funktionsnedsättning och dess påverkan.",
  "step-3":
    "Arbetsuppgifter - Hjälp användaren att identifiera specifika utmaningar i arbetsuppgifter.",
  "step-4":
    "Tidigare erfarenheter - Hjälp användaren att beskriva tidigare hjälpmedel och anpassningar.",
  "step-5":
    "Arbetsmiljö - Hjälp användaren att beskriva sin arbetsmiljö och samarbete.",
  "step-6":
    "Kommunikation - Hjälp användaren att beskriva kommunikationsbehov och samspel.",
};

// Interview-specific neutral messages
const interviewNeutralWelcomes = {
  "step-1":
    "Välkommen till utredningssamtalsverktyget! För att ge dig bästa möjliga hjälp, behöver jag veta om du är arbetstagare eller arbetsgivare?",
  "step-2":
    "I detta steg ska vi förbereda för utredningssamtalet. För att anpassa mina råd, kan du berätta om du är arbetstagare eller arbetsgivare?",
  "step-3":
    "Välkommen till steg 3! För att ge dig rätt stöd, behöver jag veta om du är arbetstagare eller arbetsgivare?",
  "step-4":
    "I detta steg ska vi diskutera specifika frågor. För att anpassa mina råd, är du arbetstagare eller arbetsgivare?",
  "step-5":
    "Välkommen till steg 5! För bästa möjliga hjälp, kan du berätta om du är arbetstagare eller arbetsgivare?",
  "step-6":
    "Välkommen till sista steget! För att anpassa mina råd, är du arbetstagare eller arbetsgivare?",
};

// Interview conversation state
export let systemMessage = defaultSystemMessageInterview;
export let stepConversations = {};
export let interviewSteps = defaultStepWelcomeMessagesInterview;

// Export interview-specific versions of utility functions
export { detectUserRole };

export async function fetchInterviewSteps() {
  interviewSteps = await fetchSteps(
    "interviewSteps",
    defaultStepWelcomeMessagesInterview
  );
  return interviewSteps;
}

export async function fetchInterviewSystemMessageFromDB() {
  systemMessage = await fetchSystemMessageFromDB(
    "interviewSystemMessage",
    "AI-Behavior Configuration",
    defaultSystemMessageInterview
  );
  return systemMessage;
}

export async function getInterviewStepsDescription(step) {
  return getStepDescription(
    "interviewSteps",
    step,
    defaultStepDescriptionsInterview
  );
}

export function getInterviewWelcomeMessageForRole(stepId, userRole = null) {
  return baseGetWelcomeMessageForRole(
    stepId,
    userRole,
    interviewSteps,
    interviewNeutralWelcomes
  );
}

export async function initializeInterviewConversations() {
  const result = await initializeConversations(
    "interviewSystemMessage",
    "AI-Behavior Configuration",
    defaultSystemMessageInterview,
    "interviewSteps",
    defaultStepWelcomeMessagesInterview,
    "interviewSteps",
    defaultStepDescriptionsInterview
  );

  stepConversations = result.stepConversations;
  systemMessage = result.systemMessage;
  interviewSteps = result.steps;
}

export async function refreshInterviewConversationSettings() {
  systemMessage = await refreshConversationSettings(
    stepConversations,
    "interviewSystemMessage",
    "AI-Behavior Configuration",
    defaultSystemMessageInterview,
    "interviewSteps",
    defaultStepDescriptionsInterview
  );
}

export { defaultSystemMessageInterview };

// Initialize on module load
initializeInterviewConversations();
