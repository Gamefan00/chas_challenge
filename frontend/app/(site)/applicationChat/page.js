"use client";

import { Loader2, Send, Copy } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Markdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import MessageLoading from "@/components/ui/message-loading";

import TopTrackingbar from "@/components/chatpage/TopTrackingBar";
import Sidebar from "@/components/chatpage/SidebarNav";
import BackToBottomBtn from "@/components/chatpage/BackToBottomBtn";

import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

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
          }
        } catch (e) {
          console.error("Error parsing completedSteps from localStorage:", e);
          localStorage.removeItem("completedSteps");
        }
      }

      // Mark hydration as complete
      setIsHydrated(true);
    }
  }, []);

  // Separate effect to handle welcome message after hydration is complete
  useEffect(() => {
    if (isHydrated) {
      const currentStepToUse = localStorage.getItem("currentStep") || currentStep;
      // Always fetch welcome message on first visit
      fetchWelcomeMessage(currentStepToUse);
    }
  }, [isHydrated]); // Only depends on hydration state

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
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      }, 10); // Small delay to ensure render completes
    }
  }, [chatHistories]);

  // Get current step's chat history
  const currentChatHistory = chatHistories[currentStep] || [];

  // Send chat history to the backend
  useEffect(() => {
    if (!currentChatHistory || currentChatHistory.length === 0) return;

    async function sendHistoryToBackend() {
      const userId = localStorage.getItem("userId");

      try {
        const response = await fetch(`${BASE_URL}/history`, {
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
  }, [currentChatHistory]);

  // Load existing histories on page load
  useEffect(() => {
    if (!isHydrated) return; // Skip loading if not hydrated yet

    async function loadStepHistories() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No userId found in localStorage");
        return;
      }

      const newHistories = { ...chatHistories };
      let needsWelcomeMessage = false;
      let stepsNeedingWelcome = [];

      // Load history for each step from API
      for (const stepId of Object.keys(newHistories)) {
        try {
          const response = await fetch(`${BASE_URL}/history/${stepId}?userId=${userId}`);

          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              // Only replace history if we actually got data
              newHistories[stepId] = data.map((msg) => ({
                role: msg.role,
                text: msg.content,
              }));
            } else if (stepId === currentStep && newHistories[stepId].length === 0) {
              // If this is the current step and has no history, mark it for welcome message
              needsWelcomeMessage = true;
              stepsNeedingWelcome.push(stepId);
            }
          }
        } catch (error) {
          console.error(`Failed to load history for step ${stepId}:`, error);
          if (stepId === currentStep) {
            needsWelcomeMessage = true;
            stepsNeedingWelcome.push(stepId);
          }
        }
      }

      // First set all histories
      setChatHistories(newHistories);

      // Then, if needed, fetch welcome messages for empty steps
      if (needsWelcomeMessage) {
        for (const stepId of stepsNeedingWelcome) {
          await fetchWelcomeMessage(stepId);
        }
      }
    }

    loadStepHistories();
  }, [BASE_URL, isHydrated, currentStep]);

  // fetch welcome message
  const fetchWelcomeMessage = async (stepId) => {
    try {
      console.log(`Fetching welcome message for step ${stepId}`);
      const response = await fetch(`${BASE_URL}/chat/welcome/${stepId}`);

      if (response.ok) {
        const data = await response.json();

        // Only add welcome message if there's no history for this step
        setChatHistories((current) => {
          const stepHistory = current[stepId] || [];

          // Check if history is empty
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

  // Modify your initial useEffect to always fetch welcome message on first load
  useEffect(() => {
    if (isHydrated) {
      // Get the current step (from localStorage or default)
      const currentStepToUse = localStorage.getItem("currentStep") || "step-1";
      // Always fetch welcome message for current step on first visit
      fetchWelcomeMessage(currentStepToUse);
    }
  }, [isHydrated]);

  // Navigate to a different step
  const navigateToStep = (stepId) => {
    setCurrentStep(stepId);

    // Check if this step already has messages
    if (chatHistories[stepId].length === 0) {
      // If empty, fetch welcome message
      fetchWelcomeMessage(stepId);
    }

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

  // Reset textarea size to default
  const resetTextareaSize = () => {
    // Find the textarea
    const textarea = document.querySelector("textarea");
    if (textarea) {
      // Reset height to original size
      textarea.style.height = "96px"; // min-h-24 equivalent

      // Reset CSS variable
      document.documentElement.style.setProperty("--textarea-extra-height", "0px");

      // Reset message container's padding and ensure it can scroll properly
      if (messageContainerRef.current) {
        messageContainerRef.current.style.paddingBottom = "0";

        // Force layout recalculation by triggering a scroll update
        setTimeout(() => {
          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }, 0);
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
    resetTextareaSize(); // Reset textarea size

    try {
      const userId = localStorage.getItem("userId"); // Get userId from localStorage

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

  const autoResizeTextarea = (e) => {
    const textarea = e.target;

    // Save scroll position and cursor position
    const scrollTop = textarea.scrollTop;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    // Reset height to calculate proper scrollHeight
    textarea.style.height = "96px"; // Reset to min-h-24 equivalent

    // Calculate new height with a maximum (320px = 8rem or 80px * 4)
    const newHeight = Math.min(textarea.scrollHeight, 320);

    // Set the new height
    textarea.style.height = `${newHeight}px`;

    // Restore scroll and cursor positions
    textarea.scrollTop = scrollTop;
    textarea.setSelectionRange(selectionStart, selectionEnd);

    // Update container sizing based on textarea height
    if (messageContainerRef.current) {
      // Calculate extra padding needed
      const extraPadding = newHeight - 96; // Height beyond default

      // Apply changes only when needed
      if (extraPadding > 0) {
        // Update CSS variable for dynamic container sizing
        document.documentElement.style.setProperty("--textarea-extra-height", `${extraPadding}px`);

        // Force scroll update AFTER the layout has been recalculated
        requestAnimationFrame(() => {
          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        });
      } else {
        document.documentElement.style.setProperty("--textarea-extra-height", "0px");
      }
    }
  };

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
    <div className="bg-background relative flex h-[90vh] overflow-hidden">
      {/* Interactive Sidebar */}
      <Sidebar
        currentStep={currentStep}
        completedSteps={completedSteps}
        onNavigate={navigateToStep}
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
          <div className="mx-auto max-w-7xl">
            <div className="w-full">
              <BackToBottomBtn containerRef={messageContainerRef} threshold={30} />
              <div
                style={{ maxWidth: "4xl", margin: "0 auto" }}
                className="flex w-full max-w-4xl items-center px-4 pb-4"
              >
                <div className="justyfy-end relative flex flex-1 flex-col">
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
                  <div className="absolute right-3 bottom-0 p-3">
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

// <div className="w-full">
//   <BackToBottomBtn containerRef={messageContainerRef} threshold={30} />
//   <div
//     style={{ maxWidth: "4xl", margin: "0 auto" }}
//     className="flex w-full max-w-4xl items-center gap-5 px-4 pb-4"
//   >
//     <Textarea
//       value={message}
//       onChange={(e) => {
//         setMessage(e.target.value);
//         autoResizeTextarea(e);
//       }}
//       onKeyDown={handleKeyDown}
//       placeholder="Skriv ett meddelande..."
//       className="border-border bg-background max-h-max min-h-24 flex-1 overflow-y-auto rounded-xl p-3 shadow-sm"
//     />
//     <Button
//       onClick={handleSendMessage}
//       disabled={isLoading || !message.trim()}
//       size="icon"
//       className="bg-primary h-10 w-10 rounded-full"
//     >
//       <Send className="h-5 w-5" />
//     </Button>
//   </div>
// </div>
// div className="flex">
//         <div className="mx-auto flex min-h-0 flex-1 flex-col">
//           <div className="relative mx-auto w-full max-w-4xl">
//             {/* Top tracking bar (fixed at top) */}

//             {/* Chat Messages - This is the only scrollable area */}
//             <div ref={messageContainerRef} className="flex-1 p-4">
//               <div className="mx-auto max-w-4xl">
//                 {currentChatHistory.map((message, index) => (
//                   <div
//                     key={index}
//                     className={`mb-4 ${
//                       message.role === "user"
//                         ? "flex flex-col items-end justify-end"
//                         : "flex flex-col items-start justify-start"
//                     }`}
//                   >
//                     <Card
//                       className={`max-w-[80%] rounded-xl p-4 break-words ${
//                         message.role === "user" ? "user-msg bg-primary" : "bg-card"
//                       }`}
//                     >
//                       <div className="markdown-container">
//                         <Markdown
//                           remarkPlugins={[remarkGfm]}
//                           rehypePlugins={[rehypeRaw, rehypeSanitize]}
//                           components={{
//                             code(props) {
//                               const { children, className, ...rest } = props;
//                               return (
//                                 <code
//                                   className={`${className} text-primary bg-background rounded px-1.5 py-0.5`}
//                                   {...rest}
//                                 >
//                                   {children}
//                                 </code>
//                               );
//                             },
//                             pre(props) {
//                               return (
//                                 <pre
//                                   className="text-primary bg-primary overflow-x-auto rounded-md p-4 text-sm"
//                                   {...props}
//                                 />
//                               );
//                             },
//                           }}
//                         >
//                           {message.text || ""}
//                         </Markdown>
//                       </div>
//                     </Card>
//                     {message.role === "assistant" && <CopyButton message={message.text} />}
//                   </div>
//                 ))}
//                 {isLoading && (
//                   <Card className="inline-block items-start rounded-xl px-3 py-1 pb-0">
//                     <MessageLoading />
//                   </Card>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
