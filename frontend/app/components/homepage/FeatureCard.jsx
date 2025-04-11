import React from "react";
import { FileText, MessageSquareText, PenLine } from "lucide-react";
import Link from "next/link";

const icons = {
  FileText: FileText,
  MessageSquareText: MessageSquareText,
  PenLine: PenLine,
};

const FeatureCard = () => {
  // Data for each feature card
  const features = [
    {
      icon: "FileText",
      title: "Fylla i formulär",
      description:
        "Få hjälp med att välja rätt fomulär och formulera dina svar på ett sätt som ökar dina chanser att få rätt stöd.",
      buttonText: "Starta formulärguide",
      link: "/",
    },
    {
      icon: "MessageSquareText",
      title: "Förbered utredningssamtal",
      description:
        "Simulera ett utredningssamtal med vår AI och lär dig svara på handläggarens frågor på ett tydligt och effektivt sätt.",
      buttonText: "Förbered samtal",
      link: "/",
    },
    {
      icon: "PenLine",
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
        {features.map((feature, index) => {
          // Conditional rendering for icons
          const IconComponent = icons[feature.icon];
          return (
            // Each feature card
            <div key={index} className="card bg-base-100 w-full shadow-md md:h-96">
              <div className="card-body flex justify-between">
                {/* Card Icon */}
                <div className="mb-7">
                  {IconComponent && (
                    <IconComponent
                      className={`text-primary bg-accent flex items-center justify-center rounded-lg p-3`}
                      size={56}
                    />
                  )}
                </div>

                {/* Main Content */}
                <div className="flex flex-col gap-2">
                  <h3 className="card-title">{feature.title}</h3>
                  <p className="leading-relaxed">{feature.description}</p>
                </div>

                {/* Button with conditional styling for the last card*/}
                <Link
                  href={feature.link}
                  className={`${
                    index === features.length - 1
                      ? "btn bg-base-100 text-primary p-2 shadow-md"
                      : "btn btn-primary p-2 shadow-md"
                  }`}
                >
                  {feature.buttonText}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureCard;
