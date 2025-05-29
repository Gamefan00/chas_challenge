"use client";

import React from "react";
import Hero from "@/components/shared/Hero";
import AboutSection from "@/components/informationpage/AboutSection";
import StepsSection from "@/components/informationpage/StepsSection";
import DocumentationSection from "@/components/informationpage/DocumentationSection";
import FAQSection from "@/components/informationpage/FAQSection";

export default function InformationPage() {
  return (
    <div className="bg-background min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Hero
          title="Omfattande guide till ansökningsprocessen"
          description="Här hittar du detaljerad information om hur du ansöker om arbetshjälpmedel, vilka utmaningar du kan möta, och hur våra experter kan hjälpa dig genom hela processen."
          buttonText="Starta formulärguide"
          buttonLink="/applicationChat"
          className="mb-8 w-full"
        />
        <AboutSection />
        <StepsSection />
        <DocumentationSection />
        <FAQSection />
      </main>
    </div>
  );
}
