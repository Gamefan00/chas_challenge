import {
  detectUserRole,
  fetchSystemMessageFromDB,
  fetchSteps,
  getStepDescription,
  getWelcomeMessageForRole as baseGetWelcomeMessageForRole,
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
      "Välkommen till intervjun om arbetshjälpmedel! Berätta gärna utförligt om dina arbetsuppgifter, från det att du kommer till jobbet tills du går hem. Fokusera särskilt på moment där din funktionsnedsättning påverkar hur du utför arbetet.",
    arbetsgivare:
      "Välkommen till intervjun om arbetshjälpmedel! Beskriv de huvudsakliga arbetsuppgifterna för den anställde och vilka delar som är särskilt viktiga för bedömning av hjälpmedelsbehovet.",
  },
  "step-2": {
    arbetstagare:
      "Beskriv vilka arbetsuppgifter som är svåra för dig och hur din funktionsnedsättning påverkar detta. Fokusera gärna på svårigheter som inte har lösts med enklare anpassningar.",
    arbetsgivare:
      "Ge exempel på arbetsuppgifter där den anställde har svårigheter eller utmaningar. Undvik att säga att allt fungerar om det finns områden med problem.",
  },
  "step-3": {
    arbetstagare:
      "Berätta om eventuella anpassningar eller lösningar du eller arbetsgivaren har provat för att underlätta arbetet. Även om de inte fungerat visar det att ni försökt hitta lösningar.",
    arbetsgivare:
      "Beskriv vilka åtgärder eller anpassningar ni har försökt för att underlätta arbetet, såsom ändrade arbetsuppgifter, arbetsplats eller hjälpmedel.",
  },
  "step-4": {
    arbetstagare:
      "Beskriv din arbetsmiljö, exempelvis ljudnivå, belysning, tekniska hjälpmedel och andra faktorer som påverkar din arbetsförmåga.",
    arbetsgivare:
      "Hur ser arbetsmiljön ut för den anställde? Finns det faktorer i miljön som påverkar arbetet, och har ni gjort några anpassningar?",
  },
  "step-5": {
    arbetstagare:
      "Har du haft egna lösningar eller strategier som tidigare hjälpt dig i arbetet? Berätta gärna om dem och varför de inte längre räcker till.",
    arbetsgivare:
      "Har ni observerat att den anställde försökt hitta egna lösningar för att klara arbetet? Hur har dessa fungerat?",
  },
  "step-6": {
    arbetstagare:
      "Berätta om du har hjälpmedel eller annat stöd från vården, till exempel merkostnadsersättning, och förklara varför detta inte räcker för arbetet.",
    arbetsgivare:
      "Har den anställde stöd eller hjälpmedel från till exempel region eller försäkringsbolag? Hur påverkar detta arbetet?",
  },
  "step-7": {
    arbetstagare:
      "Beskriv hur du klarar dig utan hjälpmedlet på fritiden eller hemma. Har du andra lösningar där?",
    arbetsgivare:
      "Vet ni om den anställde använder hjälpmedlet även privat? Detta kan påverka bedömningen av behovet.",
  },
  "step-8": {
    arbetstagare:
      "Beskriv hur du kommer att använda hjälpmedlet i arbetet och vilka arbetsuppgifter som blir enklare. Det stärker bedömningen att du kan visa varför just du behöver hjälpmedlet.",
    arbetsgivare:
      "Förklara hur hjälpmedlet kommer att användas av den anställde i arbetet och vilka arbetsuppgifter det gör möjliga att utföra.",
  },
  "step-9": {
    arbetstagare:
      "Vet du om det finns ekonomiskt stöd eller andra resurser som kan hjälpa till att finansiera hjälpmedlet?",
    arbetsgivare:
      "Finns det ekonomiskt stöd eller andra möjligheter för finansiering av hjälpmedlet?",
  },
  "step-10": {
    arbetstagare:
      "Låt oss sammanfatta informationen du delat inför ditt utredningssamtal. Jag kan hjälpa dig att strukturera all viktig information som du behöver ta med till mötet med Försäkringskassan.",
    arbetsgivare:
      "Nu sammanfattar vi all information inför utredningssamtalet. Jag hjälper dig att strukturera de viktigaste punkterna som ni behöver ta med till mötet med Försäkringskassan.",
  },
};

