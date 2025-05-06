"use client";
import Header from "@/components/adminpage/Header";
import AiSettingsTabs from "@/components/adminpage/AiSettingsTabs";

const aiSettings = () => {
  return (
    <div className="min-h-screen">
      <main className="p-6">
        <Header title={"AI-Bot Inställningar"} />
        <nav>
          <AiSettingsTabs />
        </nav>
      </main>
    </div>
  );
};

export default aiSettings;
