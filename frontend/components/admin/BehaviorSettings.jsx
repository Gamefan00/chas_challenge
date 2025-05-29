"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertCircle, Loader2, Settings, ListChecks, Users, UserCheck } from "lucide-react";
import SaveBtn from "@/components/admin/SaveBtn";
import { StatusMessage } from "@/components/admin/StatusMessage";

export default function BehaviorSettings() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState(["system-instructions"]);
  const [activeBot, setActiveBot] = useState("application");

  // Application bot settings with role-based messages
  const [applicationSystemMessage, setApplicationSystemMessage] = useState("");
  const [applicationStepMessages, setApplicationStepMessages] = useState({
    "step-1": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
    "step-2": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
    "step-3": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
    "step-4": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
    "step-5": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
    "step-6": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
  });

  // Interview bot settings with role-based messages
  const [interviewSystemMessage, setInterviewSystemMessage] = useState("");
  const [interviewStepMessages, setInterviewStepMessages] = useState({
    "step-1": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
    "step-2": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
    "step-3": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
    "step-4": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
    "step-5": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
    "step-6": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
    "step-7": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
    "step-8": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
    "step-9": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
    "step-10": {
      welcomeArbetstagare: "",
      welcomeArbetsgivare: "",
      description: "",
    },
  });

  // Load settings from database on component mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${BASE_URL}/settingsRoutes/aiBehaviorConfigRoutes`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          console.error(`API Error: ${response.status} - ${response.statusText}`);
          throw new Error(`Det gick inte att ladda inställningarna (${response.status})`);
        }

        const data = await response.json();

        if (data && data.behaviorConfig) {
          // Set application system message
          setApplicationSystemMessage(data.behaviorConfig.applicationSystemMessage || "");

          // Set interview system message
          setInterviewSystemMessage(data.behaviorConfig.interviewSystemMessage || "");

          // Set application step messages with role support
          if (data.behaviorConfig.applicationSteps) {
            const updatedAppSteps = {};
            Object.keys(applicationStepMessages).forEach((stepKey) => {
              const stepData = data.behaviorConfig.applicationSteps[stepKey] || {};
              updatedAppSteps[stepKey] = {
                welcomeArbetstagare: stepData.welcomeArbetstagare || stepData.welcome || "",
                welcomeArbetsgivare: stepData.welcomeArbetsgivare || stepData.welcome || "",
                description: stepData.description || "",
              };
            });
            setApplicationStepMessages(updatedAppSteps);
          }

          // Set interview step messages with role support
          if (data.behaviorConfig.interviewSteps) {
            const updatedInterviewSteps = {};
            Object.keys(interviewStepMessages).forEach((stepKey) => {
              const stepData = data.behaviorConfig.interviewSteps[stepKey] || {};
              updatedInterviewSteps[stepKey] = {
                welcomeArbetstagare: stepData.welcomeArbetstagare || stepData.welcome || "",
                welcomeArbetsgivare: stepData.welcomeArbetsgivare || stepData.welcome || "",
                description: stepData.description || "",
              };
            });
            setInterviewStepMessages(updatedInterviewSteps);
          }
        }
      } catch (err) {
        console.error("Error loading behavior settings:", err);
        setError(err.message || "Det gick inte att ladda inställningarna");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [BASE_URL]);

  // Save all settings
  const handleSave = async () => {
    try {
      setSaveStatus({ type: "loading", message: "Sparar..." });

      // Prepare the behavior config object
      const behaviorConfig = {
        applicationSystemMessage,
        interviewSystemMessage,
        applicationSteps: applicationStepMessages,
        interviewSteps: interviewStepMessages,
      };

      const response = await fetch(`${BASE_URL}/settingsRoutes/aiBehaviorConfigRoutes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ behaviorConfig }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      setSaveStatus({ type: "success", message: "Inställningarna har sparats" });

      // Clear status after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus({ type: "error", message: "Det gick inte att spara inställningarna" });
    }
  };

  // Handle changes to application step welcome messages for Arbetstagare
  const handleAppWelcomeArbetstagareChange = (step, value) => {
    setApplicationStepMessages((prev) => ({
      ...prev,
      [step]: { ...prev[step], welcomeArbetstagare: value },
    }));
  };

  // Handle changes to application step welcome messages for Arbetsgivare
  const handleAppWelcomeArbetsgivareChange = (step, value) => {
    setApplicationStepMessages((prev) => ({
      ...prev,
      [step]: { ...prev[step], welcomeArbetsgivare: value },
    }));
  };

  // Handle changes to application step descriptions
  const handleAppDescriptionChange = (step, value) => {
    setApplicationStepMessages((prev) => ({
      ...prev,
      [step]: { ...prev[step], description: value },
    }));
  };

  // Handle changes to interview step welcome messages for Arbetstagare
  const handleInterviewWelcomeArbetstagareChange = (step, value) => {
    setInterviewStepMessages((prev) => ({
      ...prev,
      [step]: { ...prev[step], welcomeArbetstagare: value },
    }));
  };

  // Handle changes to interview step welcome messages for Arbetsgivare
  const handleInterviewWelcomeArbetsgivareChange = (step, value) => {
    setInterviewStepMessages((prev) => ({
      ...prev,
      [step]: { ...prev[step], welcomeArbetsgivare: value },
    }));
  };

  // Handle changes to interview step descriptions
  const handleInterviewDescriptionChange = (step, value) => {
    setInterviewStepMessages((prev) => ({
      ...prev,
      [step]: { ...prev[step], description: value },
    }));
  };

  const getApplicationStepName = (step) => {
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
        return "Steg 6: Sammanfattning";
      default:
        return step;
    }
  };

  const getInterviewStepName = (step) => {
    switch (step) {
      case "step-1":
        return "Steg 1: Arbetsuppgifter";
      case "step-2":
        return "Steg 2: Svårigheter i arbetet";
      case "step-3":
        return "Steg 3: Tidigare lösningar";
      case "step-4":
        return "Steg 4: Arbetsmiljö";
      case "step-5":
        return "Steg 5: Gjorda åtgärder";
      case "step-6":
        return "Steg 6: Stöd utanför arbetet";
      case "step-7":
        return "Steg 7: Arbete VS Fritid";
      case "step-8":
        return "Steg 8: Användning av hjälpmedel";
      case "step-9":
        return "Steg 9: Ekonomi och ansvar";
      case "step-10":
        return "Steg 10: Sammanfattning";
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

  const textareaClasses =
    "bg-background border-input text-foreground font-mono text-sm border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30  flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

  return (
    <Card className="bg-card text-card-foreground w-full">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-foreground">AI-beteende</CardTitle>
          <CardDescription className="text-muted-foreground">
            Anpassa AI-assistentens instruktioner, välkomstmeddelanden och steg för både
            Arbetstagare och Arbetsgivare.
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
                      System Instruktioner (inkluderar rollbaserade instruktioner)
                    </Label>
                    <textarea
                      id="app-system-message"
                      value={applicationSystemMessage}
                      onChange={(e) => setApplicationSystemMessage(e.target.value)}
                      rows={12}
                      className={textareaClasses}
                      placeholder="Exempel: Du är expert på arbetshjälpmedel.

VIKTIGT: Identifiera först om användaren är Arbetstagare eller Arbetsgivare baserat på deras svar.

=== ARBETSTAGARE INSTRUKTIONER ===
Om användaren är en arbetstagare (anställd som ansöker för sig själv):
- Använd blankett FK 7545
- Fokusera på personliga behov och funktionsnedsättning
...

=== ARBETSGIVARE INSTRUKTIONER ===  
Om användaren är en arbetsgivare (ansöker för en anställd):
- Använd blankett FK 7546
- Fokusera på anpassningar av arbetsplatsen
..."
                    />
                    <p className="text-muted-foreground text-xs">
                      Dessa instruktioner styr hur ansökningsboten beter sig och inkluderar
                      automatisk rolldetektering för Arbetstagare vs Arbetsgivare.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Application Steps */}
              <AccordionItem value="application-steps" className="border-border border-t">
                <AccordionTrigger className="hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-4">
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5" />
                    <span>Ansökningssteg (Rollbaserade meddelanden)</span>
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
                          {getApplicationStepName(step)}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pt-2 pb-4">
                          <div className="space-y-6">
                            {/* Arbetstagare Welcome Message */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-blue-600" />
                                <Label
                                  htmlFor={`${step}-welcome-arbetstagare`}
                                  className="text-foreground font-medium"
                                >
                                  Välkomstmeddelande för Arbetstagare
                                </Label>
                              </div>
                              <textarea
                                id={`${step}-welcome-arbetstagare`}
                                value={data.welcomeArbetstagare}
                                onChange={(e) =>
                                  handleAppWelcomeArbetstagareChange(step, e.target.value)
                                }
                                rows={4}
                                className={textareaClasses}
                                placeholder="Meddelande som visas för arbetstagare (anställda som ansöker för sig själva)..."
                              />
                            </div>

                            {/* Arbetsgivare Welcome Message */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-green-600" />
                                <Label
                                  htmlFor={`${step}-welcome-arbetsgivare`}
                                  className="text-foreground font-medium"
                                >
                                  Välkomstmeddelande för Arbetsgivare
                                </Label>
                              </div>
                              <textarea
                                id={`${step}-welcome-arbetsgivare`}
                                value={data.welcomeArbetsgivare}
                                onChange={(e) =>
                                  handleAppWelcomeArbetsgivareChange(step, e.target.value)
                                }
                                rows={4}
                                className={textareaClasses}
                                placeholder="Meddelande som visas för arbetsgivare (som ansöker för sina anställda)..."
                              />
                            </div>

                            {/* AI Instructions */}
                            <div className="space-y-2">
                              <Label
                                htmlFor={`${step}-description`}
                                className="text-foreground font-medium"
                              >
                                AI-instruktion för detta steg
                              </Label>
                              <textarea
                                id={`${step}-description`}
                                value={data.description}
                                onChange={(e) => handleAppDescriptionChange(step, e.target.value)}
                                rows={3}
                                className={textareaClasses}
                                placeholder="Ange hur AI:n ska bete sig i detta steg och vad den ska guida användaren genom..."
                              />
                              <p className="text-muted-foreground text-xs">
                                Instruktioner som gäller för båda rollerna i detta specifika steg.
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
                      System Instruktioner (inkluderar rollbaserade instruktioner)
                    </Label>
                    <textarea
                      id="interview-system-message"
                      value={interviewSystemMessage}
                      onChange={(e) => setInterviewSystemMessage(e.target.value)}
                      rows={12}
                      className={textareaClasses}
                      placeholder="Exempel: Du är en intervjuassistent för arbetshjälpmedel.

VIKTIGT: Identifiera först om användaren är Arbetstagare eller Arbetsgivare baserat på deras svar.

=== ARBETSTAGARE INSTRUKTIONER ===
Om användaren är en arbetstagare:
- Ställ personliga frågor om funktionsnedsättning
- Fokusera på individuella behov
...

=== ARBETSGIVARE INSTRUKTIONER ===  
Om användaren är en arbetsgivare:
- Ställ frågor om den anställdas situation
- Fokusera på arbetsmiljöanpassningar
..."
                    />
                    <p className="text-muted-foreground text-xs">
                      Dessa instruktioner styr hur intervjuboten beter sig och inkluderar automatisk
                      rolldetektering för Arbetstagare vs Arbetsgivare.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Interview Steps */}
              <AccordionItem value="interview-steps" className="border-border border-t">
                <AccordionTrigger className="hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-4">
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5" />
                    <span>Intervjusteg (Rollbaserade meddelanden)</span>
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
                          {getInterviewStepName(step)}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pt-2 pb-4">
                          <div className="space-y-6">
                            {/* Arbetstagare Welcome Message */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-blue-600" />
                                <Label
                                  htmlFor={`${step}-interview-welcome-arbetstagare`}
                                  className="text-foreground font-medium"
                                >
                                  Välkomstmeddelande för Arbetstagare
                                </Label>
                              </div>
                              <textarea
                                id={`${step}-interview-welcome-arbetstagare`}
                                value={data.welcomeArbetstagare}
                                onChange={(e) =>
                                  handleInterviewWelcomeArbetstagareChange(step, e.target.value)
                                }
                                rows={4}
                                className={textareaClasses}
                                placeholder="Meddelande som visas för arbetstagare under intervjun..."
                              />
                            </div>

                            {/* Arbetsgivare Welcome Message */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-green-600" />
                                <Label
                                  htmlFor={`${step}-interview-welcome-arbetsgivare`}
                                  className="text-foreground font-medium"
                                >
                                  Välkomstmeddelande för Arbetsgivare
                                </Label>
                              </div>
                              <textarea
                                id={`${step}-interview-welcome-arbetsgivare`}
                                value={data.welcomeArbetsgivare}
                                onChange={(e) =>
                                  handleInterviewWelcomeArbetsgivareChange(step, e.target.value)
                                }
                                rows={4}
                                className={textareaClasses}
                                placeholder="Meddelande som visas för arbetsgivare under intervjun..."
                              />
                            </div>

                            {/* AI Instructions */}
                            <div className="space-y-2">
                              <Label
                                htmlFor={`${step}-interview-description`}
                                className="text-foreground font-medium"
                              >
                                AI-instruktion för detta steg
                              </Label>
                              <textarea
                                id={`${step}-interview-description`}
                                value={data.description}
                                onChange={(e) =>
                                  handleInterviewDescriptionChange(step, e.target.value)
                                }
                                rows={3}
                                className={textareaClasses}
                                placeholder="Ange hur AI:n ska bete sig i detta intervjusteg..."
                              />
                              <p className="text-muted-foreground text-xs">
                                Instruktioner som gäller för båda rollerna i detta specifika
                                intervjusteg.
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
