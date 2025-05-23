import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsComponent({
  defaultValue,
  className = "space-y-4",
  tabsListClassName = "grid max-w-4xl md:grid-cols-2 gap-4",
  tabsContentClassName = "mt-6",
  tabs = [],
}) {
  return (
    <Tabs defaultValue={defaultValue} className={className}>
      <TabsList className={tabsListClassName}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className={tabsContentClassName}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
