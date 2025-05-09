"use client";
import Header from "@/components/adminpage/Header";
import Tabs from "@/components/shared/TabsComponent";
import StepsSettings from "@/components/admininfo/StepsSettings";


import QuestionsSettings from "@/components/adminpage/QuestionsSettings";
import ResponsesSettings from "@/components/adminpage/ResponsesSettings";
import GeneralSettings from "@/components/adminpage/GeneralSettings";

const informationSettings = () => {
  const tabs = [
    {
      value: "general",
      label: "Allmänna inställningar",
      content: <GeneralSettings />,
    },
    {
      value: "steps",
      label: "Steg-för-steg",
      content: <StepsSettings />,
    },
    {
      value: "questions",
      label: "Frågor",
      content: <QuestionsSettings />,
    },
    {
      value: "responses",
      label: "Svar och feedback",
      content: <ResponsesSettings />,
    },
  ];

  return (
    <div className="min-h-screen">
      <main className="p-6">
        <Header title={"Informations sida inställningar"} />
        <nav>
          <Tabs defaultValue="general" tabs={tabs} />
        </nav>
      </main>
    </div>
  );
};

export default informationSettings;
