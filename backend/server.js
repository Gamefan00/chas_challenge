import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import chatRoutes from "./routes/chatRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import clearRoutes from "./routes/clearRoutes.js";
import getUserIdRoutes from "./routes/getUserIdRoute.js";
import authRoutes from "./routes/authRoutes.js";
import { initializeConversations } from "./utils/conversationManager.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Initialize conversations
initializeConversations();

// Routes
app.use("/chat", chatRoutes);
app.use("/history", historyRoutes);
app.use("/clear", clearRoutes);
app.use("/getUserId", getUserIdRoutes);
app.use("/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
