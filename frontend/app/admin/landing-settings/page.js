"use client";
import Header from "@/components/shared/Header";
import Tabs from "@/components/shared/TabsComponent";

import FAQSettings from "@/components/admin/LandingPage/FAQSettings";
import HeroSettings from "@/components/admin/LandingPage/HeroSettings";
import HowItWorksSettings from "@/components/admin/LandingPage/HowItWorksSettings";
import FeatureCardSettings from "@/components/admin/LandingPage/FeatureCardSettings";

const landingSettings = () => {
  const tabs = [
    {
      value: "general",
      label: "Hero text",
      content: <HeroSettings />,
    },
    {
      value: "steps",
      label: "Hur det fungerar",
      content: <HowItWorksSettings />,
    },
    {
      value: "featurecards",
      label: "Kort på framsidan",
      content: <FeatureCardSettings />,
    },
    {
      value: "questions",
      label: "Vanliga frågor",
      content: <FAQSettings />,
    },
  ];

  return (
    <div className="min-h-screen">
      <main className="mt-6 p-6">
        <Header title={"Landningssida inställningar"} />
        <nav>
          <Tabs defaultValue="general" tabs={tabs} />
        </nav>
      </main>
    </div>
  );
};

export default landingSettings;
