import express from 'express';
import { sendTestMail } from '../controllers/mailer.controller.js';

const router = express.Router();

// POST /api/sendmail - body: { to, subject, html?, text? }
router.post('/sendmail', async (req, res) => {
  try {
    const { resStatus, resMessage } = await sendTestMail(req);
    res.status(resStatus).json(resMessage);
  } catch (err) {
    console.log('SendMail Error: ', err);
    res.status(500).json({ success: false, message: 'Internal Server error.' });
  }
});

export default router;
