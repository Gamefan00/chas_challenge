"use client";

import { Loader2, Send, Copy } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Markdown from "react-markdown";
import TopTrackingbar from "@/components/chatpage/TopTrackingBar";
import Sidebar from "@/components/chatpage/SidebarNav";
import MessageLoading from "@/components/ui/message-loading";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import Navbar from "@/components/homepage/Navbar";

// Define steps for reference in the component
const steps = [
  { id: "step-1", label: "Välj ärendetyp", heading: "Vem ansöker?" },
  { id: "step-2", label: "Funktionsnedsättning", heading: "Om din funktionsnedsättning" },
  { id: "step-3", label: "Grundläggande behov", heading: "Dina arbetsrelaterade behov" },
  { id: "step-4", label: "Andra behov", heading: "Övriga behov i arbetet" },
  { id: "step-5", label: "Nuvarande stöd", heading: "Stöd du redan får" },
  { id: "step-6", label: "Granska och skicka", heading: "Sammanfatta och ladda ner" },
];

const stepsId = steps.map((step) => step.id);

function CopyButton({ message }) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="group relative mt-2 flex justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          navigator.clipboard.writeText(message);
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 4000);
        }}
        className="text-sm"
      >
        {isCopied ? <p>Kopierat</p> : <Copy />}
      </Button>
      <span className="absolute -top-6 right-[-22px] hidden rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
        {isCopied ? "Kopierat" : "kopiera"}
      </span>
    </div>
  );
}

