import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  initializeConversations();
  res.json({
    message: "All conversation histories cleared and welcome messages restored",
  });
});

router.post("/:stepId", (req, res) => {
  const { stepId } = req.params;

  if (stepConversations[stepId]) {
    const welcomeMessage = {
      role: "assistant",
      content: [
        {
          type: "output_text",
          text: stepWelcomeMessagesApplication[stepId],
        },
      ],
    };

    stepConversations[stepId] = [systemMessage, welcomeMessage];
    res.json({
      message: `Conversation history for ${stepId} cleared and welcome message restored`,
    });
  } else {
    res.status(404).json({ error: "Step not found" });
  }
});

export default router;
