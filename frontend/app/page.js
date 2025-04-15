"use client";
import HeroSection from "../components/homepage/HeroSection";
import FeatureCard from "../components/homepage/FeatureCard";
import HowItWorks from "../components/homepage/HowItWorks";
import FAQ from "../components/homepage/FAQ";

const page = () => {
  return (
    <div className="bg-background flex w-full flex-col px-4 py-12 md:pb-20">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center gap-12 md:gap-20">
        <HeroSection />
        <FeatureCard />
        <HowItWorks />
        <FAQ />
      </div>
    </div>
  );
};

export default page;
