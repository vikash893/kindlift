const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTP = async (email, otp) => {

  const mailOptions = {
    from: "vikashbhardwaj430@gmail.com",
    to: email,
    subject: "Email Verification OTP",
    text: `Your verification OTP is: ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;