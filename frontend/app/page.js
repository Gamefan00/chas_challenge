"use client";
import HeroSection from "./components/homepage/HeroSection";
import FeatureCard from "./components/homepage/FeatureCard";
import HowItWorks from "./components/homepage/HowItWorks";
import FAQ from "./components/homepage/FAQ";
import Footer from "./components/homepage/Footer";

const page = () => {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center">
      <HeroSection />
      <FeatureCard />
      <HowItWorks />
      <FAQ />
      <Footer />
    </div>
  );
};

export default page;
