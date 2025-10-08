import { sendMail } from '../mailers/resend.client.js';

export const sendTestMail = async (req) => {
  const { to, subject, html, text } = req.body || {};

  if (!to || !subject) {
    return { resStatus: 400, resMessage: { success: false, message: 'Missing required fields: to, subject' } };
  }

  const result = await sendMail({ to, subject, html, text });

  if (result.success) {
    return { resStatus: 200, resMessage: { success: true, message: 'Email sent (queued)', id: result.id } };
  }

  return { resStatus: 500, resMessage: { success: false, message: 'Failed to send email', error: result } };
};
