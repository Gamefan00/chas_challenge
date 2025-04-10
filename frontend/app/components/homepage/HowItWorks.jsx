import React from "react";

const HowItWorks = () => {
  // Initialize steps data
  const steps = [
    {
      id: 1,
      title: "Beskriv din situation",
      description:
        "Berätta om din funktionsnedsättning och dina behov på arbetsplatsen i en enkel konversation.",
    },
    {
      id: 2,
      title: "Få personlig vägledning",
      description:
        "Vår AI analyserar dina uppgifter och ger skräddarsydd hjälp för just dina behov.",
    },
    {
      id: 3,
      title: "Skapa din ansökan",
      description:
        "Få förslag på formuleringar som matchar Försäkringskassans krav och riktlinjer.",
    },
    {
      id: 4,
      title: "Ladda ner & använd",
      description:
        "Spara dina dokument och förbered dig för nästa steg i processen med våra stöddokument.",
    },
  ];

  return (
    <div className="card bg-base-100 w-full p-8 shadow-sm">
      <div className="card-body relative gap-8">
        <h2 className="card-title mx-auto">Så fungerar det</h2>
        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <StepSection
              key={step.id}
              number={step.id}
              title={step.title}
              description={step.description}
            />
          ))}
          {/* Vertical bar */}
          <div className="bg-accent absolute top-[110px] left-0 hidden h-[2px] w-full lg:block"></div>
        </div>
        {/* Call to action */}
        <div class="card-actions justify-center">
          <button class="btn btn-primary">Starta din ansökan</button>
        </div>
      </div>
    </div>
  );
};

export function StepSection({ number, title, description }) {
  return (
    <div className="mx-auto flex max-w-64 flex-col items-center gap-4 text-center">
      <div className="bg-primary text-background z-10 flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold">
        {number}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default HowItWorks;
