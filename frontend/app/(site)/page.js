"use client";
import HeroSection from "../../components/homepage/HeroSection";
import FeatureCard from "../../components/homepage/FeatureCard";
import HowItWorks from "../../components/homepage/HowItWorks";
import FAQ from "../../components/homepage/FAQ";
// import Footer from "@/components/shared/Footer";

const page = () => {
  return (
    <>
      <div className="bg-background flex w-full flex-col py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 md:mb-20 md:gap-20">
          <HeroSection />
          <FeatureCard />
          <HowItWorks />
          <FAQ />
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default page;
