import fetch from "node-fetch";
import query from "../utils/supabaseQuery.js";

export async function initializeConversationSettings() {
  const BASE_URL = process.env.API_URL || "http://localhost:4000";

  try {
    console.log("Fetching conversation settings from database...");

    const settingsResult = await query(
      `SELECT key, value FROM admin_settings WHERE category = $1`,
      ["AI-Behavior Configuration"]
    );

    if (!settingsResult || settingsResult.length === 0) {
      console.log("No settings found in database, using defaults");
      return;
    }

    console.log("Loading conversation settings from database...");

    // Parse the settings from the database
    const behaviorConfig = {};
    settingsResult.forEach((item) => {
      try {
        behaviorConfig[item.key] = JSON.parse(item.value);
      } catch (e) {
        behaviorConfig[item.key] = item.value;
      }
    });

    console.log("Conversation settings loaded successfully");

    // Initialize conversations with the loaded config
    // You may want to export these values or set them in a global context
    return behaviorConfig;
  } catch (error) {
    console.error("Error initializing conversation settings:", error);
  }
}

// // Run the initialization
// initializeConversationSettings();
