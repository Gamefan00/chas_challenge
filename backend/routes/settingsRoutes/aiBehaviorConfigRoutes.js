import express from "express";
import query from "../../utils/supabaseQuery.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { behaviorConfig } = req.body;
  const { systemInstructions, stepsConfig } = behaviorConfig || {};

  console.log("systemInstructions:", systemInstructions);
  console.log("stepsConfig:", stepsConfig);

  try {
    const settings = [
      {
        key: "systemInstructions",
        value: JSON.stringify(systemInstructions),
        description: "System instructions for AI behavior",
      },
      {
        key: "stepsConfig",
        value: JSON.stringify(stepsConfig),
        description:
          "Configuration settings for welcome messages and step-specific AI behavior instructions",
      },
    ];

    for (const { key, value, description } of settings) {
      await query(
        `INSERT INTO admin_settings (key, value, category, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (key)
         DO UPDATE SET value = EXCLUDED.value`,
        [key, value, "AI-Behavior Configuration", description]
      );
    }
    res.json({ message: "AI behavior settings saved to database." });
  } catch (error) {
    console.error("Error saving settings:", error);
    res.status(500).json({ error: "Failed to save settings." });
  }
});

export default router;