const defaultStepDescriptionsInterview = {
  "step-1":
    "Arbetssituationen – Hjälp användaren att beskriva en typisk arbetsdag och vilka arbetsuppgifter som är viktiga, särskilt de som påverkas av funktionsnedsättningen.",
  "step-2":
    "Svårigheter – Hjälp användaren att konkret beskriva vilka arbetsuppgifter eller moment som är svåra på grund av funktionsnedsättningen.",
  "step-3":
    "Tidigare anpassningar – Hjälp användaren att berätta om anpassningar eller lösningar som provats för att underlätta arbetet, och hur de fungerat.",
  "step-4":
    "Arbetsmiljö – Hjälp användaren att beskriva den fysiska arbetsmiljön, såsom ljud, ljus och teknik, och hur den påverkar arbetsförmågan.",
  "step-5":
    "Egna strategier – Hjälp användaren att berätta om egna lösningar eller strategier som tidigare använts och hur effektiva de varit.",
  "step-6":
    "Hjälpmedel och stöd – Hjälp användaren att beskriva eventuella hjälpmedel eller stöd som erhållits från vården eller andra instanser.",
  "step-7":
    "Behov på arbete och fritid – Hjälp användaren att jämföra behovet av hjälpmedel och stöd på arbetsplatsen med behovet i fritid eller hemma.",
  "step-8":
    "Användning av hjälpmedel – Hjälp användaren att förklara hur hjälpmedlet kommer att användas i arbetet och vilka arbetsuppgifter det underlättar.",
  "step-9":
    "Finansiering – Hjälp användaren att beskriva om det finns ekonomiskt stöd eller andra resurser för att finansiera hjälpmedlet.",
  "step-10":
    "Slutligen sammanfattar vi informationen inför ditt utredningssamtal med Försäkringskassan.",
};

// Interview-specific neutral messages
const interviewNeutralWelcomes = {
  "step-1":
    "Välkommen till utredningssamtalsverktyget! Vi börjar med att prata om arbetsuppgifterna i rollen. Är du arbetstagare eller arbetsgivare?",
  "step-2":
    "Nu fokuserar vi på svårigheter i arbetet. Är du arbetstagare eller arbetsgivare?",
  "step-3":
    "Låt oss prata om tidigare anpassningar eller försök att lösa arbetsuppgifterna. Är du arbetstagare eller arbetsgivare?",
  "step-4":
    "Här diskuterar vi arbetsmiljön och förutsättningarna på arbetsplatsen. Är du arbetstagare eller arbetsgivare?",
  "step-5":
    "Nu vill jag höra om vilka åtgärder som redan gjorts för att underlätta arbetet. Är du arbetstagare eller arbetsgivare?",
  "step-6":
    "Vi går vidare till stöd utanför arbetet, som hjälp från vård eller liknande. Är du arbetstagare eller arbetsgivare?",
  "step-7":
    "I detta steg jämför vi behov och lösningar mellan arbete och fritid. Är du arbetstagare eller arbetsgivare?",
  "step-8":
    "Nu ska vi prata om användningen av hjälpmedel i arbetet. Är du arbetstagare eller arbetsgivare?",
  "step-9":
    "Avslutningsvis diskuterar vi ekonomi och ansvar kring hjälpmedel. Är du arbetstagare eller arbetsgivare?",
  "step-10":
    "Här sammanfatta vi sen all information, vänligen svara på om du är arbetstagare eller arbetsgivare?",
};

export let systemMessage = defaultSystemMessageInterview;
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
  // Just load system message and steps
  systemMessage = await fetchInterviewSystemMessageFromDB();
  interviewSteps = await fetchInterviewSteps();

  console.log("Interview conversation manager initialized (stateless)");
}

export async function refreshInterviewConversationSettings() {
  systemMessage = await fetchInterviewSystemMessageFromDB();
  interviewSteps = await fetchInterviewSteps();

  console.log("Interview conversation settings refreshed (stateless)");
}

export { defaultSystemMessageInterview };

// Initialize on module load
initializeInterviewConversations();
