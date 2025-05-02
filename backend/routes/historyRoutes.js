import express from "express";
import {
  stepConversations,
  systemMessage,
} from "../utils/conversationManager.js";

const router = express.Router();

router.get("/", (req, res) => {
  const firstStepWithMessages =
    Object.entries(stepConversations).find(
      ([_, messages]) => messages.length > 1
    )?.[0] || "step-1";

  const history = stepConversations[firstStepWithMessages] || [systemMessage];

  const formattedHistory = history
    .filter((msg) => msg.role !== "system")
    .map((msg) => ({
      role: msg.role,
      content: msg.content[0].text,
    }));

  res.json(formattedHistory);
});

router.get("/:stepId", (req, res) => {
  const { stepId } = req.params;
  const history = stepConversations[stepId] || [systemMessage];

  const formattedHistory = history
    .filter((msg) => msg.role !== "system")
    .map((msg) => ({
      role: msg.role,
      content: msg.content[0].text,
    }));

  res.json(formattedHistory);
});

export default router;
