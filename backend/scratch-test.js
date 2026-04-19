require('dotenv').config();
const { sendEmail } = require('./utils/sendEmail');

async function test() {
  try {
    console.log("Testing with:", process.env.EMAIL_USER);
    await sendEmail("ygupta8875@gmail.com", "Test from sendEmail utility", "This is a test.");
    console.log("Success!");
  } catch (err) {
    console.error("Failed:", err);
  }
}
test();
