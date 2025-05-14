"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertCircle, Loader2, Settings, ListChecks } from "lucide-react";
import SaveBtn from "@/components/adminpage/SaveBtn";
import { StatusMessage } from "@/components/adminpage/StatusMessage";

export default function BehaviorSettings() {
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [openSections, setOpenSections] = useState(["system-instructions"]);
  const [activeBot, setActiveBot] = useState("application");

  // Application bot settings
  const [applicationSystemMessage, setApplicationSystemMessage] = useState("");
  const [applicationStepMessages, setApplicationStepMessages] = useState({
    "step-1": { welcome: "", description: "" },
    "step-2": { welcome: "", description: "" },
    "step-3": { welcome: "", description: "" },
    "step-4": { welcome: "", description: "" },
    "step-5": { welcome: "", description: "" },
    "step-6": { welcome: "", description: "" },
  });

  // Interview bot settings
  const [interviewSystemMessage, setInterviewSystemMessage] = useState("");
  const [interviewStepMessages, setInterviewStepMessages] = useState({
    "step-1": { heading: "", label: "" },
    "step-2": { heading: "", label: "" },
    "step-3": { heading: "", label: "" },
    "step-4": { heading: "", label: "" },
    "step-5": { heading: "", label: "" },
    "step-6": { heading: "", label: "" },
    "step-7": { heading: "", label: "" },
    "step-8": { heading: "", label: "" },
    "step-9": { heading: "", label: "" },
    "step-10": { heading: "", label: "" },
    "step-11": { heading: "", label: "" },
    "step-12": { heading: "", label: "" },
    "step-13": { heading: "", label: "" },
    "step-14": { heading: "", label: "" },
    "step-15": { heading: "", label: "" },
  });

  // Load settings from database on component mount
  useEffect(() => {
    async function loadSettings() {
      try {
        setError(null);
        // Load Application Bot Settings
        const appSystemResponse = await fetch("/admin/settings/application_system_message", {
          credentials: "include",
        });

        if (appSystemResponse.ok) {
          const data = await appSystemResponse.json();
          setApplicationSystemMessage(data.value || "");
        }

        const appStepsResponse = await fetch("/admin/settings/application_steps", {
          credentials: "include",
        });

        if (appStepsResponse.ok) {
          const data = await appStepsResponse.json();
          const steps = data.value || {};

          // Initialize with data from database or empty values
          const formattedSteps = {
            "step-1": {
              welcome: steps["step-1"]?.welcome_message || "",
              description: steps["step-1"]?.description || "",
            },
            "step-2": {
              welcome: steps["step-2"]?.welcome_message || "",
              description: steps["step-2"]?.description || "",
            },
            "step-3": {
              welcome: steps["step-3"]?.welcome_message || "",
              description: steps["step-3"]?.description || "",
            },
            "step-4": {
              welcome: steps["step-4"]?.welcome_message || "",
              description: steps["step-4"]?.description || "",
            },
            "step-5": {
              welcome: steps["step-5"]?.welcome_message || "",
              description: steps["step-5"]?.description || "",
            },
            "step-6": {
              welcome: steps["step-6"]?.welcome_message || "",
              description: steps["step-6"]?.description || "",
            },
          };

          setApplicationStepMessages(formattedSteps);
        }

        // Load Interview Bot Settings
        const interviewSystemResponse = await fetch("/admin/settings/interview_system_message", {
          credentials: "include",
        });

        if (interviewSystemResponse.ok) {
          const data = await interviewSystemResponse.json();
          setInterviewSystemMessage(data.value || "");
        }

        const interviewStepsResponse = await fetch("/admin/settings/interview_steps", {
          credentials: "include",
        });

        if (interviewStepsResponse.ok) {
          const data = await interviewStepsResponse.json();
          const steps = data.value || {};

          // Create formatted steps from database or use defaults
          const formattedSteps = {};

          // Loop through steps 1-15
          for (let i = 1; i <= 15; i++) {
            const stepKey = `step-${i}`;
            formattedSteps[stepKey] = {
              label: steps[stepKey]?.label || "",
              heading: steps[stepKey]?.heading || "",
            };
          }

          setInterviewStepMessages(formattedSteps);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
        setError("Det gick inte att ladda inställningarna");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  // Save all settings
  const handleSave = async () => {
    try {
      setSaveStatus({ type: "loading", message: "Sparar..." });

      if (activeBot === "application") {
        // Save application bot settings
        await fetch("/admin/settings/application_system_message", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            value: applicationSystemMessage,
            category: "ai_config",
            description: "Systeminstruktioner för ansökningsboten",
          }),
        });

        // Save application step messages
        const formattedSteps = {};
        Object.entries(applicationStepMessages).forEach(([step, data]) => {
          formattedSteps[step] = {
            welcome_message: data.welcome,
            description: data.description,
          };
        });

        await fetch("/admin/settings/application_steps", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            value: formattedSteps,
            category: "application_config",
            description: "Steg i ansökningsprocessen med beskrivningar och välkomstmeddelanden",
          }),
        });
      } else {
        // Save interview bot settings
        await fetch("/admin/settings/interview_system_message", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            value: interviewSystemMessage,
            category: "ai_config",
            description: "Systeminstruktioner för intervjuboten",
          }),
        });

        // Save interview step messages
        await fetch("/admin/settings/interview_steps", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            value: interviewStepMessages,
            category: "interview_config",
            description: "Frågor för intervjuprocessen",
          }),
        });
      }

      setSaveStatus({ type: "success", message: "Inställningarna har sparats" });

      // Clear status after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setSaveStatus({ type: "error", message: "Det gick inte att spara inställningarna" });
    }
  };

  // Handle changes to application step welcome messages
  const handleAppWelcomeChange = (step, value) => {
    setApplicationStepMessages((prev) => ({
      ...prev,
      [step]: { ...prev[step], welcome: value },
    }));
  };

  // Handle changes to application step descriptions
  const handleAppDescriptionChange = (step, value) => {
    setApplicationStepMessages((prev) => ({
      ...prev,
      [step]: { ...prev[step], description: value },
    }));
  };

  // Handle changes to interview step headings
  const handleInterviewHeadingChange = (step, value) => {
    setInterviewStepMessages((prev) => ({
      ...prev,
      [step]: { ...prev[step], heading: value },
    }));
  };

  // Handle changes to interview step labels
  const handleInterviewLabelChange = (step, value) => {
    setInterviewStepMessages((prev) => ({
      ...prev,
      [step]: { ...prev[step], label: value },
    }));
  };

  // Get a human-friendly name for application steps
  const getAppStepName = (step) => {
    switch (step) {
      case "step-1":
        return "Steg 1: Välj ärendetyp";
      case "step-2":
        return "Steg 2: Funktionsnedsättning";
      case "step-3":
        return "Steg 3: Grundläggande behov";
      case "step-4":
        return "Steg 4: Andra behov";
      case "step-5":
        return "Steg 5: Nuvarande stöd";
      case "step-6":
        return "Steg 6: Granska och skicka";
      default:
        return step;
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex min-h-[300px] items-center justify-center pt-6">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p>Laddar inställningar...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card text-card-foreground w-full">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-foreground">AI-beteende</CardTitle>
          <CardDescription className="text-muted-foreground">
            Anpassa AI-assistentens instruktioner, välkomstmeddelanden och steg.
          </CardDescription>
        </div>
        <SaveBtn onClick={handleSave} status={saveStatus} />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status messages */}
        {error && (
          <div className="border-destructive bg-destructive/10 text-destructive flex items-center rounded-md border p-3">
            <AlertCircle className="mr-2 h-4 w-4" />
            {error}
          </div>
        )}

        <StatusMessage status={saveStatus} />

        {/* Bot Type Tabs */}
        <Tabs value={activeBot} onValueChange={setActiveBot} className="w-full">
          <TabsList className="bg-muted text-muted-foreground mb-4 w-full">
            <TabsTrigger
              value="application"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground flex-1"
            >
              Ansökningsbot
            </TabsTrigger>
            <TabsTrigger
              value="interview"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground flex-1"
            >
              Intervjubot
            </TabsTrigger>
          </TabsList>

          {/* Application Bot Settings */}
          <TabsContent value="application">
            <Accordion
              type="multiple"
              value={openSections}
              onValueChange={setOpenSections}
              className="w-full"
            >
              {/* System Instructions */}
              <AccordionItem value="app-system-instructions" className="border-border">
                <AccordionTrigger className="hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    <span>System Instruktioner - Ansökningsbot</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="app-system-message" className="text-foreground">
                      System Instruktioner
                    </Label>
                    <Textarea
                      id="app-system-message"
                      value={applicationSystemMessage}
                      onChange={(e) => setApplicationSystemMessage(e.target.value)}
                      rows={10}
                      className="bg-background border-input text-foreground font-mono text-sm"
                    />
                    <p className="text-muted-foreground text-xs">
                      Dessa instruktioner styr hur ansökningsboten beter sig och vilken information
                      den har tillgång till.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Application Steps */}
              <AccordionItem value="application-steps" className="border-border border-t">
                <AccordionTrigger className="hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-4">
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5" />
                    <span>Ansökningssteg</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 pb-2">
                  {/* Nested accordion for steps */}
                  <Accordion type="multiple" className="w-full border-0">
                    {Object.entries(applicationStepMessages).map(([step, data]) => (
                      <AccordionItem
                        key={step}
                        value={step}
                        className="border-border border-t border-b-0"
                      >
                        <AccordionTrigger className="hover:bg-accent hover:text-accent-foreground px-6 py-3">
                          {getAppStepName(step)}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pt-2 pb-4">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`${step}-welcome`} className="text-foreground">
                                Välkomstmeddelande
                              </Label>
                              <Textarea
                                id={`${step}-welcome`}
                                value={data.welcome}
                                onChange={(e) => handleAppWelcomeChange(step, e.target.value)}
                                rows={6}
                                className="bg-background border-input text-foreground"
                              />
                              <p className="text-muted-foreground text-xs">
                                Detta meddelande visas för användaren när de börjar detta steg.
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`${step}-description`} className="text-foreground">
                                Beskrivning
                              </Label>
                              <Textarea
                                id={`${step}-description`}
                                value={data.description}
                                onChange={(e) => handleAppDescriptionChange(step, e.target.value)}
                                rows={3}
                                className="bg-background border-input text-foreground"
                              />
                              <p className="text-muted-foreground text-xs">
                                En kort beskrivning av vad detta steg innebär.
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* Interview Bot Settings */}
          <TabsContent value="interview">
            <Accordion
              type="multiple"
              value={openSections}
              onValueChange={setOpenSections}
              className="w-full"
            >
              {/* System Instructions */}
              <AccordionItem value="interview-system-instructions" className="border-border">
                <AccordionTrigger className="hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    <span>System Instruktioner - Intervjubot</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="interview-system-message" className="text-foreground">
                      System Instruktioner
                    </Label>
                    <Textarea
                      id="interview-system-message"
                      value={interviewSystemMessage}
                      onChange={(e) => setInterviewSystemMessage(e.target.value)}
                      rows={10}
                      className="bg-background border-input text-foreground font-mono text-sm"
                    />
                    <p className="text-muted-foreground text-xs">
                      Dessa instruktioner styr hur intervjuboten beter sig och vilken information
                      den har tillgång till.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Interview Steps */}
              <AccordionItem value="interview-steps" className="border-border border-t">
                <AccordionTrigger className="hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-4">
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5" />
                    <span>Intervjufrågor</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 pb-2">
                  {/* Nested accordion for steps */}
                  <Accordion type="multiple" className="w-full border-0">
                    {Object.entries(interviewStepMessages).map(([step, data]) => (
                      <AccordionItem
                        key={step}
                        value={step}
                        className="border-border border-t border-b-0"
                      >
                        <AccordionTrigger className="hover:bg-accent hover:text-accent-foreground px-6 py-3">
                          {`Steg ${step.split("-")[1]}: ${data.label || "Namnlös fråga"}`}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pt-2 pb-4">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`${step}-label`} className="text-foreground">
                                Etikett (visas i sidofältet)
                              </Label>
                              <Textarea
                                id={`${step}-label`}
                                value={data.label}
                                onChange={(e) => handleInterviewLabelChange(step, e.target.value)}
                                rows={2}
                                className="bg-background border-input text-foreground"
                              />
                              <p className="text-muted-foreground text-xs">
                                Kort text som visas i sidomenyn för detta steg.
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`${step}-heading`} className="text-foreground">
                                Fråga (visas som rubrik)
                              </Label>
                              <Textarea
                                id={`${step}-heading`}
                                value={data.heading}
                                onChange={(e) => handleInterviewHeadingChange(step, e.target.value)}
                                rows={3}
                                className="bg-background border-input text-foreground"
                              />
                              <p className="text-muted-foreground text-xs">
                                Den faktiska frågan som ställs till användaren.
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
