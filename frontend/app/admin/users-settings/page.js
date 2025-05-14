"use client";
import Header from "@/components/shared/Header";
import Tabs from "@/components/shared/TabsComponent";
import InfoStepsSettings from "@/components/admininfo/InfoStepsSettings";

import NecessaryDocumentation from "@/components/admininfo/necessaryDocumentation";
import FAQ from "@/components/admininfo/FAQSettings";
import InfoGeneralSettings from "@/components/admininfo/InfoGeneralSettings";

const informationSettings = () => {
  const tabs = [
    {
      value: "general",
      label: "Allmänna inställningar & Ansökningsprocess",
      content: <InfoGeneralSettings />,
    },
    {
      value: "steps",
      label: "Steg-för-steg",
      content: <InfoStepsSettings />,
    },
    {
      value: "questions",
      label: "Nödvändig dokumentation",
      content: <NecessaryDocumentation />,
    },
    {
      value: "responses",
      label: "Vanliga frågor",
      content: <FAQ />,
    },
  ];

  return (
    <div className="min-h-screen">
      <main className="mt-6 p-6">
        <Header title={"Informations sida inställningar"} />
        <nav>
          <Tabs defaultValue="general" tabs={tabs} />
        </nav>
      </main>
    </div>
  );
};

export default informationSettings;
