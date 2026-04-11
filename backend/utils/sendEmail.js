const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    console.log("📨 Sending email to:", to);

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev', // default works for testing
      to,
      subject,
      html: `<p>${text}</p>`,
    });

    if (response.error) {
      console.error("❌ Resend API Error:", response.error);
      throw new Error(response.error.message);
    }

    console.log("✅ Email sent:", response);

  } catch (error) {
    console.error("❌ Email Error:", error.message || error);
    throw error; // Rethrow to let auth route handle the 500 status!
  }
};

module.exports = { sendEmail };