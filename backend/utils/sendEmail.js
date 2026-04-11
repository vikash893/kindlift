const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
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

    console.log('✅ Email sent:', info.messageId);

  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };