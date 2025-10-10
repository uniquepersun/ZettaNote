import dotenv from 'dotenv';
dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_BASE = 'https://api.resend.com';

if (!RESEND_API_KEY) {
  console.warn('RESEND_API_KEY not set. Mailer will not be able to send emails.');
}

/**
 * sendMail
 * @param {{from?: string, to: string|string[], subject: string, html?: string, text?: string}} options
 */
export const sendMail = async ({
  from = process.env.FROM_MAIL || 'no-reply@zetta.example',
  to,
  subject,
  html,
  text,
}) => {
  if (!RESEND_API_KEY) {
    return { success: false, message: 'Resend API key not configured' };
  }

  try {
    const resp = await fetch(`${RESEND_BASE}/emails`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        text,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return { success: false, message: 'Resend API error', error: data };
    }

    return { success: true, message: 'Email queued', id: data.id || null, raw: data };
  } catch (err) {
    return { success: false, message: 'Failed to send email', error: err.message || err };
  }
};
