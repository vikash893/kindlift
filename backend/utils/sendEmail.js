const nodemailer = require('nodemailer');

/**
 * Creates the email transporter.
 * 
 * In production, use a proper SMTP service (Brevo, SendGrid, etc.)
 * by setting SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS env vars.
 * 
 * OR use Resend API by setting RESEND_API_KEY env var.
 * 
 * Falls back to Gmail for local development.
 */

// ─── Option 1: Resend API (recommended for cloud) ───────────
const sendViaResend = async (to, subject, htmlBody) => {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || 'KindLift <onboarding@resend.dev>',
      to: [to],
      subject,
      html: htmlBody,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Resend error: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  console.log('✅ Email sent via Resend:', data.id);
  return data;
};

// ─── Option 2: SMTP (Brevo, SendGrid, Gmail, etc.) ──────────
const createTransporter = () => {
  if (process.env.SMTP_HOST) {
    console.log('📧 Using SMTP:', process.env.SMTP_HOST);
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });
  }

  console.log('📧 Using Gmail SMTP (localhost only)');
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
};

let transporter = null;

const sendEmail = async (to, subject, text) => {
  console.log("📨 Sending email to:", to);

  // Priority 1: Use Resend API if configured (works best on cloud)
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(to, subject, `<p>${text}</p>`);
  }

  // Priority 2: Use SMTP (Brevo/SendGrid/Gmail)
  if (!transporter) {
    transporter = createTransporter();
  }

  const fromAddress = process.env.SMTP_FROM || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Kindlift" <${fromAddress}>`,
    to,
    subject,
    html: `<p>${text}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email Error:", error.message || error);
    throw error;
  }
};

module.exports = { sendEmail };