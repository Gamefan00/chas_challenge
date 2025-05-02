import express from 'express';
import { randomUUID } from 'crypto';

const router = express.Router();

router.get('/', (req, res) => {
  const uuid = randomUUID();
  res.json({ userId: uuid });
});

export default router;
