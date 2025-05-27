import express from "express";
import query from "../utils/supabaseQuery.js";
import { encrypt, decrypt } from "../utils/encryptionHelper.js";

const router = express.Router();

// Helper functions to avoid code duplication
const saveHistory = async (req, res, tableName, chatType) => {
  const { userId, currentStep, currentChatHistory } = req.body;

  try {
    if (!userId || !currentStep) {
      return res.status(400).json({ error: "Missing userId or currentStep" });
    }

    // Encrypt chat history before storing
    const encryptedHistory = encrypt(currentChatHistory);

    // Store the timestamp for auto-deletion tracking
    const now = new Date().toISOString();

    // Update or insert the encrypted chat history for this specific step
    await query(
      `INSERT INTO ${tableName} (user_id, step_id, history, created_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, step_id)
       DO UPDATE SET history = $3, created_at = $4`,
      [userId, currentStep, encryptedHistory, now]
    );

    res.json({
      message: `${chatType} chat history saved successfully for step ${currentStep}`,
    });
  } catch (error) {
    console.error(`Error saving ${chatType} chat history:`, error);
    res.status(500).json({ error: "Failed to save chat history" });
  }
};

const getUserHistory = async (req, res, tableName) => {
  try {
    const { userId } = req.params;

    // Get all user chat history ordered by step_id and created_at
    const historyResults = await query(
      `SELECT step_id, history, created_at
       FROM ${tableName}
       WHERE user_id = $1
       ORDER BY step_id ASC, created_at ASC`,
      [userId]
    );

    if (historyResults.length > 0) {
      try {
        // Process and combine all histories
        const allHistory = [];

        // Process each step's history
        for (const historyItem of historyResults) {
          const decryptedHistory = decrypt(historyItem.history);

          // Add debugging to see what's coming back
          console.log(
            `Step ${historyItem.step_id} decrypted history type:`,
            typeof decryptedHistory
          );
          console.log(`Is array:`, Array.isArray(decryptedHistory));

          if (Array.isArray(decryptedHistory)) {
            // Format messages and add step context
            const formattedMessages = decryptedHistory.map((msg) => {
              // Handle different message structures consistently
              let content = "";
              if (msg.content && Array.isArray(msg.content)) {
                content = msg.content[0]?.text || "";
              } else if (msg.text) {
                content = msg.text;
              } else if (typeof msg.content === "string") {
                content = msg.content;
              }

              return {
                role: msg.role || "assistant",
                content: content,
                step: historyItem.step_id,
              };
            });

            // Add to combined history
            allHistory.push(...formattedMessages);
          }
        }

        // Sort by original order (created_at of the history entries)
        const sortedHistory = allHistory.sort((a, b) => {
          // First by step
          if (a.step !== b.step) {
            return a.step.localeCompare(b.step);
          }
          // Then by position in the array (preserving conversation flow)
          return allHistory.indexOf(a) - allHistory.indexOf(b);
        });

        // Remove the temporary step field we added
        const finalHistory = sortedHistory.map(({ role, content }) => ({
          role,
          content,
        }));

        res.json(finalHistory);
      } catch (error) {
        console.error("Error processing history:", error);
        res.status(500).json({ error: "Failed to process chat history" });
      }
    } else {
      // No history found
      res.json([]);
    }
  } catch (error) {
    console.error(`Error fetching user history:`, error);
    res.status(500).json({ error: "Failed to retrieve chat history" });
  }
};

const getStepHistory = async (req, res, tableName, chatType) => {
  try {
    const { stepId } = req.params;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Get encrypted chat history from database
    const historyResult = await query(
      `SELECT history FROM ${tableName} WHERE user_id = $1 AND step_id = $2`,
      [userId, stepId]
    );

    if (historyResult.length > 0 && historyResult[0].history) {
      try {
        // Decrypt the history
        const decryptedHistory = decrypt(historyResult[0].history);
        console.log("decryptedHistory " + stepId + "\n", decryptedHistory);

        // Format history for client
        const formattedHistory = Array.isArray(decryptedHistory)
          ? decryptedHistory.map((msg) => {
              // Handle different message structures consistently
              let content = "";
              if (msg.content && Array.isArray(msg.content)) {
                content = msg.content[0]?.text || "";
              } else if (msg.text) {
                content = msg.text;
              } else if (typeof msg.content === "string") {
                content = msg.content;
              }

              return {
                role: msg.role || "assistant",
                text: content,
              };
            })
          : [];

        res.json(formattedHistory);
      } catch (decryptError) {
        console.error("Decryption error:", decryptError);
        res.status(500).json({ error: "Failed to decrypt chat history" });
      }
    } else {
      // No history found
      res.json([]);
    }
  } catch (error) {
    console.error(`Error fetching ${chatType} history for step:`, error);
    res.status(500).json({ error: "Failed to retrieve chat history" });
  }
};

// Application chat history routes
router.post("/", async (req, res) => {
  await saveHistory(req, res, "chat_histories_application_new", "Application");
});

router.get("/user/:userId", async (req, res) => {
  await getUserHistory(req, res, "chat_histories_application_new");
});

router.get("/:stepId", async (req, res) => {
  await getStepHistory(req, res, "chat_histories_application_new", "application");
});

// Interview chat history routes
router.post("/interview", async (req, res) => {
  await saveHistory(req, res, "chat_histories_interview_new", "Interview");
});

router.get("/interview/user/:userId", async (req, res) => {
  await getUserHistory(req, res, "chat_histories_interview_new");
});

router.get("/interview/:stepId", async (req, res) => {
  await getStepHistory(req, res, "chat_histories_interview_new", "interview");
});

export default router;
