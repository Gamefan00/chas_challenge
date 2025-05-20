"use client";

import React from "react";
import HeroSection from "@/components/informationpage/HeroSection";
import AboutSection from "@/components/informationpage/AboutSection";
import StepsSection from "@/components/informationpage/StepsSection";
import DocumentationSection from "@/components/informationpage/DocumentationSection";
import FAQSection from "@/components/informationpage/FAQSection";
import CTASection from "@/components/informationpage/CTASection";

export default function InformationPage() {
  return (
    <div className="bg-background min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <HeroSection />
        <AboutSection />
        <StepsSection />
        <DocumentationSection />
        <FAQSection />
        <CTASection />
      </main>
    </div>
  );
}
