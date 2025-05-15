"use client";
import Header from "@/components/shared/Header";
import Tabs from "@/components/shared/TabsComponent";
import InfoStepsSettings from "@/components/admin/ResourcePage/StepsSettings";
import NecessaryDocSettings from "@/components/admin/ResourcePage/NecessaryDocSettings";
import FAQSettings from "@/components/admin/ResourcePage/FAQSettings";
import InfoGeneralSettings from "@/components/admin/ResourcePage/HeroSettings";

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
      content: <NecessaryDocSettings />,
    },
    {
      value: "responses",
      label: "Vanliga frågor",
      content: <FAQSettings />,
    },
  ];

  return (
    <div className="min-h-screen">
      <main className="mt-6 p-6">
        <Header title={"Resurs inställningar"} />
        <nav>
          <Tabs defaultValue="general" tabs={tabs} />
        </nav>
      </main>
    </div>
  );
};

export default informationSettings;
