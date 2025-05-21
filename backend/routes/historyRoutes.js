import express from "express";
import query from "../utils/supabaseQuery.js";

const router = express.Router();

// Chat history for application bot
router.post("/", async (req, res) => {
  const { userId, currentStep, currentChatHistory } = req.body;

  try {
    if (!userId || !currentStep) {
      return res.status(400).json({ error: "Missing userId or currentStep" });
    }

    // Make sure currentChatHistory is properly serialized
    let chatHistoryToStore;

    if (typeof currentChatHistory === "string") {
      try {
        JSON.parse(currentChatHistory); // Just to test if it's valid
        chatHistoryToStore = currentChatHistory;
      } catch (parseError) {
        console.error("Invalid JSON in currentChatHistory:", parseError);
        return res.status(400).json({ error: "Invalid chat history format" });
      }
    } else {
      // It's an object, stringify it
      chatHistoryToStore = JSON.stringify(currentChatHistory);
    }

    // Update or insert the chat history for this specific step
    await query(
      `INSERT INTO chat_histories_application (user_id, step_id, history) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id, step_id) 
       DO UPDATE SET history = $3`,
      [userId, currentStep, chatHistoryToStore]
    );

    res.json({
      message: "Chat history saved successfully for step " + currentStep,
    });
  } catch (error) {
    console.error("Error saving chat history:", error);
    res.status(500).json({ error: "Failed to save chat history" });
  }
});

router.get("/:stepId", async (req, res) => {
  try {
    const { stepId } = req.params;
    const userId = req.query.userId; // Pass userId as query parameter from frontend

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Get chat history from database
    const historyResult = await query(
      "SELECT history FROM chat_histories_application WHERE user_id = $1 AND step_id = $2",
      [userId, stepId]
    );

    if (historyResult.length > 0 && historyResult[0].history) {
      let allHistory;

      // Fix for parsing issue - handle both string and object formats
      if (typeof historyResult[0].history === "string") {
        try {
          allHistory = JSON.parse(historyResult[0].history);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          // If it's already a string representation of [object Object], return empty array
          return res.json([]);
        }
      } else {
        // It's already an object
        allHistory = historyResult[0].history;
      }

      // Check if allHistory is an array
      if (!Array.isArray(allHistory)) {
        console.error("History is not an array:", allHistory);
        return res.json([]);
      }

      // Return formatted history
      const formattedHistory = allHistory.map((msg) => {
        // Handle different message structures
        if (msg.content && Array.isArray(msg.content)) {
          return {
            role: msg.role,
            content: msg.content[0]?.text || "",
          };
        } else {
          return {
            role: msg.role,
            content: msg.text || msg.content || "",
          };
        }
      });

      res.json(formattedHistory);
    } else {
      // No history found
      res.json([]);
    }
  } catch (error) {
    console.error(`Error fetching history for step:`, error);
    res.status(500).json({ error: "Failed to retrieve chat history" });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete all history for this user
    await query("DELETE FROM chat_histories_application WHERE user_id = $1", [
      userId,
    ]);

    res.json({ message: "History cleared successfully" });
  } catch (error) {
    console.error("Error clearing history:", error);
    res.status(500).json({ error: "Failed to clear history" });
  }
});

////////////////////////////////////
// Chat history for interview bot //
////////////////////////////////////

router.post("/interview", async (req, res) => {
  const { userId, currentStep, currentChatHistory } = req.body;

  try {
    if (!userId || !currentStep) {
      return res.status(400).json({ error: "Missing userId or currentStep" });
    }

    // Make sure currentChatHistory is properly serialized
    let chatHistoryToStore;

    if (typeof currentChatHistory === "string") {
      try {
        JSON.parse(currentChatHistory); // Just to test if it's valid
        chatHistoryToStore = currentChatHistory;
      } catch (parseError) {
        console.error("Invalid JSON in currentChatHistory:", parseError);
        return res.status(400).json({ error: "Invalid chat history format" });
      }
    } else {
      // It's an object, stringify it
      chatHistoryToStore = JSON.stringify(currentChatHistory);
    }

    // Update or insert the chat history for this specific step
    await query(
      `INSERT INTO chat_histories_interview_test (user_id, step_id, history) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id, step_id) 
       DO UPDATE SET history = $3`,
      [userId, currentStep, chatHistoryToStore]
    );

    res.json({
      message: "Chat history saved successfully for step " + currentStep,
    });
  } catch (error) {
    console.error("Error saving chat history:", error);
    res.status(500).json({ error: "Failed to save chat history" });
  }
});

router.get("/interview/:stepId", async (req, res) => {
  try {
    const { stepId } = req.params;
    const userId = req.query.userId; // Pass userId as query parameter from frontend

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Get chat history from database
    const historyResult = await query(
      "SELECT history FROM chat_histories_interview_test WHERE user_id = $1 AND step_id = $2",
      [userId, stepId]
    );

    if (historyResult.length > 0 && historyResult[0].history) {
      let allHistory;

      // Fix for parsing issue - handle both string and object formats
      if (typeof historyResult[0].history === "string") {
        try {
          allHistory = JSON.parse(historyResult[0].history);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          // If it's already a string representation of [object Object], return empty array
          return res.json([]);
        }
      } else {
        // It's already an object
        allHistory = historyResult[0].history;
      }

      // Check if allHistory is an array
      if (!Array.isArray(allHistory)) {
        console.error("History is not an array:", allHistory);
        return res.json([]);
      }

      // Return formatted history
      const formattedHistory = allHistory.map((msg) => {
        // Handle different message structures
        if (msg.content && Array.isArray(msg.content)) {
          return {
            role: msg.role,
            content: msg.content[0]?.text || "",
          };
        } else {
          return {
            role: msg.role,
            content: msg.text || msg.content || "",
          };
        }
      });

      res.json(formattedHistory);
    } else {
      // No history found
      res.json([]);
    }
  } catch (error) {
    console.error(`Error fetching history for step:`, error);
    res.status(500).json({ error: "Failed to retrieve chat history" });
  }
});

router.delete("/interview/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete all history for this user
    await query(
      "DELETE FROM chat_histories_interview_test WHERE user_id = $1",
      [userId]
    );

    res.json({ message: "History cleared successfully" });
  } catch (error) {
    console.error("Error clearing history:", error);
    res.status(500).json({ error: "Failed to clear history" });
  }
});

export default router;
