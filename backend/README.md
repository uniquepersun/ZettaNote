# Backend Mailer (Resend)

This project includes a simple Resend mailer client for sending transactional emails.

Environment variable required:

- `RESEND_API_KEY` - Your Resend API key. Without this the mailer will return an error and won't send emails.

Test endpoint:

- POST `/api/sendmail`

Body (JSON):

{
  "to": "recipient@example.com",
  "subject": "Test email",
  "html": "<p>Hello</p>",
  "text": "Hello"
}

Response: JSON with success status. Check server logs for detailed errors.
