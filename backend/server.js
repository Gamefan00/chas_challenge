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
import aiModelConfigRoutes from "./routes/settingsRoutes/aiModelConfigRoutes.js";
import aiBehaviorConfigRoutes from "./routes/settingsRoutes/aiBehaviorConfigRoutes.js";
import { initializeConversationSettings } from "./utils/initializeConversationSettings.js";
import query from "./utils/supabaseQuery.js";

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
initializeConversationSettings();

// Routes
app.use("/chat", chatRoutes);
app.use("/history", historyRoutes);
app.use("/clear", clearRoutes);
app.use("/getUserId", getUserIdRoutes);
app.use("/auth", authRoutes);
app.use("/settingsRoutes/aiModelConfig", aiModelConfigRoutes);
app.use("/settingsRoutes/aiBehaviorConfigRoutes", aiBehaviorConfigRoutes);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Function to keep the database connection alive
const keepDatabaseAlive = async () => {
  try {
    const result = await query("SELECT 1");
    console.log("Database keep-alive ping successful");
  } catch (error) {
    console.error("Database keep-alive ping failed:", error);
  }

  // Run every 5 minutes
  setTimeout(keepDatabaseAlive, 5 * 60 * 1000);
};

// Start the keep-alive mechanism
keepDatabaseAlive();

// Graceful shutdown
const gracefulShutdown = () => {
  console.log("Shutting down gracefully...");

  // Close server
  server.close(() => {
    console.log("Express server closed.");

    // Import pool from supabaseQuery to close it
    import("./utils/supabaseQuery.js")
      .then((supabaseModule) => {
        const pool = supabaseModule.default.pool;
        if (pool && pool.end) {
          pool.end(() => {
            console.log("Database connections closed");
            process.exit(0);
          });
        } else {
          console.log("No database connections to close");
          process.exit(0);
        }
      })
      .catch((err) => {
        console.error("Error importing supabaseQuery module:", err);
        process.exit(1);
      });
  });

  // Force exit after 5 seconds if connections don't close properly
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 5000);
};

// Listen for termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Prevent unhandled promise rejections from crashing the server
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
