// src/lib/mailer.ts
import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env;

// Ensure you have these in your .env.local:
// SMTP_HOST=smtp.yourprovider.com
// SMTP_PORT=587
// SMTP_SECURE=false           (or "true" for 465)
// SMTP_USER=your_smtp_username
// SMTP_PASS=your_smtp_password
// SMTP_FROM="Your App Name <no-reply@yourdomain.com>"

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
  console.warn(
    '[mailer] Missing SMTP_… env vars; sendEmail will throw at runtime if called.'
  );
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

/**
 * sendEmail
 * @param to     – recipient email address
 * @param subject
 * @param html    – HTML body (or plain text)
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (err: any) {
    console.error('[mailer] sendMail error:', err);
    return { success: false, error: err.message };
  }
}
