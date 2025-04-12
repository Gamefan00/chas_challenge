"use client";

import { useState } from "react";

export default function ChatBot() {
  const BASE_URL = "localhost";
  const [prompt, setPrompt] = useState("");
  const [outputText, setOutputText] = useState("Output here.");

  async function sendPrompt() {
    console.log(`Sending prompt...\nPrompt: ${prompt}`);

    const response = await fetch(`http://${BASE_URL}:4000/output_text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    console.log("Response from server:", data);

    setOutputText(data.output_text);
    setPrompt("");
  }

  return (
    <div className="bg-background flex w-full flex-col px-4 py-12 md:pb-20">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center gap-12 md:gap-20">
        <div className="flex w-full flex-col items-center gap-4">
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            className="textarea w-full max-w-md"
            placeholder="Ask away..."
            value={prompt}
          ></textarea>
          <button onClick={sendPrompt} className="btn btn-primary">
            Send
          </button>
          <p>{outputText}</p>
        </div>
      </div>
    </div>
  );
}
