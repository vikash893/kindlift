const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com",
    pass: "your_app_password"
  }
});

const sendOTP = async (email, otp) => {

  const mailOptions = {
    from: "yourgmail@gmail.com",
    to: email,
    subject: "Email Verification OTP",
    text: `Your verification OTP is: ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;