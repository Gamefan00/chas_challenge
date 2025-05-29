import express from "express";
import dotenv from "dotenv";
import {
  createChatHandler,
  createWelcomeHandler,
} from "../utils/chatHandlerFactory.js";

// Import application conversation manager
import {
  fetchApplicationSystemMessageFromDB,
  // stepConversations as applicationStepConversations,
  getApplicationStepsDescription,
  fetchApplicationSteps,
  detectUserRole as detectApplicationUserRole,
  getApplicationWelcomeMessageForRole,
} from "../utils/applicationConversationManager.js";

// Import interview conversation manager
import {
  fetchInterviewSystemMessageFromDB,
  // stepConversations as interviewStepConversations,
  getInterviewStepsDescription,
  fetchInterviewSteps,
  detectUserRole as detectInterviewUserRole,
  getInterviewWelcomeMessageForRole,
} from "../utils/interviewConversationManager.js";

// Load environment variables
dotenv.config();

const router = express.Router();

// Configure application bot handlers
const applicationConfig = {
  botType: "application",
  fetchSystemMessage: fetchApplicationSystemMessageFromDB,
  // stepConversations: applicationStepConversations,
  getStepDescription: getApplicationStepsDescription,
  fetchSteps: fetchApplicationSteps,
  detectUserRole: detectApplicationUserRole,
  getWelcomeMessageForRole: getApplicationWelcomeMessageForRole,
};

// Configure interview bot handlers
const interviewConfig = {
  botType: "interview",
  fetchSystemMessage: fetchInterviewSystemMessageFromDB,
  // stepConversations: interviewStepConversations,
  getStepDescription: getInterviewStepsDescription,
  fetchSteps: fetchInterviewSteps,
  detectUserRole: detectInterviewUserRole,
  getWelcomeMessageForRole: getInterviewWelcomeMessageForRole,
};

// Create route handlers using the factory
router.get("/welcome/:step", createWelcomeHandler(applicationConfig));
router.post("/", createChatHandler(applicationConfig));
router.get("/interview/welcome/:step", createWelcomeHandler(interviewConfig));
router.post("/interview/", createChatHandler(interviewConfig));

export default router;
