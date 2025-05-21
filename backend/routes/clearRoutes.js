import express from "express";
import query from "../utils/supabaseQuery.js";

const router = express.Router();
// Delete application chat history

router.delete("/application/:userId", async (req, res) => {
  try {
    const {userId} = req.params;
    console.log("userId:", userId);

    // Delete all history for this user
    await query("DELETE FROM chat_histories_application WHERE user_id = $1", [
      userId,
    ]);
    console.log("res", res);
    console.log("req", req);

    res.json({message: "Application chat history cleared successfully"});
    console.log("Application chat history cleared successfully");
  } catch (error) {
    console.error("Error clearing application history:", error);
    res.status(500).json({error: "Failed to clear application history"});
  }
});

// Delete interview chat history

router.delete("/interview/:userId", async (req, res) => {
  try {
    const {userId} = req.params;
    console.log("Deleting chat history for user:", userId);

    await query("DELETE FROM chat_histories_interview WHERE user_id = $1", [
      userId,
    ]);

    res.json({message: "Interview chat history cleared successfully"});
  } catch (error) {
    console.error("Error clearing interview history:", error);
    res.status(500).json({error: "Failed to clear interview history"});
  }
});

export default router;
