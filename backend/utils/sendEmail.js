const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    console.log("📨 Sending email to:", to);

    const mailOptions = {
      from: `"Kindlift" <${process.env.EMAIL_USER}>`,
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