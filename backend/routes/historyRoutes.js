import express from 'express';
import { stepConversations, systemMessage } from '../utils/conversationManager.js';
import query from '../utils/supabaseQuery.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, currentChatHistory } = req.body;

  console.log('userId:', userId);
  console.log('currentChatHistory:', currentChatHistory);

  try {
    // Check if user_id is already in database and if yes update row instead of creating a new one
    await query(
      'INSERT INTO chat_histories (user_id, history) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET history = EXCLUDED.history',
      [userId, JSON.stringify(currentChatHistory)]
    );
  } catch (error) {
    console.log(error);
  }

  res.json({ message: 'Chat history sent to backend.' });
});

router.get('/:stepId', (req, res) => {
  const { stepId } = req.params;
  const history = stepConversations[stepId] || [systemMessage];

  const formattedHistory = history
    .filter((msg) => msg.role !== 'system')
    .map((msg) => ({
      role: msg.role,
      content: msg.content[0].text,
    }));

  res.json(formattedHistory);
});

// router.post('/chatHistory', (req, res) => {
//   try {
//     // Post whole chat history to backend

//     const { userId, chatHistory } = req.body;

//     console.log(userId, chatHistory);

//     // Send whole chat history to database together with UUID
//   } catch (error) {
//     console.log(error);
//   }
// });

export default router;
