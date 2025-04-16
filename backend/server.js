import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";

// Load .env file before server starts, needed for dev environment
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Start server
app.listen(PORT, () => {
  console.log("Started on port: " + PORT);
});
