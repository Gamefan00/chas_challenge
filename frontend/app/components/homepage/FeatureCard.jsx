import React from "react";

const FeatureCard = () => {
  // Data for each feature card
  const features = [
    {
      icon: "Dokument ikon här",
      title: "Fylla i formulär",
      description:
        "Få hjälp med att välja rätt fomulär och formulera dina svar på ett sätt som ökar dina chanser att få rätt stöd.",
      buttonText: "Starta formulärguide",
      link: "/",
    },
    {
      icon: "Pratbubbla ikon här",
      title: "Förbered utredningssamtal",
      description:
        "Simulera ett utredningssamtal med vår AI och lär dig svara på handläggarens frågor på ett tydligt och effektivt sätt.",
      buttonText: "Förbered samtal",
      link: "/",
    },
    {
      icon: "Penna ikon här",
      title: "Lär dig mer",
      description:
        "Förstår dina rättigheter och skyldigheter kring arbetshjälpmedel genom att läsa guider, artiklar och expertråd.",
      buttonText: "Utforska resurser",
      link: "/",
    },
  ];

  return (
    <section>
      {/* Section Title */}
      <h2 className="mb-15 flex justify-center">Hur kan vi hjälpa dig?</h2>
      {/* Grid layout for feature cards */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          // Each feature card
          <div key={index} className="card bg-base-100 h-96 w-full shadow-md">
            <div className="card-body flex justify-between">
              {/* Card Icon */}
              <div className="mb-13">{feature.icon}</div>

              {/* Main Content */}
              <div className="flex flex-col gap-2">
                <h3 className="card-title mb-2">{feature.title}</h3>
                <p className="leading-relaxed">{feature.description}</p>
              </div>

              {/* Button with conditional styling for the last card*/}
              <button
                className={`${
                  index === features.length - 1
                    ? "btn btn-accent bg-accent p-2 shadow-md"
                    : "btn btn-primary p-2 shadow-md"
                }`}
              >
                <a href={feature.link}>{feature.buttonText}</a>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCard;
