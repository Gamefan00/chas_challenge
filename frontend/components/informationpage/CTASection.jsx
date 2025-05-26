import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="border-b-primary mt-8 mb-8 overflow-hidden border-b-4">
        <CardHeader>
          <CardTitle className="text-foreground text-center">Redo att komma igång?</CardTitle>
          <CardDescription className="text-foreground text-center">
            Låt oss hjälpa dig att förenkla ansökningsprocessen och maximera dina chanser till
            godkännande.
          </CardDescription>
        </CardHeader>
        <CardFooter className="text-primary-foreground flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg">
              <Link href="/applicationChat">Starta formulärguide nu</Link>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
