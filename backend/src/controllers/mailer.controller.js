/**
 * Mailer Controller
 * Handles email sending operations
 */

import { sendMail } from '../mailers/resend.client.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';

/**
 * Send Test/Generic Email
 * @param {Object} req - Express request object
 * @returns {Object} Response status and message
 */
export const sendTestMail = async (req) => {
  const { to, subject, html, text } = req.body || {};

  // Input validation
  if (!to || !subject) {
    return {
      resStatus: STATUS_CODES.BAD_REQUEST,
      resMessage: {
        success: false,
        message: 'Missing required fields: to and subject are required.',
      },
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emails = Array.isArray(to) ? to : [to];

  for (const email of emails) {
    if (!emailRegex.test(email)) {
      return {
        resStatus: STATUS_CODES.BAD_REQUEST,
        resMessage: {
          success: false,
          message: `Invalid email address: ${email}`,
        },
      };
    }
  }

  try {
    // Send email using Resend
    const result = await sendMail({ to, subject, html, text });

    if (result.success) {
      return {
        resStatus: STATUS_CODES.OK,
        resMessage: {
          success: true,
          message: 'Email sent successfully and queued for delivery.',
          id: result.id,
        },
      };
    }

    // Handle Resend API errors
    return {
      resStatus: STATUS_CODES.INTERNAL_SERVER_ERROR,
      resMessage: {
        success: false,
        message: 'Failed to send email.',
        error: result.message || 'Unknown error',
      },
    };
  } catch (error) {
    console.error('Mailer error:', error);
    return {
      resStatus: STATUS_CODES.INTERNAL_SERVER_ERROR,
      resMessage: {
        success: false,
        message: MESSAGES.GENERAL.INTERNAL_ERROR,
      },
    };
  }
};
