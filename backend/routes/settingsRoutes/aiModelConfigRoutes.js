import express from "express";
import query from "../../utils/supabaseQuery.js";

const router = express.Router();

// Retrieve AI model settings
router.get("/", async (req, res) => {
  try {
    const result = await query(
      `SELECT key, value FROM admin_settings WHERE category = $1`,
      ["AI-Model Configuration"]
    );

    if (!result || result.length === 0) {
      return res.json({
        modelConfig: {
          model: "gpt-4.1-mini",
          temperature: 1.0,
          maxTokens: 2048,
        },
      });
    }

    // Convert array of {key, value} objects into a single modelConfig object
    const modelConfig = {};
    result.forEach((item) => {
      try {
        modelConfig[item.key] = JSON.parse(item.value);
      } catch (e) {
        modelConfig[item.key] = item.value;
      }
    });

    res.json({ modelConfig });
  } catch (error) {
    console.error("Error fetching AI model settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.post("/", async (req, res) => {
  const { modelConfig } = req.body;
  const { model, temperature, maxTokens } = modelConfig || {};

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
        `INSERT INTO admin_settings(key, value, category, description)
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
