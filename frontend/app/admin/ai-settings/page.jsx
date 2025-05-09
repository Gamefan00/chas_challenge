"use client";
import Header from "@/components/adminpage/Header";
import Tabs from "@/components/shared/TabsComponent";
import BehaviorSettings from "@/components/adminpage/BehaviorSettings";
import QuestionsSettings from "@/components/adminpage/QuestionsSettings";
import ResponsesSettings from "@/components/adminpage/ResponsesSettings";
import GeneralSettings from "@/components/adminpage/GeneralSettings";

const aiSettings = () => {
  const tabs = [
    {
      value: "general",
      label: "Allmänna inställningar",
      content: <GeneralSettings />,
    },
    {
      value: "behavior",
      label: "Beteende",
      content: <BehaviorSettings />,
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
        <Header title={"AI-Bot Inställningar"} />
        <nav>
          <Tabs defaultValue="general" tabs={tabs} />
        </nav>
      </main>
    </div>
  );
};

export default aiSettings;
