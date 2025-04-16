import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ y: 0, opacity: 100 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card>
        <div className="mx-auto max-w-lg py-8">
          <CardHeader>
            <CardTitle className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ y: 0, opacity: 100 }}
                transition={{ duration: 0.5 }}
              >
                {" "}
                Förenkla din väg till arbetshjälpmedel
              </motion.h1>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ y: 0, opacity: 100 }}
              transition={{ duration: 0.6 }}
              className="mx-auto py-2 text-center"
            >
              Låt vår AI-assistent guida dig genom ansökningsprocessen och maximera dina chanser att
              få rätt stöd för dina behov.
            </motion.p>
          </CardContent>
          <CardFooter className="flex justify-center pt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ y: 0, opacity: 100 }}
              transition={{ duration: 0.9 }}
            >
              <Button className="cursor-pointer">Kom igång nu!</Button>
            </motion.div>
          </CardFooter>
        </div>
      </Card>
    </motion.section>
  );
};

export default HeroSection;
