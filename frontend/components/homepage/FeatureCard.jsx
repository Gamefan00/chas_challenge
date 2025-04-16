import React from "react";
import { FileText, MessageSquareText, PenLine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

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
        "Få hjälp med att välja rätt formulär och formulera dina svar på ett sätt som ökar dina chanser att få rätt stöd.",
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
    <section className="w-full">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="mb-15 flex justify-center">Hur kan vi hjälpa dig?</h2>
      </motion.div>
      {/* Grid layout for feature cards */}
      <motion.div
        className="grid grid-cols-1 gap-8 md:grid-cols-3"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {features.map((feature, index) => {
          // Conditional rendering for icons
          const IconComponent = icons[feature.icon];
          return (
            // Each feature card
            <Card key={index} className="flex w-full gap-12 shadow-md">
              {/* Card Icon */}
              <CardHeader className="">
                {IconComponent && (
                  <IconComponent
                    className={`text-primary bg-accent flex items-center justify-center rounded-lg p-3`}
                    size={56}
                  />
                )}
              </CardHeader>

              {/* Main Content */}
              <div className="flex h-full flex-col gap-5">
                <CardContent className="flex flex-col gap-2">
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    <p>{feature.description}</p>
                  </CardDescription>
                </CardContent>

                {/* Button with conditional styling for the last card*/}
                <CardFooter className="mt-auto">
                  <Button href={feature.link}>{feature.buttonText}</Button>
                </CardFooter>
              </div>
            </Card>
          );
        })}
      </motion.div>
    </section>
  );
};

export default FeatureCard;
