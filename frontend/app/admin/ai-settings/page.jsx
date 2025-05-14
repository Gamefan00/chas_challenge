"use client";
import Header from "@/components/shared/Header";
import Tabs from "@/components/shared/TabsComponent";
import BehaviorSettings from "@/components/adminpage/BehaviorSettings";
import QuestionsSettings from "@/components/adminpage/QuestionsSettings";
import ResponsesSettings from "@/components/adminpage/ResponsesSettings";
import ConfigSettings from "@/components/adminpage/ConfigSettings";

const aiSettings = () => {
  const tabs = [
    {
      value: "configuration",
      label: "Konfiguration",
      content: <ConfigSettings />,
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
      <main className="mt-6 p-6">
        <Header title={"AI-Bot Inställningar"} />
        <nav>
          <Tabs defaultValue="configuration" tabs={tabs} />
        </nav>
      </main>
    </div>
  );
};

export default aiSettings;
