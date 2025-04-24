"use client";

import { Loader2, Send, Copy } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from "@/components/chatpage/Sidebar";
import { Card } from "@/components/ui/card";

import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

// Define steps for reference in the component
const steps = [
  { id: "step-1", label: "Välj ärendtyp" },
  { id: "step-2", label: "Funktionsnedsättning" },
  { id: "step-3", label: "Grundläggande behov" },
  { id: "step-4", label: "Andra behov" },
  { id: "step-5", label: "Nuvarande stöd" },
  { id: "step-6", label: "Granska och skicka" },
];

export default function ChatBot() {
  // Use environment variable or default to localhost
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Step management
  const [currentStep, setCurrentStep] = useState("step-1");
  const [completedSteps, setCompletedSteps] = useState([]);

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

  // Get current step's chat history
  const currentChatHistory = chatHistories[currentStep] || [];

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  // Load existing histories on page load
  useEffect(() => {
    async function loadStepHistories() {
      const newHistories = { ...chatHistories };
      const newCompletedSteps = [...completedSteps];

      // Load history for each step
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

              // Mark step as having messages (which might just be the welcome message)
              if (data.length > 0) {
                // If there are more than just the welcome message, mark as completed
                if (data.length > 1 && !newCompletedSteps.includes(stepId)) {
                  newCompletedSteps.push(stepId);
                }
              }
            }
          }
        } catch (error) {
          console.error(`Failed to load history for step ${stepId}:`, error);
        }
      }

      setChatHistories(newHistories);
      setCompletedSteps(newCompletedSteps);
    }

    loadStepHistories();
  }, [BASE_URL]);

  // Navigate to a different step
  const navigateToStep = (stepId) => {
    setCurrentStep(stepId);
    // Scroll to bottom after a short delay to ensure DOM is updated
    setTimeout(scrollToBottom, 100);
  };

  // Complete current step and move to next
  const completeCurrentStep = () => {
    const stepOrder = ["step-1", "step-2", "step-3", "step-4", "step-5", "step-6"];
    const currentIndex = stepOrder.indexOf(currentStep);

    if (currentIndex < stepOrder.length - 1) {
      // Mark as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }

      // Move to next step
      setCurrentStep(stepOrder[currentIndex + 1]);

      // Scroll to bottom after a short delay
      setTimeout(scrollToBottom, 100);
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

      // If this is the first user message in this step (considering the welcome message),
      // mark the step as completed
      if (
        updatedHistory.filter((msg) => msg.role === "user").length === 1 &&
        !completedSteps.includes(currentStep)
      ) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
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
      // Scroll to bottom after a short delay
      setTimeout(scrollToBottom, 100);
    }
  }

  // Handle enter key press to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-background flex h-[90vh] w-full">
      {/* Interactive Sidebar */}
      <Sidebar
        currentStep={currentStep}
        completedSteps={completedSteps}
        onNavigate={navigateToStep}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Chat Messages */}
        <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-3xl">
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
                  className={`rounded-xl p-4 ${
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
                {message.role === "assistant" && (
                  <div className="group relative mt-2 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(message.text)}
                      className="text-sm"
                    >
                      <Copy />
                    </Button>
                    <span className="absolute -top-6 right-[-10px] hidden rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                      Kopiera
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-background border-t p-4">
          <div className="mx-auto flex max-w-3xl items-center gap-5">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Skriv ett meddelande..."
              className="border-border bg-background min-h-12 resize-none rounded-xl p-3 shadow-sm"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
              size="icon"
              className="bg-primary hover:bg-primary/80 text-foreground h-10 w-10 rounded-full"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
            {currentChatHistory.filter((msg) => msg.role === "user").length > 0 && (
              <Button
                onClick={completeCurrentStep}
                className="bg-primary hover:bg-primary/80 text-foreground"
              >
                Nästa steg
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
