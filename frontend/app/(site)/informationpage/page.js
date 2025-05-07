"use client";

import * as React from "react";

// Import Shadcn UI components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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

export default function InformationPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <h1>Omfattande guide till ansökningsprocessen</h1>
            <CardDescription className="text-foreground mx-auto max-w-3xl">
              Här hittar du detaljerad information om hur du ansöker om arbetshjälpmedel, vilka
              utmaningar du kan möta, och hur våra experter kan hjälpa dig genom hela processen.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button size="lg">
              <Link href="/applicationChat">Starta din ansökan</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* About Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="border-b pb-2">Om ansökningsprocessen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="font-medium">
                Att ansöka om arbetshjälpmedel kan vara en komplicerad process med många steg och
                krav som måste uppfyllas. Vår tjänst har utvecklats för att förenkla denna process
                och hjälpa dig att maximera dina chanser att få det stöd du behöver. Vi har samlat
                all relevant information på ett ställe och erbjuder personlig vägledning från
                experter inom området.
              </p>

              <div>
                <h3 className="mb-3 border-b pb-2 font-semibold">Vem kan ansöka?</h3>
                <p className="mb-3 font-semibold">Du kan ansöka om arbetshjälpmedel om du:</p>
                <ul className="ml-6 list-disc space-y-4">
                  <li>Har en dokumenterad funktionsnedsättning eller arbetsskada</li>
                  <li>Är anställd eller egenföretagare</li>
                  <li>Behöver hjälpmedel för att kunna utföra ditt arbete</li>
                  <li>Är mellan 18 och 67 år</li>
                </ul>
                {/* <p className="mt-3">
                  I vissa fall kan även arbetssökande få stöd för arbetshjälpmedel, särskilt om det
                  underlättar processen att få ett arbete.
                </p> */}
              </div>

              <div>
                <h3 className="mb-3 border-b pb-2 font-semibold">Vilka typer av stöd finns?</h3>
                {/* <p className="mb-3 font-semibold">
                  Det finns flera olika former av stöd som kan sökas:
                </p> */}
                <ul className="ml-6 list-disc space-y-4">
                  <li>
                    <strong>Fysiska hjälpmedel:</strong> Specialanpassade möbler, verktyg och
                    utrustning
                  </li>
                  <li>
                    <strong>Digitala hjälpmedel:</strong> Programvara, datorutrustning, skärmläsare
                    etc.
                  </li>
                  <li>
                    <strong>Personligt stöd:</strong> Arbetsbiträde eller personlig assistent
                  </li>
                  <li>
                    <strong>Anpassningar på arbetsplatsen:</strong> Strukturella förändringar för
                    att förbättra tillgänglighet
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step by Step Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="border-b pb-2">Steg-för-steg ansökningsguide</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 font-semibold">
              Här är en detaljerad beskrivning av ansökningsprocessen från start till slut:
            </p>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="rounded-md border-b p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <Badge
                      variant="outline"
                      className="bg-primary text-primary-foreground flex h-8 w-8 rounded-full"
                    >
                      {index + 1}
                    </Badge>
                    <div>
                      <h3 className="font-extrabold">{step.title}</h3>
                      <p className="text-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documentation Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nödvändig dokumentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-start rounded-md border-b p-3">
                  <div className="mr-4">📄</div>
                  <div>
                    <h3 className="font-semibold">{doc.title}</h3>
                    <p className="text-foreground mt-1">{doc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vanliga frågor</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-foreground pt-2">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="">
          <CardHeader>
            <CardTitle className="text-foreground text-center">Redo att komma igång?</CardTitle>
            <CardDescription className="text-foreground text-center">
              Låt oss hjälpa dig att förenkla ansökningsprocessen och maximera dina chanser till
              godkännande.
            </CardDescription>
          </CardHeader>
          <CardFooter className="text-primary-foreground flex justify-center">
            <Button size="lg">
              <Link href="applicationChat">Starta din ansökan nu</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
