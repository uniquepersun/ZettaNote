/**
 * Mailer Routes
 * Handles email sending functionality
 */

import express from 'express';
import { sendTestMail } from '../controllers/mailer.controller.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/mailer/send
 * @desc    Send an email
 * @access  Private (requires authentication)
 * @body    { to: string|string[], subject: string, html?: string, text?: string }
 */
router.post(
  '/send',
  authenticate,
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await sendTestMail(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   POST /api/mailer/test
 * @desc    Send a test email (for testing purposes)
 * @access  Private (requires authentication)
 * @body    { to: string, subject: string, html?: string, text?: string }
 */
router.post(
  '/test',
  authenticate,
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await sendTestMail(req);
    res.status(resStatus).json(resMessage);
  })
);

export default router;
