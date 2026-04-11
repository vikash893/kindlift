const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
    console.log("📨 Sending to:", to);

    const transporter = nodemailer.createTransport({
      service: 'gmail', // ✅ FIXED
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"KindLift" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log('✅ Email sent SUCCESS:', info.response);

  } catch (error) {
    console.error('❌ FULL Email Error:', error);
  }
};

module.exports = { sendEmail };