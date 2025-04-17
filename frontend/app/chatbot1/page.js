"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export default function ChatBot() {
  // Use environment variable or default to localhost
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "localhost:4000";
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);

  // Load existing history on pageload
  useEffect(() => {
    async function getHistory() {
      try {
        const response = await fetch(`http://${BASE_URL}/history`, {
          method: "GET",
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setMessageHistory(
            data.map((msg) => ({
              role: msg.role,
              text: msg.content,
            })),
          );
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    }
    getHistory();
  }, [BASE_URL]);

  // Send user prompt to the assistant api and await response
  async function handleSendMessage() {
    if (!message.trim()) return;

    setIsLoading(true);
    console.log(`Sending message: ${message}`);

    // Append user message to local message array
    const newHistory = [...messageHistory, { role: "user", text: message }];
    setMessageHistory(newHistory);
    setMessage(""); // Clear input right away for better UX

    try {
      const response = await fetch(`http://${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log("Response from server:", data);

      // Add assistant's response to message history
      setMessageHistory([
        ...newHistory,
        {
          role: "assistant",
          text: data.message, // Backend returns { message: "..." }
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally show error to user
      setMessageHistory([
        ...newHistory,
        {
          role: "assistant",
          text: "Sorry, there was an error processing your request. Please try again.",
        },
      ]);
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

  return (
    <div className="bg-background flex w-full flex-col px-4 md:pb-20">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center gap-12 md:gap-20">
        <div className="flex min-h-screen w-full flex-col items-center justify-between gap-4">
          {/* Render messages in chronological order (oldest first) */}
          <div className="chat-messages mt-12 flex w-full max-w-4xl flex-col gap-4 !text-sm">
            {messageHistory.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.role === "user"
                    ? "bg-primary user-message ml-auto"
                    : "bg-card text-card-foreground mr-auto"
                } max-w-3xl rounded-lg shadow-sm`}
              >
                <div className="markdown-container p-4">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      code(props) {
                        const { children, className, ...rest } = props;
                        return (
                          <code className={`${className} bg-muted rounded px-1.5 py-0.5`} {...rest}>
                            {children}
                          </code>
                        );
                      },
                      pre(props) {
                        return (
                          <pre
                            className="bg-muted overflow-x-auto rounded-md p-4 text-sm"
                            {...props}
                          />
                        );
                      },
                    }}
                  >
                    {message.text || ""}
                  </Markdown>
                </div>
              </div>
            ))}
          </div>

          {/* User input area */}
          <div className="mb-24 flex w-full flex-col items-center gap-4">
            <Textarea
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-card w-full max-w-xl"
              placeholder="Hur kan jag hjälpa dig?"
              value={message}
            />
            <Button
              onClick={handleSendMessage}
              className="btn btn-primary"
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Skicka"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
