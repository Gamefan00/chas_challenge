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
  const BASE_URL = "localhost";
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(undefined);

  // Load existing messages on pageload, should be done through localstorage maybe?
  useEffect(() => {
    async function getMessages() {
      const response = await fetch(`http://${BASE_URL}:4000/get_messages`, {
        method: "GET",
      });
      const data = await response.json();
      setMessages(data.data);
    }
    getMessages();
  }, []);

  // Send user prompt to the assistant api and await response
  async function sendPrompt() {
    setIsLoading(true);
    console.log(`Sending prompt...\nPrompt: ${prompt}`);

    const response = await fetch(`http://${BASE_URL}:4000/output_text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    console.log("Response from server:", data);
    setMessages(data.data);
    setPrompt("");
    setIsLoading(false);
  }

  return (
    <div className="bg-background flex w-full flex-col px-4 md:pb-20">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center gap-12 md:gap-20">
        <div className="flex min-h-screen w-full flex-col items-center justify-between gap-4">
          {/* Render messages */}
          <div className="chat-messages flex w-full max-w-4xl flex-col gap-4 !text-sm">
            {messages &&
              [...messages].reverse().map((message) => (
                <div
                  key={message.id}
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
                            <code
                              className={`${className} bg-muted rounded px-1.5 py-0.5`}
                              {...rest}
                            >
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
                      {message.content[0]?.text?.value || ""}
                    </Markdown>
                  </div>
                </div>
              ))}
          </div>

          {/* User input area */}

          <div className="mb-24 flex w-full flex-col items-center gap-4">
            <Textarea
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-card w-full max-w-xl"
              placeholder="Hur kan jag hjälpa dig?"
              value={prompt}
            />
            <Button onClick={sendPrompt} className="btn btn-primary">
              {isLoading ? <Loader2 className="animate-spin" /> : "Skicka"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
