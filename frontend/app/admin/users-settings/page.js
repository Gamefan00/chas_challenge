"use client";
import Header from "@/components/adminpage/Header";
import InfoSettingsTabs from "@/components/admininfo/InfoSettingsTabs";

const informationSettings = () => {
  return (
    <div className="min-h-screen">
      <main className="p-6">
        <Header title={"Informations sida inställningar"} />
        <nav>
          <InfoSettingsTabs />
        </nav>
      </main>
    </div>
  );
};

export default informationSettings;
