import React from "react";
import { delay, motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

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
    description: "Vår AI analyserar dina uppgifter och ger skräddarsydd hjälp för just dina behov.",
  },
  {
    id: 3,
    title: "Skapa din ansökan",
    description: "Få förslag på formuleringar som matchar Försäkringskassans krav och riktlinjer.",
  },
  {
    id: 4,
    title: "Ladda ner & använd",
    description:
      "Spara dina dokument och förbered dig för nästa steg i processen med våra stöddokument.",
  },
];

const HowItWorks = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.3,
      },
    },
  };

  const itemsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="w-full">
      <Card>
        <motion.div
          className="w-full py-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CardHeader className="relative gap-8">
            <CardTitle className="mx-auto">
              <h2>Så fungerar det</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-12">
              {/* horizontal line */}
              <div className="bg-primary/20 absolute top-7 left-0 z-0 hidden h-0.5 w-full lg:block"></div>
              <motion.div
                className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:justify-between lg:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {steps.map((step) => (
                  <StepSection
                    key={step.id}
                    number={step.id}
                    title={step.title}
                    description={step.description}
                  />
                ))}
              </motion.div>
            </div>
          </CardContent>
          {/* Call to action */}
          <motion.div
            className="flex w-full justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <CardFooter>
              <Button asChild>
                <Link href={"/chatbot1"}>Starta din ansökan</Link>
              </Button>
            </CardFooter>
          </motion.div>
        </motion.div>
      </Card>
    </section>
  );
};

const StepSection = ({ number, title, description }) => {
  const circleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: number * 0.15,
        ease: "easeOut",
      },
    },
  };
  const textVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: number * 0.15 + 0.2,
        ease: "easeOut",
      },
    },
  };
  return (
    <div className="z-10 mx-auto flex max-w-sm flex-col items-center gap-4 text-center">
      <motion.div
        className="bg-primary text-primary-foreground z-10 flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold shadow-md"
        variants={circleVariants}
      >
        {number}
      </motion.div>
      <motion.div variants={textVariants}>
        <h4 className="px-2 font-semibold text-nowrap">{title}</h4>
        <p className="px-2 text-sm">{description}</p>
      </motion.div>
    </div>
  );
};

export default HowItWorks;
