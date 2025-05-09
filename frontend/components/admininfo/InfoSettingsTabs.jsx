import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BehaviorSettings from "./BehaviorSettings";
import QuestionsSettings from "./QuestionsSettings";
import ResponsesSettings from "./ResponsesSettings";
import GeneralSettings from "./GeneralSettings";

export default function InfoSettingsTabs() {
  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList className="grid max-w-4xl grid-cols-4">
        <TabsTrigger value="general">Allmänna inställningar</TabsTrigger>
        <TabsTrigger value="steg-för-steg">Steg-för-steg</TabsTrigger>
        <TabsTrigger value="questions">Frågor</TabsTrigger>
        <TabsTrigger value="responses">Svar och feedback</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="mt-6">
        <GeneralSettings />
      </TabsContent>
      <TabsContent value="steg-för-steg" className="mt-6">
        <BehaviorSettings />
      </TabsContent>
      <TabsContent value="questions" className="mt-6">
        <QuestionsSettings />
      </TabsContent>
      <TabsContent value="responses" className="mt-6">
        <ResponsesSettings />
      </TabsContent>
    </Tabs>
  );
}
