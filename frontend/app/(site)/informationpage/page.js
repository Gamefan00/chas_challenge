"use client";

export default function InformationPage() {
  return (
    <div>
      <div className="bg-background min-h-screen">
        {/* Navigation */}

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="bg-background mb-8 rounded-lg p-8 shadow">
            <h1 className="mb-4 text-center text-4xl font-bold">
              Omfattande guide till ansökningsprocessen
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-center text-lg">
              Här hittar du detaljerad information om hur du ansöker om arbetshjälpmedel, vilka
              utmaningar du kan möta, och hur våra experter kan hjälpa dig genom hela processen.
            </p>
            <div className="text-center">
              <button className="text-foreground hover:bg-primary bg-primary rounded px-6 py-3 font-bold transition">
                Starta din ansökan
              </button>
            </div>
          </section>

          {/* About Section */}
          <section className="bg-background mb-8 rounded-lg p-8 shadow">
            <h2 className="text-foreground mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">
              Om ansökningsprocessen
            </h2>
            <p className="mb-6">
              Att ansöka om arbetshjälpmedel kan vara en komplicerad process med många steg och krav
              som måste uppfyllas. Vår tjänst har utvecklats för att förenkla denna process och
              hjälpa dig att maximera dina chanser att få det stöd du behöver. Vi har samlat all
              relevant information på ett ställe och erbjuder personlig vägledning från experter
              inom området.
            </p>

            <div className="mb-8">
              <h3 className="text-foreground mb-3 text-xl font-semibold">Vem kan ansöka?</h3>
              <p className="mb-3">Du kan ansöka om arbetshjälpmedel om du:</p>
              <ul className="mb-4 list-disc pl-6">
                <li className="mb-2">Har en dokumenterad funktionsnedsättning eller arbetsskada</li>
                <li className="mb-2">Är anställd eller egenföretagare</li>
                <li className="mb-2">Behöver hjälpmedel för att kunna utföra ditt arbete</li>
                <li className="mb-2">Är mellan 18 och 67 år</li>
              </ul>
              <p>
                I vissa fall kan även arbetssökande få stöd för arbetshjälpmedel, särskilt om det
                underlättar processen att få ett arbete.
              </p>
            </div>

            <div>
              <h3 className="text-foreground mb-3 text-xl font-semibold">
                Vilka typer av stöd finns?
              </h3>
              <p className="mb-3">Det finns flera olika former av stöd som kan sökas:</p>
              <ul className="list-disc pl-6">
                <li className="mb-2">
                  <strong>Fysiska hjälpmedel:</strong> Specialanpassade möbler, verktyg och
                  utrustning
                </li>
                <li className="mb-2">
                  <strong>Digitala hjälpmedel:</strong> Programvara, datorutrustning, skärmläsare
                  etc.
                </li>
                <li className="mb-2">
                  <strong>Personligt stöd:</strong> Arbetsbiträde eller personlig assistent
                </li>
                <li className="mb-2">
                  <strong>Anpassningar på arbetsplatsen:</strong> Strukturella förändringar för att
                  förbättra tillgänglighet
                </li>
              </ul>
            </div>
          </section>

          {/* Step by Step Guide */}
          <section className="bg-background mb-8 rounded-lg p-8 shadow">
            <h2 className="text-primary mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">
              Steg-för-steg ansökningsguide
            </h2>
            <p className="mb-6">
              Här är en detaljerad beskrivning av ansökningsprocessen från start till slut:
            </p>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="relative pl-12">
                  <div className="bg-primary text-foreground absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full font-bold">
                    {index + 1}
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Documentation Section */}
          <section className="bg-background mb-8 rounded-lg p-8 shadow">
            <h2 className="text-foreground mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">
              Nödvändig dokumentation
            </h2>
            <p className="mb-6">
              För en framgångsrik ansökan behövs vanligtvis följande dokumentation:
            </p>

            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={index} className="bg-background flex rounded-lg p-4">
                  <div className="text-primary mr-4 text-2xl">📄</div>
                  <div>
                    <h4 className="mb-1 font-bold">{doc.title}</h4>
                    <p className="text-forground">{doc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Statistics Section */}
          <section className="bg-background mb-8 rounded-lg p-8 shadow">
            <h2 className="text-foreground mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">
              Statistik och framgångsfaktorer
            </h2>
            <p className="mb-6">
              Baserat på vår erfarenhet och insamlad data, har vi identifierat några viktiga
              faktorer som påverkar utfallet av en ansökan:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-background">
                    <th className="px-4 py-3 text-left">Faktor</th>
                    <th className="px-4 py-3 text-left">Påverkan på ansökan</th>
                    <th className="px-4 py-3 text-left">Våra rekommendationer</th>
                  </tr>
                </thead>
                <tbody>
                  {statisticsData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-3">{item.factor}</td>
                      <td className="px-4 py-3">{item.impact}</td>
                      <td className="px-4 py-3">{item.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Criticism Section */}
          <section className="bg-background mb-8 rounded-lg p-8 shadow">
            <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold text-blue-700">
              Vanliga kritikpunkter och utmaningar
            </h2>
            <p className="mb-6">
              Vi är medvetna om att ansökningsprocessen kan upplevas som svår och att kritik finns
              mot systemet. Här adresserar vi några av de vanligaste kritikpunkterna och hur vår
              tjänst försöker att hantera dessa utmaningar:
            </p>

            <div className="space-y-6">
              {criticisms.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="rounded-r-lg border-l-4 border-orange-500 bg-orange-50 p-4">
                    <div className="mb-1 font-bold text-orange-700">{item.criticism}</div>
                    <p className="text-forground">{item.description}</p>
                  </div>

                  <div className="bg-primary ml-4 rounded-r-lg border-l-4 border-blue-500 p-4">
                    <div className="mb-1 font-bold text-blue-700">Vår lösning</div>
                    <p className="text-forground">{item.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section className="bg-background mb-8 rounded-lg p-8 shadow">
            <h2 className="text-foreground mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">
              Erfarenheter från tidigare användare
            </h2>

            <div className="space-y-6">
              {testimonials.map((item, index) => (
                <div key={index} className="bg-background relative rounded-lg p-6 italic">
                  <div className="text-foreground absolute top-0 left-3 font-serif text-6xl">"</div>
                  <p className="relative z-10 mb-4">{item.text}</p>
                  <p className="text-right font-bold not-italic">{item.author}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-8 rounded-lg bg-background p-8 shadow">
            <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold text-blue-700">
              Vanliga frågor
            </h2>

            <div className="space-y-6">
              {faqs.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <h3 className="text-foreground mb-2 text-lg font-bold">{item.question}</h3>
                  <p className="text-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="rounded-lg bg-background p-8 shadow">
            <h2 className="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold text-blue-700">
              Kontakta oss
            </h2>
            <p className="mb-6">
              Har du frågor eller behöver du personlig hjälp? Kontakta oss så återkommer vi inom 24
              timmar.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="bg-background rounded-lg p-6">
                <div className="mb-2 font-bold text-blue-700">E-post</div>
                <p>info@ansokshalpen.se</p>
              </div>

              <div className="bg-background rounded-lg p-6">
                <div className="mb-2 font-bold text-blue-700">Telefon</div>
                <p>08-123 45 67</p>
                <p>Vardagar 9-17</p>
              </div>

              <div className="bg-background rounded-lg p-6">
                <div className="mb-2 font-bold text-blue-700">Chatt</div>
                <p>Direktchatt tillgänglig på hemsidan</p>
                <p>Vardagar 8-20, helger 10-16</p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-16 bg-gray-800 py-12 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <h3 className="text-foreground mb-4 font-semibold">Ansökshjälpen</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-foreground hover:text-muted-foreground">
                      Om oss
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground hover:text-muted-foreground">
                      Vårt team
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground hover:text-muted-foreground">
                      Karriär
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground hover:text-white">
                      Press
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-foreground mb-4 font-semibold">Våra tjänster</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-foreground hover:text-white">
                      Ansökningshjälp
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground hover:text-white">
                      Rådgivning
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground hover:text-white">
                      Överklaganden
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground hover:text-white">
                      För företag
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 font-semibold text-gray-400">Resurser</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-foreground hover:text-white">
                      Kunskapsbank
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground hover:text-white">
                      Guider
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground hover:text-white">
                      Mallar
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground hover:text-white">
                      Webbinarier
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 font-semibold text-gray-400">Juridiskt</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-foreground hover:text-white">
                      Integritetspolicy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground hover:text-white">
                      Användarvillkor
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground hover:text-white">
                      Cookie-policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground hover:text-white">
                      GDPR
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
              © 2025 Ansökshjälpen. Alla rättigheter förbehållna.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Bedömning av behov",
    description:
      "Första steget är att få en bedömning av dina specifika behov. Detta görs ofta i samråd med en arbetsterapeut, läkare eller annan specialist som kan dokumentera vilka hjälpmedel som kan underlätta din arbetssituation.",
  },
  {
    title: "Insamling av dokumentation",
    description:
      "Du behöver samla in relevant medicinsk dokumentation, arbetsplatsbeskrivning och annan information som styrker ditt behov. Vår tjänst hjälper dig att identifiera exakt vilka dokument du behöver.",
  },
  {
    title: "Ifyllande av ansökningsformulär",
    description:
      "Vår AI-assistent hjälper dig att fylla i ansökningsformulären korrekt och fullständigt, vilket minimerar risken för avslag på grund av formella brister.",
  },
  {
    title: "Inlämning av ansökan",
    description:
      "Efter att alla dokument är samlade och formulär ifyllda, lämnas ansökan in till relevant myndighet eller organisation. Vi guidar dig till rätt instans.",
  },
  {
    title: "Uppföljning under handläggning",
    description:
      "Under handläggningstiden kan kompletteringar behövas. Vi hjälper dig att förstå vad som efterfrågas och hur du bäst bemöter detta.",
  },
  {
    title: "Beslut och eventuell överklagan",
    description:
      "När beslut är fattat hjälper vi dig att förstå beslutet. Om ansökan avslås hjälper vi dig att bedöma om en överklagan är lämplig och hur den i så fall ska utformas.",
  },
];

const documents = [
  {
    title: "Läkarintyg/Medicinskt utlåtande",
    description:
      "Ett aktuellt intyg som beskriver din funktionsnedsättning och dess påverkan på arbetsförmågan.",
  },
  {
    title: "Arbetsterapeututlåtande",
    description:
      "Bedömning från arbetsterapeut om vilka hjälpmedel som kan underlätta din arbetssituation.",
  },
  {
    title: "Arbetsgivarintyg",
    description: "Bekräftelse från arbetsgivare om anställning och beskrivning av arbetsuppgifter.",
  },
  {
    title: "Offert för hjälpmedel",
    description: "Prisförslag från leverantör av de hjälpmedel som ansökan gäller.",
  },
  {
    title: "Personbevis",
    description: "För att bekräfta din identitet och adress.",
  },
];

const statisticsData = [
  {
    factor: "Komplett dokumentation",
    impact: "+65% chans till godkännande",
    recommendation: "Använd vår checklista för att säkerställa att inget saknas",
  },
  {
    factor: "Specifika och detaljerade behov",
    impact: "+45% chans till godkännande",
    recommendation: "Låt vår AI hjälpa dig att formulera dina behov tydligt",
  },
  {
    factor: "Expertutlåtande",
    impact: "+55% chans till godkännande",
    recommendation: "Anlita en specialist via vårt nätverk",
  },
  {
    factor: "Tydlig koppling till arbetsförmåga",
    impact: "+70% chans till godkännande",
    recommendation: "Fokusera på hur hjälpmedlen förbättrar din arbetsprestation",
  },
];

const criticisms = [
  {
    criticism: "Kritik: 'Processen är onödigt byråkratisk och komplicerad'",
    description:
      "Många upplever att det krävs oproportionerligt mycket pappersarbete och dokumentation för att få tillgång till hjälpmedel som är nödvändiga för att kunna arbeta.",
    solution:
      "Vi har utvecklat vår AI-assistent specifikt för att hantera den byråkratiska komplexiteten. Den guidar dig genom varje steg, förklarar facktermer och hjälper dig att sammanställa all nödvändig dokumentation på ett effektivt sätt. Vår tjänst fungerar som en tolk mellan dig och det byråkratiska systemet.",
  },
  {
    criticism: "Kritik: 'Handläggningstiden är för lång'",
    description:
      "Många ansökningar tar flera månader att behandla, vilket kan leda till försämrad arbetssituation och ekonomiska svårigheter under väntetiden.",
    solution:
      "Medan vi inte kan påskynda själva myndigheternas handläggning, hjälper vår tjänst dig att lämna in en komplett ansökan från början, vilket minskar risken för kompletteringskrav som förlänger processen. Vi erbjuder också råd om temporära lösningar under väntetiden och i vissa fall information om akuta stödåtgärder.",
  },
  {
    criticism: "Kritik: 'Svårt att veta vilka hjälpmedel man har rätt till'",
    description:
      "Många är osäkra på vilka hjälpmedel som kan beviljas och vilka kriterier som gäller, vilket leder till antingen under- eller överansökan.",
    solution:
      "Vår databas innehåller information om alla typer av hjälpmedel som kan beviljas och vilka kriterier som gäller för respektive hjälpmedel. Vår AI använder denna information för att ge personliga rekommendationer baserat på din specifika situation och funktionsnedsättning.",
  },
];

const testimonials = [
  {
    text: "Jag hade försökt att ansöka om specialstol och ergonomiskt tangentbord på egen hand två gånger, men fått avslag båda gångerna. Med hjälp av Ansökshjälpen fick jag en tydlig förståelse för vad som saknades i min tidigare ansökan. Tredje gången fick jag beviljat alla hjälpmedel jag behövde och kan nu arbeta utan konstant smärta.",
    author: "Maria L., ekonomiassistent",
  },
  {
    text: "Det som imponerade mest var hur AI-assistenten kunde förklara komplicerade regler och krav på ett sätt som jag faktiskt förstod. Den hjälpte mig även att formulera mina behov på ett sätt som verkligen visade hur hjälpmedlen skulle förbättra min arbetsförmåga. Utan denna hjälp tror jag aldrig att jag hade fått min ansökan godkänd.",
    author: "Johan P., programmerare",
  },
  {
    text: "Som egenföretagare var min situation extra komplicerad. Ansökshjälpen guidade mig genom specialreglerna för företagare och hjälpte mig att samla in rätt ekonomisk dokumentation. Hela processen tog bara hälften så lång tid som jag hade förväntat mig.",
    author: "Emma S., grafisk designer",
  },
];

const faqs = [
  {
    question: "Kostar det något att använda Ansökshjälpen?",
    answer:
      "Basversionen av vår tjänst är kostnadsfri för alla användare. Vi erbjuder även en premiumversion med utökad personlig rådgivning och prioriterad support för 295 kr per månad. Du kan använda tjänsten så länge du behöver och avsluta när din ansökan är klar.",
  },
  {
    question: "Hur lång tid tar hela ansökningsprocessen i genomsnitt?",
    answer:
      "Den totala tiden varierar beroende på komplexiteten i ditt ärende och vilken myndighet som handlägger ansökan. Med vår tjänst kan du räkna med att själva ansökningsförfarandet (insamling av dokument och ifyllande av formulär) tar ca 2-3 veckor. Handläggningstiden hos myndigheten är vanligtvis 6-12 veckor, men kan vara både kortare och längre.",
  },
  {
    question: "Vad händer om min ansökan avslås trots hjälp från er tjänst?",
    answer:
      "Om din ansökan avslås erbjuder vi en grundlig analys av avslagsbeslutet och hjälper dig att utforma en överklagan om det finns grund för detta. Vår statistik visar att cirka 40% av överklaganden som förbereds med vår hjälp leder till ett ändrat beslut.",
  },
  {
    question: "Kan arbetsgivaren använda er tjänst för att ansöka om hjälpmedel till anställda?",
    answer:
      "Ja, arbetsgivare kan använda vår tjänst för att hantera ansökningar för sina anställda. Vi erbjuder särskilda företagsabonnemang för organisationer som vill underlätta processen för flera anställda. Kontakta vår företagsavdelning för mer information.",
  },
  {
    question: "Vilken typ av personlig information behöver jag dela med er tjänst?",
    answer:
      "För att kunna ge relevant vägledning behöver vi information om din funktionsnedsättning, arbetsuppgifter och vilka behov du har. All information hanteras i enlighet med GDPR och vi använder avancerad kryptering för att säkerställa att dina uppgifter är skyddade. Du kan när som helst begära att få dina uppgifter raderade.",
  },
];
