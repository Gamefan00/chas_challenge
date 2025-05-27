import express from "express";
import query from "../utils/supabaseQuery.js";

const router = express.Router();

// Delete application chat history
router.delete("/application/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Clearing application history for userId:", userId);

    if (!userId) {
      return res.status(400).json({ error: "Missing userId parameter" });
    }
    // Delete all history for this user from application table
    const result = await query(
      "DELETE FROM chat_histories_application_test WHERE user_id = $1",
      [userId]
    );

    console.log("Application delete result:", result);
    console.log(
      "Application chat history cleared successfully for user:",
      userId
    );

    res.json({
      message: "Application chat history cleared successfully",
      userId: userId,
      deletedRecords: result.rowCount || 0,
    });
  } catch (error) {
    console.error("Error clearing application history:", error);
    res.status(500).json({
      error: "Failed to clear application history",
      details: error.message,
    });
  }
});

// Delete interview chat history
router.delete("/interview/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Clearing interview history for userId:", userId);

    if (!userId) {
      return res.status(400).json({ error: "Missing userId parameter" });
    }

    // Delete all history for this user from interview table
    const result = await query(
      "DELETE FROM chat_histories_interview_test WHERE user_id = $1",
      [userId]
    );

    console.log("Interview delete result:", result);
    console.log(
      "Interview chat history cleared successfully for user:",
      userId
    );

    res.json({
      message: "Interview chat history cleared successfully",
      userId: userId,
      deletedRecords: result.rowCount || 0,
    });
  } catch (error) {
    console.error("Error clearing interview history:", error);
    res.status(500).json({
      error: "Failed to clear interview history",
      details: error.message,
    });
  }
});

export default router;
