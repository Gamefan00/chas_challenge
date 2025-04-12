import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import OpenAI from 'openai';

// Load .env file before server starts, needed for dev environment
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(cors());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/output_text', async (req, res) => {
  const { prompt } = req.body;

  const openaiResponse = await openai.responses.create({
    model: 'gpt-4o-mini',
    input: prompt,
  });

  res.json(openaiResponse);
});

app.listen(PORT, () => {
  console.log('Started on port: ' + PORT);
});