export default function ChatBot() {
  // Use environment variable or default to localhost
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Add a hydration state to prevent flash of initial content
  const [isHydrated, setIsHydrated] = useState(false);

  // Step management with localStorage persistence
  const [currentStep, setCurrentStep] = useState("step-1"); // Default initial value
  const [completedSteps, setCompletedSteps] = useState([]);

  // Load data from localStorage once on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load current step from localStorage
      const savedStep = localStorage.getItem("currentStep");
      if (savedStep) {
        setCurrentStep(savedStep);
      }

      // Load completed steps from localStorage
      const savedCompletedSteps = localStorage.getItem("completedSteps");
      if (savedCompletedSteps) {
        try {
          const parsedSteps = JSON.parse(savedCompletedSteps);
          if (Array.isArray(parsedSteps)) {
            setCompletedSteps(parsedSteps);
            console.log("Loaded completed steps:", parsedSteps); // Debug log
          }
        } catch (e) {
          console.error("Error parsing completedSteps from localStorage:", e);
          // If parsing fails, reset localStorage
          localStorage.removeItem("completedSteps");
        }
      }

      // Mark hydration as complete
      setIsHydrated(true);
    }
  }, []);

  // Update localStorage when currentStep changes
  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      localStorage.setItem("currentStep", currentStep);
    }
  }, [currentStep, isHydrated]);

  // Update localStorage when completedSteps changes
  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      localStorage.setItem("completedSteps", JSON.stringify(completedSteps));
    }
  }, [completedSteps, isHydrated]);

  const currentStepData = steps.find((step) => step.id === currentStep);
  const heading = currentStepData?.heading || "Chat";

  // Store separate chat histories for each step
  const [chatHistories, setChatHistories] = useState({
    "step-1": [],
    "step-2": [],
    "step-3": [],
    "step-4": [],
    "step-5": [],
    "step-6": [],
  });

  // Reference to message container for scrolling
  const messageContainerRef = useRef(null);

  // Auto-scroll when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [chatHistories]);

  // Get current step's chat history
  const currentChatHistory = chatHistories[currentStep] || [];

  // Send chat history to the backend
  useEffect(() => {
    if (!currentChatHistory || currentChatHistory.length === 0) return;

    async function sendHistoryToBackend() {
      console.log("currentChatHistory", currentChatHistory);
      const userId = localStorage.getItem("userId");

      try {
        const response = await fetch(`${BASE_URL}/history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            currentChatHistory,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
    sendHistoryToBackend();
  }, [currentChatHistory]);

  // Load existing histories on page load
  useEffect(() => {
    if (!isHydrated) return; // Skip loading if not hydrated yet

    async function loadStepHistories() {
      const newHistories = { ...chatHistories };

      // Load history for each step from API
      for (const stepId of Object.keys(newHistories)) {
        try {
          const response = await fetch(`${BASE_URL}/history/${stepId}`);

          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
              newHistories[stepId] = data.map((msg) => ({
                role: msg.role,
                text: msg.content,
              }));
            }
          }
        } catch (error) {
          console.error(`Failed to load history for step ${stepId}:`, error);
        }
      }

      setChatHistories(newHistories);
    }

    loadStepHistories();
  }, [BASE_URL, isHydrated]);

  // Navigate to a different step
  const navigateToStep = (stepId) => {
    setCurrentStep(stepId);

    // Immediately save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("currentStep", stepId);
    }
  };

  // Listen for custom event from TopTrackingBar
  useEffect(() => {
    const handleStepCompleted = (event) => {
      const { step } = event.detail;
      // Update the completedSteps array without navigating
      if (!completedSteps.includes(step)) {
        const updatedCompletedSteps = [...completedSteps, step];
        setCompletedSteps(updatedCompletedSteps);
      }
    };
    window.addEventListener("stepCompleted", handleStepCompleted);

    // Clean up eventlistener
    return () => {
      window.removeEventListener("stepCompleted", handleStepCompleted);
    };
  }, [completedSteps]);

  // Complete current step and move to next
  const completeCurrentStep = () => {
    const stepOrder = ["step-1", "step-2", "step-3", "step-4", "step-5", "step-6"];
    const currentIndex = stepOrder.indexOf(currentStep);

    if (currentIndex < stepOrder.length - 1) {
      // Mark as completed if not already completed
      if (!completedSteps.includes(currentStep)) {
        const updatedCompletedSteps = [...completedSteps, currentStep];
        setCompletedSteps(updatedCompletedSteps);

        // Immediately save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("completedSteps", JSON.stringify(updatedCompletedSteps));
        }
      }
      // Only move to next step if not on the last step
      if (currentIndex < stepOrder.length - 1) {
        // Move to next step
        const nextStep = stepOrder[currentIndex + 1];
        setCurrentStep(nextStep);

        // Immediately save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("currentStep", nextStep);
        }
      }
    }
  };

  // Send user message for current step
  async function handleSendMessage() {
    if (!message.trim()) return;

    setIsLoading(true);

    // Update the current step's chat history
    const updatedHistory = [...currentChatHistory, { role: "user", text: message }];

    setChatHistories({
      ...chatHistories,
      [currentStep]: updatedHistory,
    });

    setMessage(""); // Clear input right away for better UX

    try {
      const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          currentStep,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      // Update the current step's chat history with the response
      setChatHistories({
        ...chatHistories,
        [currentStep]: [...updatedHistory, { role: "assistant", text: data.message }],
      });
    } catch (error) {
      console.error("Error sending message:", error);

      // Show error message to user
      setChatHistories({
        ...chatHistories,
        [currentStep]: [
          ...updatedHistory,
          { role: "assistant", text: "Tyvärr uppstod ett fel. Vänligen försök igen." },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle enter key press to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show loading state until hydration is complete
  if (!isHydrated) {
    return (
      <div className="bg-background flex h-full w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-background flex h-screen w-full overflow-hidden">
        {/* Interactive Sidebar */}
        <Sidebar
          currentStep={currentStep}
          completedSteps={completedSteps}
          onNavigate={navigateToStep}
        />

        {/* Main Content */}
        <div
          className="relative mx-auto h-screen flex max-w-4xl flex-1 flex-col overflow-y-auto"
        >
          {/* Top tracking bar (fixed at top) */}

          <TopTrackingbar
            heading={heading}
            currentStep={currentStep}
            navigateToStep={navigateToStep}
            completedSteps={completedSteps}
            completeCurrentStep={completeCurrentStep}
            steps={stepsId}
          />

          {/* Chat Messages - This is the only scrollable area */}
          <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4">
            <div className="mx-auto max-w-4xl pb-24">
              {currentChatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === "user"
                      ? "flex flex-col items-end justify-end"
                      : "flex flex-col items-start justify-start"
                  }`}
                >
                  <Card
                    className={`max-w-[80%] rounded-xl p-4 break-words ${
                      message.role === "user" ? "user-msg bg-primary" : "bg-card"
                    }`}
                  >
                    <div className="markdown-container">
                      <Markdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        components={{
                          code(props) {
                            const { children, className, ...rest } = props;
                            return (
                              <code
                                className={`${className} text-primary bg-background rounded px-1.5 py-0.5`}
                                {...rest}
                              >
                                {children}
                              </code>
                            );
                          },
                          pre(props) {
                            return (
                              <pre
                                className="text-primary bg-primary overflow-x-auto rounded-md p-4 text-sm"
                                {...props}
                              />
                            );
                          },
                        }}
                      >
                        {message.text || ""}
                      </Markdown>
                    </div>
                  </Card>

                  {message.role === "assistant" && <CopyButton message={message.text} />}
                </div>
              ))}
              {isLoading && (
                <Card className="inline-block items-start rounded-xl px-3 py-1 pb-0">
                  <MessageLoading />
                </Card>
              )}
            </div>
          </div>

          {/* Input Area (fixed at bottom) */}
          <div className="bg-background sticky bottom-0 border-t p-4">
            <div className="mx-auto flex max-w-2xl items-center gap-5">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Skriv ett meddelande..."
                className="border-border bg-background relative max-h-32 min-h-12 resize-none overflow-y-auto rounded-xl p-3 shadow-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
                size="icon"
                className="bg-primary h-10 w-10 rounded-full"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// Back to Bottom Button
// <div>
//   <BackToBottomBtn containerRef={messageContainerRef} threshold={30} />
// </div>
