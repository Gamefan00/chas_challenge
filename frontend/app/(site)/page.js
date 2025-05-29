"use client";
import Hero from "../../components/shared/Hero";
import FeatureCard from "../../components/homepage/FeatureCard";
import HowItWorks from "../../components/homepage/HowItWorks";
import FAQ from "../../components/homepage/FAQ";

const page = () => {
  return (
    <>
      <div className="bg-background flex w-full flex-col py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 md:mb-20 md:gap-20">
          <Hero
            title="Förenkla din väg till arbetshjälpmedel"
            description="Låt vår AI-assistent guida dig genom ansökningsprocessen och maximera dina chanser att få rätt stöd för dina behov."
            buttonText="Starta formulärguide"
            buttonLink="/applicationChat"
          />
          <FeatureCard />
          <HowItWorks />
          <FAQ />
        </div>
      </div>
    </>
  );
};

export default page;
