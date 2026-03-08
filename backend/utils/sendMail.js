const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vikashbhardwaj430@gmail.com",
    pass: "zidnpwpmshxnqmup"
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