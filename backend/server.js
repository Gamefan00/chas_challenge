import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import OpenAI from 'openai';

// Load .env file before server starts, needed for dev environment
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Store thread ID
let threadId = null;

// Add user message to thread and send back the thread messages
app.post('/output_text', async (req, res) => {
  const { prompt } = req.body;

  // Check if a thread already exists and create a new one if not
  if (!threadId) {
    const thread = await openai.beta.threads.create();
    threadId = thread.id;
    console.log('Created new thread:', threadId);
  }

  // Add new message to thread
  const message = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: prompt,
  });

  // Run the assistant to generate a response
  let run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: process.env.ASSISTANT_ID,
  });

  // Get thread messages and send them to frontend when run is completed
  if (run.status === 'completed') {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    res.json(messages);
  } else {
    console.log(run.status);
  }
});

// Get thread messages on page load, should be done through localstorage maybe
app.get('/get_messages', async (req, res) => {
  if (!threadId) {
    return res.status(404).json({ error: 'Thread does not exist.' });
  }
  const messages = await openai.beta.threads.messages.list(threadId);
  res.json(messages);
});

// Start server
app.listen(PORT, () => {
  console.log('Started on port: ' + PORT);
});
