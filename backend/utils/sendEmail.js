const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    console.log("📨 Sending email to:", to);

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev', // default works
      to,
      subject,
      html: `<p>${text}</p>`,
    });

    console.log("✅ Email sent:", response);

  } catch (error) {
    console.error("❌ Email Error:", error);
  }
};

module.exports = { sendEmail };