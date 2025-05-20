"use client";

import { Loader2, Send, Copy } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import MessageLoading from "@/components/ui/message-loading";

import TopTrackingbar from "@/components/chatpage/TopTrackingBar";
import Sidebar from "@/components/chatpage/SidebarNav";
import BackToBottomBtn from "@/components/chatpage/BackToBottomBtn";

import { useResizableTextarea } from "@/hooks/useResizableTextarea";

import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

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

export default function ChatComponent({ steps, historyEndpoint, welcomeEndpoint, type }) {
  // Use environment variable or default to localhost
  const BASE_URL = process.env.API_URL || "http://localhost:4000";
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState("step-1");
  const [completedSteps, setCompletedSteps] = useState([]);
  const [cookieConsent, setCookieConsent] = useState(undefined);

  useEffect(() => {
    setCookieConsent(localStorage.getItem("cookiesAccepted") === "true");
  }, []);

  // Create chat histories object dynamically from steps
  const initialChatHistories = {};
  steps.forEach((step) => {
    initialChatHistories[step.id] = [];
  });
  const [chatHistories, setChatHistories] = useState(initialChatHistories);

  const stepsId = steps.map((step) => step.id);

  // Load data from localStorage once on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("currentStep");
      if (savedStep) {
        setCurrentStep(savedStep);
      }

      const savedCompletedSteps = localStorage.getItem("completedSteps");
      if (savedCompletedSteps) {
        try {
          const parsedSteps = JSON.parse(savedCompletedSteps);
          if (Array.isArray(parsedSteps)) {
            setCompletedSteps(parsedSteps);
          }
        } catch (e) {
          console.error("Error parsing completedSteps from localStorage:", e);
          localStorage.removeItem("completedSteps");
        }
      }
      setIsHydrated(true);
    }
  }, []);

  // Fetch welcome message after hydration
  useEffect(() => {
    if (isHydrated) {
      const currentStepToUse = localStorage.getItem("currentStep") || currentStep;
      fetchWelcomeMessage(currentStepToUse);
    }
  }, [isHydrated]);

  // Update localStorage when states change
  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      localStorage.setItem("currentStep", currentStep);
    }
  }, [currentStep, isHydrated]);

  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      localStorage.setItem("completedSteps", JSON.stringify(completedSteps));
    }
  }, [completedSteps, isHydrated]);

  const currentStepData = steps.find((step) => step.id === currentStep);
  const heading = currentStepData?.heading || "Chat";

  // Reference to message container for scrolling
  const messageContainerRef = useRef(null);
  const { autoResizeTextarea, resetTextareaSize } = useResizableTextarea(messageContainerRef);

  // Auto-scroll when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      setTimeout(() => {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      }, 10);
    }
  }, [chatHistories]);

  // Get current step's chat history
  const currentChatHistory = chatHistories[currentStep] || [];

  // Send chat history to the backend
  useEffect(() => {
    if (!currentChatHistory || currentChatHistory.length === 0) return;

    async function sendHistoryToBackend() {
      const userId = localStorage.getItem("userId");

      if (!cookieConsent) return;

      try {
        const response = await fetch(`${BASE_URL}${historyEndpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            currentStep,
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
  }, [currentChatHistory, historyEndpoint]);

  // Load existing histories
  useEffect(() => {
    if (!isHydrated) return;

    async function loadStepHistories() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No userId found in localStorage");
        return;
      }

      const newHistories = { ...chatHistories };
      let stepsNeedingWelcome = [];

      for (const stepId of Object.keys(newHistories)) {
        try {
          const response = await fetch(`${BASE_URL}${historyEndpoint}/${stepId}?userId=${userId}`);

          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              newHistories[stepId] = data.map((msg) => ({
                role: msg.role,
                text: msg.content,
              }));
            } else if (stepId === currentStep && newHistories[stepId].length === 0) {
              stepsNeedingWelcome.push(stepId);
            }
          }
        } catch (error) {
          console.error(`Failed to load history for step ${stepId}:`, error);
          if (stepId === currentStep) {
            stepsNeedingWelcome.push(stepId);
          }
        }
      }

      setChatHistories(newHistories);

      for (const stepId of stepsNeedingWelcome) {
        await fetchWelcomeMessage(stepId);
      }
    }

    loadStepHistories();
  }, [BASE_URL, isHydrated, currentStep, historyEndpoint]);

  // Fetch welcome message
  const fetchWelcomeMessage = async (stepId) => {
    try {
      console.log(`Fetching welcome message for step ${stepId}`);
      const response = await fetch(`${BASE_URL}${welcomeEndpoint}/${stepId}`);

      if (response.ok) {
        const data = await response.json();

        setChatHistories((current) => {
          const stepHistory = current[stepId] || [];
          if (stepHistory.length === 0) {
            console.log(`Setting welcome message for step ${stepId}`);
            return {
              ...current,
              [stepId]: [{ role: "assistant", text: data.message }],
            };
          }
          return current;
        });
      }
    } catch (error) {
      console.error(`Failed to fetch welcome message for step ${stepId}:`, error);
    }
  };

  // Navigate to a different step
  const navigateToStep = (stepId) => {
    setCurrentStep(stepId);

    if (chatHistories[stepId].length === 0) {
      fetchWelcomeMessage(stepId);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("currentStep", stepId);
    }
  };

  // Listen for custom event from TopTrackingBar
  useEffect(() => {
    const handleStepCompleted = (event) => {
      const { step } = event.detail;
      if (!completedSteps.includes(step)) {
        const updatedCompletedSteps = [...completedSteps, step];
        setCompletedSteps(updatedCompletedSteps);
      }
    };
    window.addEventListener("stepCompleted", handleStepCompleted);

    return () => {
      window.removeEventListener("stepCompleted", handleStepCompleted);
    };
  }, [completedSteps]);

  // Complete current step and move to next
  const completeCurrentStep = () => {
    const stepOrder = stepsId;
    const currentIndex = stepOrder.indexOf(currentStep);

    if (currentIndex < stepOrder.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        const updatedCompletedSteps = [...completedSteps, currentStep];
        setCompletedSteps(updatedCompletedSteps);

        if (typeof window !== "undefined") {
          localStorage.setItem("completedSteps", JSON.stringify(updatedCompletedSteps));
        }
      }

      if (currentIndex < stepOrder.length - 1) {
        const nextStep = stepOrder[currentIndex + 1];
        setCurrentStep(nextStep);

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

    const updatedHistory = [...currentChatHistory, { role: "user", text: message }];

    setChatHistories({
      ...chatHistories,
      [currentStep]: updatedHistory,
    });

    setMessage("");
    resetTextareaSize();

    try {
      const userId = localStorage.getItem("userId");

      const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          currentStep,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      setChatHistories({
        ...chatHistories,
        [currentStep]: [...updatedHistory, { role: "assistant", text: data.message }],
      });
    } catch (error) {
      console.error("Error sending message:", error);

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
      <div className="bg-background flex h-[90vh] w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background relative flex h-[90vh] overflow-hidden">
      {/* Interactive Sidebar */}
      <Sidebar
        currentStep={currentStep}
        completedSteps={completedSteps}
        onNavigate={navigateToStep}
        type={type}
      />
      <div className="flex w-full flex-col">
        {/* This is the only scrollable area  */}
        <div
          className="h-[85%] w-full overflow-y-auto"
          ref={messageContainerRef}
          style={{ height: "calc(85% - var(--textarea-extra-height, 0px))" }}
        >
          <TopTrackingbar
            heading={heading}
            currentStep={currentStep}
            navigateToStep={navigateToStep}
            completedSteps={completedSteps}
            completeCurrentStep={completeCurrentStep}
            steps={stepsId}
          />
          <div>
            {/* Chat Messages */}
            <div className="mx-auto max-w-3xl px-3">
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
        </div>
        <div className="h-[15%] w-full">
          <div className="relative mx-auto max-w-7xl">
            <div className="w-full">
              <BackToBottomBtn containerRef={messageContainerRef} threshold={30} />
              <div
                style={{ maxWidth: "4xl", margin: "0 auto" }}
                className="flex w-full max-w-4xl items-center px-4 pb-4"
              >
                <div className="relative flex flex-1 flex-col">
                  <Textarea
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      autoResizeTextarea(e);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Skriv ett meddelande..."
                    className="border-border bg-background max-h-max min-h-24 w-full resize-none overflow-y-auto rounded-xl p-3 pr-16 shadow-sm"
                  />
                  {!cookieConsent && (
                    <div className="text-foreground/50 absolute bottom-2 flex w-full justify-center">
                      <small>
                        För att få den bästa upplevelsen på vår webbplats, vänligen{" "}
                        <Link href="/cookies" className="hover:text-primary underline">
                          acceptera cookies
                        </Link>
                      </small>
                    </div>
                  )}
                  <div className="absolute top-1 right-1">
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
        </div>
      </div>
    </div>
  );
}
