import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ y: 0, opacity: 100 }}
      transition={{ duration: 0.5 }}
      className="mb-8 w-full"
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
                Omfattande guide till ansökningsprocessen
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
              Här hittar du detaljerad information om hur du ansöker om arbetshjälpmedel, vilka
              utmaningar du kan möta, och hur våra experter kan hjälpa dig genom hela processen.
            </motion.p>
          </CardContent>
          <CardFooter className="flex justify-center pt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ y: 0, opacity: 100 }}
              transition={{ duration: 0.9 }}
            >
              <Button className="cursor-pointer">Starta din ansökan</Button>
            </motion.div>
          </CardFooter>
        </div>
      </Card>
    </motion.section>
  );
};

export default HeroSection;
