"use client";

import { useState, useEffect } from "react";
import { client } from "@/util/openAI";

const roleMessages = {
  worker: {
    user: "Jag är arbetstagare",
    assistant:
      "Tack! För att vi ska kunna hjälpa dig på bästa sätt behöver vi veta mer om ditt behov av stöd på arbetsplatsen.",
    question:
      "Vilken typ av funktionsnedsättning har du? (Detta hjälper oss att ge dig rätt information och anpassa din ansökan efter Försäkringskassans krav.)",
    options: [
      {
        id: "physical",
        text: "Fysisk funktionsnedsättning (t.ex. rörelsehinder, behov av anpassade arbetsredskap)",
      },
      {
        id: "cognitive",
        text: "Kognitiv funktionsnedsättning (t.ex. ADHD, autism, behov av stöd för struktur)",
      },
      {
        id: "sensory",
        text: "Sensorisk funktionsnedsättning (t.ex. hörselnedsättning, synnedsättning)",
      },
      { id: "other", text: "Annat (Beskriv kort vad du behöver stöd med)" },
    ],
  },
  employer: {
    user: "Jag är arbetsgivare",
    assistant:
      "Bra val! Som arbetsgivare kan du ansöka om stöd för att anpassa arbetsplatsen för en anställd med funktionsnedsättning.",
    question:
      "Vilken typ av stöd behöver din anställde? (Välj det alternativ som bäst beskriver behovet.)",
    options: [
      {
        id: "workplace",
        text: "Anpassning av arbetsplatsen (t.ex. ergonomiska möbler, specialutrustning)",
      },
      {
        id: "technical",
        text: "Tekniska hjälpmedel (t.ex. programvara, kommunikationshjälpmedel)",
      },
      {
        id: "support",
        text: "Arbetsstöd och handledning (t.ex. mentor, extra stöd för arbetsuppgifter)",
      },
      { id: "other", text: "Annat (Beskriv kort vad den anställde behöver stöd med)" },
    ],
  },
};

const welcomeMessage = {
  role: "assistant",
  content:
    "Välkommen! Den här tjänsten hjälper dig att formulera en ansökan om arbetsplatsstöd till Försäkringskassan. Genom att svara på några frågor ser vi till att din ansökan uppfyller deras krav, vilket kan öka chansen att få stöd beviljat. För att börja, välj det alternativ som bäst beskriver dig:",
  buttons: [
    {
      id: "worker",
      text: "Jag ansöker för mig själv – Om du har en funktionsnedsättning och behöver stöd i ditt arbete.",
    },
    {
      id: "employer",
      text: "Jag ansöker som arbetsgivare – Om du vill hjälpa en anställd att få rätt stöd.",
    },
  ],
};

export default function Home() {
  const [userRole, setUserRole] = useState(null);
  const [userOption, setUserOption] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole && roleMessages[savedRole]) {
      setUserRole(savedRole);
      setMessages([{ role: "assistant", content: roleMessages[savedRole].assistant }]);
      const savedOption = localStorage.getItem("userOption");
      if (savedOption) {
        setUserOption(savedOption);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: roleMessages[savedRole].question,
            options: roleMessages[savedRole].options,
          },
        ]);
      }
    } else {
      setMessages([welcomeMessage]);
    }
  }, []);

  function handleRoleSelection(role) {
    setUserRole(role);
    localStorage.setItem("userRole", role);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: roleMessages[role].user },
      { role: "assistant", content: roleMessages[role].assistant },
      {
        role: "assistant",
        content: roleMessages[role].question,
        options: roleMessages[role].options,
      },
    ]);
  }

  function handleOptionSelection(optionId, optionText) {
    setUserOption(optionId);
    localStorage.setItem("userOption", optionId);

    setMessages((prev) => [
      ...prev.filter((msg) => !msg.options),
      { role: "user", content: optionText },
      {
        role: "assistant",
        content: `Tack för informationen! Du har valt: ${optionText}. Vad kan jag hjälpa dig med specifikt gällande detta?`,
      },
    ]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [...messages.filter((msg) => !msg.buttons && !msg.options), userMessage].map(
          (msg) => ({
            role: msg.role,
            content: msg.content,
          }),
        ),
        max_tokens: 50,
      });

      const botMessage = response.choices[0].message;
      setMessages((prev) => [...prev, { role: "assistant", content: botMessage.content }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "system", content: "Något gick fel, försök igen!" }]);
    } finally {
      setIsLoading(false);
    }
  }

  function resetRole() {
    setUserRole(null);
    setUserOption(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("userOption");
    setMessages([welcomeMessage]);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 font-sans text-gray-100">
      {/* Main content area */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
        {/* Chat interface */}
        <div className="flex h-full flex-1 flex-col">
          {/* Chat messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {messages.map((message, index) => (
              <div key={index} className="mb-6">
                {/* User messages */}
                {message.role === "user" && (
                  <div className="flex justify-end">
                    <div className="max-w-3/4 rounded-lg bg-blue-600 px-4 py-3">
                      <div className="whitespace-pre-wrap text-white">{message.content}</div>
                    </div>
                  </div>
                )}

                {/* Assistant messages */}
                {message.role === "assistant" && (
                  <div className="flex items-start">
                    <div className="mr-3 flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600">
                        <svg
                          className="h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="max-w-3/4 min-w-0 flex-1 rounded-lg bg-gray-700 px-4 py-3">
                      <div className="whitespace-pre-wrap text-gray-200">{message.content}</div>

                      {/* Option buttons for the first message */}
                      {message.buttons && !userRole && (
                        <div className="mt-4 flex flex-col space-y-2">
                          {message.buttons.map((button) => (
                            <button
                              key={button.id}
                              onClick={() => handleRoleSelection(button.id)}
                              className="w-full cursor-pointer rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-left text-gray-200 hover:bg-gray-600"
                            >
                              {button.text}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Follow-up option buttons */}
                      {message.options && !userOption && (
                        <div className="mt-4 flex flex-col space-y-2">
                          <div className="mb-2 text-left font-medium">{message.content}</div>
                          {message.options.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => handleOptionSelection(option.id, option.text)}
                              className="w-full cursor-pointer rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-left text-gray-200 hover:bg-gray-600"
                            >
                              • {option.text}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* System message (error) */}
                {message.role === "system" && (
                  <div className="flex justify-center">
                    <div className="rounded-lg bg-red-500 px-4 py-2">
                      <div className="text-white">{message.content}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="mr-3 flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600">
                      <svg
                        className="h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 rounded-lg bg-gray-700 px-4 py-3">
                    <div className="mt-2 flex space-x-1">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400"></div>
                      <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 delay-150"></div>
                      <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 delay-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-gray-700 px-4 py-4">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Skriv ett meddelande..."
                className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pr-12 pl-4 text-white focus:ring-1 focus:ring-gray-600 focus:outline-none"
                disabled={isLoading || !userRole || !userOption}
              />
              <button
                type="submit"
                className={`absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer ${
                  isLoading || input.trim() === "" || !userRole || !userOption
                    ? "text-gray-600"
                    : "text-gray-400 hover:text-white"
                }`}
                disabled={isLoading || input.trim() === "" || !userRole || !userOption}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </form>
            {userRole && (
              <div>
                <button
                  onClick={resetRole}
                  className="mt-3 cursor-pointer text-sm text-gray-400 hover:text-white"
                >
                  🔄 Byt roll
                </button>
              </div>
            )}
            <div className="mt-2 text-center text-xs text-gray-500">
              AI kan göra misstag. Överväg att kontrollera viktig information.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
