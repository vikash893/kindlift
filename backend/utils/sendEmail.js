/**
 * @fileoverview Email Utility — Send emails via Gmail SMTP
 *
 * Converted from TypeScript to CommonJS to fix deployment email failures.
 * The original .ts file was not being compiled in the Node.js runtime,
 * causing emails to silently fail after deployment.
 *
 * @requires nodemailer - Email delivery
 */

const nodemailer = require('nodemailer');

/**
 * Send an email using Gmail SMTP or fallback to Ethereal for testing.
 *
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} text - Email body text
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, text) => {
  try {
    let transporter;

    // Use Gmail SMTP with app password
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Fallback to custom SMTP
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback to Ethereal Email for testing
      console.log('No SMTP credentials found. Creating a test Ethereal account...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from: `"KindLift" <${process.env.EMAIL_USER || 'noreply@kindlift.com'}>`,
      to,
      subject,
      text,
    });

    console.log('✅ Email sent:', info.messageId);

    // Preview URL is only available when sending through Ethereal
    if (!process.env.EMAIL_USER && !process.env.SMTP_HOST) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };
