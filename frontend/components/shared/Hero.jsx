import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

const BaseHeroSection = ({ title, description, buttonText, buttonLink, className = "w-full" }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ y: 0, opacity: 100 }}
      transition={{ duration: 0.5 }}
      className={className}
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
                {title}
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
              {description}
            </motion.p>
          </CardContent>
          <CardFooter className="flex justify-center pt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ y: 0, opacity: 100 }}
              transition={{ duration: 0.9 }}
            >
              <Button asChild>
                <Link href={buttonLink}>{buttonText}</Link>
              </Button>
            </motion.div>
          </CardFooter>
        </div>
      </Card>
    </motion.section>
  );
};

export default BaseHeroSection;
