"use client";

import { Loader2, Send, Copy, ArrowUp, ArrowDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import MessageLoading from "@/components/ui/message-loading";

import TopTrackingbar from "@/components/chatpage/TopTrackingBar";
import Sidebar from "@/components/chatpage/SidebarNav";
import BackToBottomBtn from "@/components/chatpage/BackToBottomBtn";
import MobileTutorial from "@/components/chatpage/MobileTutorial";
import TutorialHelper from "@/components/chatpage/TutorialHelper";

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

// Role indicator component
function RoleIndicator({ detectedRole }) {
  // Don't render anything if role is undefined, null, or "unknown"
  if (!detectedRole || detectedRole === "unknown") return null;

  const roleText = detectedRole === "arbetstagare" ? "Arbetstagare" : "Arbetsgivare";
  const roleColor = detectedRole === "arbetstagare" ? "text-blue-500" : "text-green-500";

  return (
    <div className="bg-muted text-muted-foreground mb-2 flex items-center gap-2 rounded-md px-3 py-1 text-sm">
      <span className="text-xs">Detekterad roll:</span>
      <span className={`font-medium ${roleColor}`}>{roleText}</span>
    </div>
  );
}

export default function ChatComponent({ steps, historyEndpoint, welcomeEndpoint, type }) {
  // Use environment variable or default to localhost
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const [detectedUserRole, setDetectedUserRole] = useState(null);

  const [interviewCurrentStep, setInterviewCurrentStep] = useState("step-1");
  const [interviewCompletedSteps, setInterviewCompletedSteps] = useState([]);
  const [applicationCurrentStep, setApplicationCurrentStep] = useState("step-1");
  const [applicationCompletedSteps, setApplicationCompletedSteps] = useState([]);

  const [cookieConsent, setCookieConsent] = useState(undefined);
  const [historiesLoaded, setHistoriesLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Check for mobile and sidebar state
  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      setIsSidebarOpen(!isNowMobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Tutorial handlers
  const handleRestartTutorial = () => {
    setShowTutorial(true);
  };

  // Check if we should show tutorial on mobile
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenMobileTutorial");
    if (!hasSeenTutorial && isMobile && isHydrated) {
      // Small delay to ensure components are rendered
      setTimeout(() => {
        setShowTutorial(true);
      }, 1000);
    }
  }, [isMobile, isHydrated]);

  const getLocalStorageKeys = (type) => {
    if (type === "interview") {
      return {
        currentStepKey: "interviewCurrentStep",
        completedStepsKey: "interviewCompletedSteps",
        userRoleKey: "userRole",
      };
    } else {
      return {
        currentStepKey: "applicationCurrentStep",
        completedStepsKey: "applicationCompletedSteps",
        userRoleKey: "userRole",
      };
    }
  };
  // Determine which state to use based on type
  const currentStep = type === "interview" ? interviewCurrentStep : applicationCurrentStep;
  const setCurrentStep = type === "interview" ? setInterviewCurrentStep : setApplicationCurrentStep;
  const completedSteps = type === "interview" ? interviewCompletedSteps : applicationCompletedSteps;
  const setCompletedSteps =
    type === "interview" ? setInterviewCompletedSteps : setApplicationCompletedSteps;

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
      const { currentStepKey, completedStepsKey, userRoleKey } = getLocalStorageKeys(type);

      const savedStep = localStorage.getItem(currentStepKey);
      if (savedStep) {
        setCurrentStep(savedStep);
      }

      const savedCompletedSteps = localStorage.getItem(completedStepsKey);
      if (savedCompletedSteps) {
        try {
          const parsedSteps = JSON.parse(savedCompletedSteps);
          if (Array.isArray(parsedSteps)) {
            setCompletedSteps(parsedSteps);
          }
        } catch (e) {
          console.error(`Error parsing ${completedStepsKey} from localStorage:`, e);
          localStorage.removeItem(completedStepsKey);
        }
      }

      // Load detected role from localStorage
      const savedRole = localStorage.getItem(userRoleKey);
      if (savedRole) {
        if (savedRole !== "unknown") {
          setDetectedUserRole(savedRole);
        } else {
          setDetectedUserRole(null);
        }
      }
      setIsHydrated(true);
    }
  }, [type, setCurrentStep, setCompletedSteps]);

  // Update localStorage when states change
  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      const { currentStepKey } = getLocalStorageKeys(type);
      localStorage.setItem(currentStepKey, currentStep);
    }
  }, [currentStep, isHydrated, type]);

  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      const { completedStepsKey } = getLocalStorageKeys(type);
      localStorage.setItem(completedStepsKey, JSON.stringify(completedSteps));
    }
  }, [completedSteps, isHydrated, type]);

  // Update localStorage when detected role changes
  useEffect(() => {
    if (
      isHydrated &&
      typeof window !== "undefined" &&
      detectedUserRole &&
      detectedUserRole !== "unknown"
    ) {
      const { userRoleKey } = getLocalStorageKeys(type);
      localStorage.setItem(userRoleKey, detectedUserRole);
    }
  }, [detectedUserRole, isHydrated, type]);

  // Handle chat reset flag
  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      const resetFlag = localStorage.getItem(`${type}ChatReset`);

      if (resetFlag === "true") {
        console.log(`Detected ${type} chat reset flag, rehydrating component`);

        // Clear histories for this chat type
        const resetHistories = { ...chatHistories };
        for (const stepId in resetHistories) {
          resetHistories[stepId] = [];
        }
        setChatHistories(resetHistories);

        // Reset to step 1
        setCurrentStep("step-1");
        setCompletedSteps([]);

        // Remove the flag so we don't repeat this on next render
        localStorage.removeItem(`${type}ChatReset`);

        // Force refresh of welcome messages
        setHistoriesLoaded(false);
      }
    }
  }, [isHydrated, type]);

  const currentStepData = steps.find((step) => step.id === currentStep);
  const heading = currentStepData?.heading || "Chat";

  // Reference to message container for scrolling
  const messageContainerRef = useRef(null);

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

  // function to get combined history for a user
  async function getUserHistory(userId) {
    try {
      const response = await fetch(`${BASE_URL}${historyEndpoint}/user/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user history");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching combined history:", error);
      return [];
    }
  }

  // Load ALL histories ONCE when component hydrates
  useEffect(() => {
    if (!isHydrated || historiesLoaded) return;

    async function loadAllHistories() {
      const userId = localStorage.getItem("userId");

      const newHistories = {};
      // Initialize all steps first
      steps.forEach((step) => {
        newHistories[step.id] = [];
      });

      // Load history for ALL steps at once
      for (const step of steps) {
        const stepId = step.id;
        try {
          const url = `${BASE_URL}${historyEndpoint}/${stepId}?userId=${userId}`;
          // console.log(`Loading history for step ${stepId}:`, url);

          const response = await fetch(url);

          if (response.ok) {
            const data = await response.json();
            // console.log(`Step ${stepId} data:`, data);

            if (Array.isArray(data) && data.length > 0) {
              // Check if the data contains actual conversation or just welcome message
              const hasConversation =
                data.length > 1 || (data.length === 1 && data[0].role === "user");

              if (hasConversation) {
                // Normalize the message format
                newHistories[stepId] = data.map((msg) => ({
                  role: msg.role || "assistant",
                  text: msg.text || msg.content || "",
                }));
                // console.log(`Loaded ${data.length} messages for step ${stepId}`);
              } else {
                // Only welcome message or empty, fetch fresh welcome
                // console.log(`Step ${stepId} has only welcome message, fetching fresh welcome`);
                await loadWelcomeMessage(stepId, newHistories);
              }
            } else {
              // Empty history, fetch welcome message
              // console.log(`Step ${stepId} has no history, fetching welcome message`);
              await loadWelcomeMessage(stepId, newHistories);
            }
          } else {
            console.error(`Failed to load step ${stepId}: ${response.status}`);
            // Fetch welcome message as fallback
            await loadWelcomeMessage(stepId, newHistories);
          }
        } catch (error) {
          console.error(`Error loading step ${stepId}:`, error);
          // Fetch welcome message as fallback
          await loadWelcomeMessage(stepId, newHistories);
        }
      }

      // console.log("Final newHistories:", newHistories);
      setChatHistories(newHistories);
      setHistoriesLoaded(true);
    }

    // Helper function to load welcome messages with role support
    async function loadWelcomeMessage(stepId, newHistories) {
      try {
        // Check localStorage directly for most up-to-date role
        const storedRole = localStorage.getItem("userRole");
        const roleToUse = storedRole || detectedUserRole;

        // Include role in the welcome request if we have it
        const roleParam = roleToUse ? `?role=${roleToUse}` : "";
        const welcomeResponse = await fetch(`${BASE_URL}${welcomeEndpoint}/${stepId}${roleParam}`);

        if (welcomeResponse.ok) {
          const welcomeData = await welcomeResponse.json();
          newHistories[stepId] = [{ role: "assistant", text: welcomeData.message }];
          console.log(
            `Loaded welcome message for step ${stepId} with role: ${roleToUse || "default"}`,
          );
        } else {
          console.error(`Failed to fetch welcome for step ${stepId}: ${welcomeResponse.status}`);
          newHistories[stepId] = [{ role: "assistant", text: "Hej! Hur kan jag hjälpa dig idag?" }];
        }
      } catch (welcomeError) {
        console.error(`Error fetching welcome for step ${stepId}:`, welcomeError);
        newHistories[stepId] = [{ role: "assistant", text: "Hej! Hur kan jag hjälpa dig idag?" }];
      }
    }

    loadAllHistories();
  }, [
    isHydrated,
    historiesLoaded,
    BASE_URL,
    historyEndpoint,
    welcomeEndpoint,
    steps,
    detectedUserRole,
  ]);

  // Navigate to a different step
  const navigateToStep = async (stepId) => {
    // Set local state for step change
    setCurrentStep(stepId);

    // Update localStorage
    if (typeof window !== "undefined") {
      const { currentStepKey } = getLocalStorageKeys(type);
      localStorage.setItem(currentStepKey, stepId);

      // Get the current role directly from localStorage
      const userRole = localStorage.getItem("userRole");

      if (userRole && userRole !== "unknown") {
        // First update the detected role state to match localStorage
        if (userRole !== detectedUserRole) {
          setDetectedUserRole(userRole);
        }

        // Get the current chat history for the target step
        const targetStepHistory = chatHistories[stepId] || [];

        // Only load welcome message if this step has just a welcome message or is empty
        if (targetStepHistory.length <= 1) {
          try {
            // Directly fetch new welcome message with role
            const welcomeResponse = await fetch(
              `${BASE_URL}${welcomeEndpoint}/${stepId}?role=${userRole}`,
            );

            if (welcomeResponse.ok) {
              const welcomeData = await welcomeResponse.json();

              // Update just this step's welcome message
              setChatHistories((prev) => ({
                ...prev,
                [stepId]: [{ role: "assistant", text: welcomeData.message }],
              }));

              console.log(`Updated welcome message for step ${stepId} with role: ${userRole}`);
            } else {
              console.error(
                `Failed to update welcome for step ${stepId}: ${welcomeResponse.status}`,
              );
            }
          } catch (error) {
            console.error(`Error updating welcome for step ${stepId}:`, error);
          }
        }
      }
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
          const { completedStepsKey } = getLocalStorageKeys(type);
          localStorage.setItem(completedStepsKey, JSON.stringify(updatedCompletedSteps));
        }
      }

      if (currentIndex < stepOrder.length - 1) {
        const nextStep = stepOrder[currentIndex + 1];
        setCurrentStep(nextStep);

        if (typeof window !== "undefined") {
          const { currentStepKey } = getLocalStorageKeys(type);
          localStorage.setItem(currentStepKey, nextStep);
        }
      }
    }
  };
  useEffect(() => {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      const styleEl = document.createElement("style");
      styleEl.innerHTML = `
      /* iOS WebKit specific fixes */
      body {
        -webkit-overflow-scrolling: touch;
      }
      
      /* Prevent iOS from shifting fixed elements */
      .ios-fixed-container {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        transform: translateZ(0) !important;
        -webkit-transform: translateZ(0) !important;
        -webkit-backface-visibility: hidden !important;
        backface-visibility: hidden !important;
      }
      
      /* Ensure iOS respects centering */
      .ios-center-content {
        position: relative !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        -webkit-transform: translateX(-50%) !important;
      }
      
      /* Prevent iOS viewport issues */
      .ios-textarea-container {
        position: relative !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      
      /* iOS Safari viewport height fix */
      @supports (-webkit-touch-callout: none) {
        .ios-fixed-container {
          height: 22vh !important;
          min-height: 22vh !important;
        }
      }
    `;

      document.head.appendChild(styleEl);

      return () => {
        if (document.head.contains(styleEl)) {
          document.head.removeChild(styleEl);
        }
      };
    }
  }, []);

  // Send user message for current step with role detection support
  async function handleSendMessage() {
    if (!message.trim()) return;

    setIsLoading(true);

    const updatedHistory = [...currentChatHistory, { role: "user", text: message }];

    // Update chat immediately with user message
    setChatHistories((prevHistories) => ({
      ...prevHistories,
      [currentStep]: updatedHistory,
    }));

    setMessage("");

    try {
      const userId = localStorage.getItem("userId");
      const userRole = localStorage.getItem("userRole") || detectedUserRole;

      const isFirstUserMessage =
        currentChatHistory.length === 1 && currentChatHistory[0].role === "assistant";

      const shouldDetectRole =
        currentStep === "step-1" && (!userRole || userRole === "unknown") && !isFirstUserMessage;

      // Get previous context from earlier steps
      let previousContext = [];
      try {
        const allUserHistory = await getUserHistory(userId);
        previousContext = allUserHistory.filter((msg) => msg.step !== currentStep).slice(-5);
      } catch (err) {
        console.error("Could not fetch previous context:", err);
      }

      const chatEndpoint =
        type === "interview" ? `${BASE_URL}/chat/interview/` : `${BASE_URL}/chat`;

      const requestBody = {
        message,
        currentStep,
        userId: userId || null,
        detectRole: shouldDetectRole,
        existingRole: userRole || "unknown",
        previousContext,
      };

      const response = await fetch(chatEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      // SIMPLIFIED ROLE HANDLING - Only update if role is actually detected
      let finalRole = detectedUserRole;

      // Only update role if we have a clear detection AND we're in step-1
      if (data.detectedRole && data.detectedRole !== "unknown" && currentStep === "step-1") {
        finalRole = data.detectedRole;

        // Update localStorage immediately
        localStorage.setItem("userRole", finalRole);
        setDetectedUserRole(finalRole);

        console.log(`Role confirmed and updated to: ${finalRole}`);

        // Refresh other step welcome messages in background (non-blocking)
        refreshWelcomeMessagesWithRole(finalRole).catch((error) => {
          console.error("Error refreshing welcome messages:", error);
        });
      }

      // Update chat with AI response
      setChatHistories((prevHistories) => ({
        ...prevHistories,
        [currentStep]: [...updatedHistory, { role: "assistant", text: data.message }],
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      // Show error message to user
      setChatHistories((prevHistories) => ({
        ...prevHistories,
        [currentStep]: [
          ...updatedHistory,
          {
            role: "assistant",
            text: "Ett fel uppstod. Försök igen.",
          },
        ],
      }));
    } finally {
      setIsLoading(false);
    }
  }

  // Function to refresh welcome messages when role changes
  async function refreshWelcomeMessagesWithRole(newRole) {
    try {
      console.log(`Refreshing welcome messages with role: ${newRole}`);

      // Track which steps need updating
      const stepsToUpdate = {};

      // First determine which steps need updating (only those with welcome messages)
      Object.keys(chatHistories).forEach((stepId) => {
        // Skip current step - it's already handled separately
        if (stepId === currentStep) return;

        const stepHistory = chatHistories[stepId];

        // Only update steps with just a welcome message or empty history
        if (
          !stepHistory ||
          stepHistory.length === 0 ||
          (stepHistory.length === 1 && stepHistory[0].role === "assistant")
        ) {
          stepsToUpdate[stepId] = true;
        }
      });

      // If no steps need updating, exit early
      if (Object.keys(stepsToUpdate).length === 0) {
        console.log("No welcome messages need refreshing");
        return;
      }

      const updatePromises = Object.keys(stepsToUpdate).map(async (stepId) => {
        try {
          const welcomeResponse = await fetch(
            `${BASE_URL}${welcomeEndpoint}/${stepId}?role=${newRole}`,
          );

          if (welcomeResponse.ok) {
            const welcomeData = await welcomeResponse.json();
            console.log(`Updated welcome message for step ${stepId} with role: ${newRole}`);

            // Return the step ID and new welcome message
            return {
              stepId,
              message: welcomeData.message,
              success: true,
            };
          } else {
            console.error(`Failed to update welcome for step ${stepId}: ${welcomeResponse.status}`);
            return { stepId, success: false };
          }
        } catch (error) {
          console.error(`Error updating welcome for step ${stepId}:`, error);
          return { stepId, success: false };
        }
      });

      // Wait for all fetches to complete
      const results = await Promise.all(updatePromises);

      // Filter successful updates and create update object
      const successfulUpdates = results.filter((result) => result.success);

      if (successfulUpdates.length > 0) {
        // Use functional update to ensure we have latest state
        setChatHistories((prevHistories) => {
          // Create a new object to avoid mutations
          const newHistories = { ...prevHistories };

          // Apply each successful update
          successfulUpdates.forEach(({ stepId, message }) => {
            newHistories[stepId] = [{ role: "assistant", text: message }];
          });

          return newHistories;
        });

        console.log(`Successfully refreshed ${successfulUpdates.length} welcome messages`);
      } else {
        console.log("No welcome messages were successfully updated");
      }
    } catch (error) {
      console.error("Error in refreshWelcomeMessagesWithRole:", error);
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
      <div className="bg-background flex h-[100vh] w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Calculate sidebar width for positioning
  const sidebarOffset = !isMobile && isSidebarOpen ? 5 : 0;

  return (
    <div className="bg-background relative flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Mobile Tutorial */}
      {showTutorial && (
        <MobileTutorial
          onComplete={() => {
            setShowTutorial(false);
          }}
        />
      )}

      {/* Interactive Sidebar */}
      <Sidebar
        currentStep={currentStep}
        completedSteps={completedSteps}
        onNavigate={navigateToStep}
        type={type}
        onSidebarToggle={setIsSidebarOpen}
      />

      {/* Main content area  */}
      <main
        className="relative flex w-full flex-col"
        style={{
          // DESKTOP: Adjust for sidebar
          marginLeft: !isMobile ? `${sidebarOffset}px` : "0px",
          width: !isMobile ? `calc(100% - ${sidebarOffset}px)` : "100%",
        }}
      >
        {/* Scrollable chat area */}
        <div className="progress-container">
          <TopTrackingbar
            heading={heading}
            currentStep={currentStep}
            navigateToStep={navigateToStep}
            completedSteps={completedSteps}
            completeCurrentStep={completeCurrentStep}
            steps={stepsId}
          />
        </div>

        <div
          className="darkScroll chat-messages relative w-full flex-1 overflow-y-auto pb-50"
          ref={messageContainerRef}
        >
          {/* Role Indicator */}
          <div className="mx-auto max-w-3xl px-3">
            <RoleIndicator detectedRole={detectedUserRole} />
          </div>

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

        {/* Textarea */}
        <div
          className={`${
            isMobile ? "ios-fixed-container" : "absolute bottom-0"
          } z-30 h-[22%] w-full`}
        >
          <div className="ios-center-content mx-auto w-full max-w-4xl">
            <div className="ios-textarea-container relative h-48 pt-12">
              <BackToBottomBtn containerRef={messageContainerRef} threshold={30} className="" />
              <div className="bg-background h-full">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Skriv ett meddelande..."
                  className="border-border bg-background darkScroll h-32 w-full resize-none overflow-y-auto rounded-xl p-3 pr-16 shadow-lg"
                  disabled={showTutorial}
                />
                <div className="absolute right-2 bottom-6">
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !message.trim() || showTutorial}
                    size="icon"
                    className="bg-primary h-10 w-10 rounded-xl"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 left-0 flex justify-center">
              {!cookieConsent && (
                <div className="text-foreground/50 absolute -top-1 flex w-full justify-center text-center md:-top-8">
                  <small className="bg-background md:bg-background/90 border-border/50 rounded border-1 px-2 py-1">
                    För bästa chattupplevelse och för att spara din chatt­historik,{" "}
                    <Link href="/cookies" className="hover:text-primary underline">
                      acceptera cookies
                    </Link>
                  </small>
                </div>
              )}
            </div>
            <TutorialHelper onRestartTutorial={handleRestartTutorial} />
          </div>
        </div>
      </main>
    </div>
  );
}
