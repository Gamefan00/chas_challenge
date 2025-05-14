import express from "express";
import query from "../../utils/supabaseQuery.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { modelConfig } = req.body;
  const { model, temperature, maxTokens } = modelConfig || {};

  // console.log("model:", model);
  // console.log("temperature:", temperature);
  // console.log("maxTokens:", maxTokens);

  try {
    const settings = [
      {
        key: "model",
        value: JSON.stringify(model),
        description: "Chosen Chat-GPT model",
      },
      {
        key: "temperature",
        value: JSON.stringify(temperature),
        description: "Chosen temperature for Chat-GPT model",
      },
      {
        key: "maxTokens",
        value: JSON.stringify(maxTokens),
        description: "Maximum amount of tokens allowed for Chat-GPT response",
      },
    ];
    for (const { key, value, description } of settings) {
      await query(
        `INSERT INTO admin_settings (key, value, category, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (key)
         DO UPDATE SET value = EXCLUDED.value`,
        [key, value, "AI-Model Configuration", description]
      );
    }
    res.json({ message: "AI model settings saved to database." });
  } catch (error) {
    console.error("Error saving settings:", error);
    res.status(500).json({ error: "Failed to save settings." });
  }
});

export default router;
