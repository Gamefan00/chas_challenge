"use client";
import Header from "@/components/shared/Header";
import Tabs from "@/components/shared/TabsComponent";
import BehaviorSettings from "@/components/admin/BehaviorSettings";
import ConfigSettings from "@/components/admin/AiConfigSettings";

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
