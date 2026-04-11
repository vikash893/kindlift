const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
    console.log("📨 Sending to:", to);

    // ✅ Gmail transporter (fixed for deployment)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // ✅ Fix for Render/Gmail issues
      },
    });

    // ✅ Verify connection (VERY IMPORTANT DEBUG)
    await transporter.verify();
    console.log("✅ SMTP connection verified");

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