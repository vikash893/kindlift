const nodemailer = require('nodemailer');

/**
 * Creates the email transporter.
 * 
 * In production, use a proper SMTP service (Brevo, SendGrid, etc.)
 * by setting SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS env vars.
 * 
 * Falls back to Gmail for local development.
 */
const createTransporter = () => {
  // Production: Use custom SMTP (Brevo, SendGrid, Mailgun, etc.)
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
    });
  }

  // Fallback: Gmail (works on localhost only)
  console.log('📧 Using Gmail SMTP (localhost only)');
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const transporter = createTransporter();

const sendEmail = async (to, subject, text) => {
  try {
    console.log("📨 Sending email to:", to);

    const fromAddress = process.env.SMTP_FROM || process.env.EMAIL_USER;

    const mailOptions = {
      from: `"Kindlift" <${fromAddress}>`,
      to,
      subject,
      html: `<p>${text}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);

  } catch (error) {
    console.error("❌ Email Error:", error.message || error);
    throw error;
  }
};

module.exports = { sendEmail };