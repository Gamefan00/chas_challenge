import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function askAssistant(userMessage) {
  try {
    // 1. Create a thread
    const thread = await openai.beta.threads.create();

    // 2. Add message in the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage,
    });
    // 3. Run the assistant on the thread
    let run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.ASSISTANT_ID,
    });
    // 4. Wait until the answer is finished

    // 5. Get answer
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find(
      (msg) => msg.role === "assistant"
    );
    
  } catch (error) {
    console.log("assistant error:", error);
    return "Something went wrong";
  }
}
