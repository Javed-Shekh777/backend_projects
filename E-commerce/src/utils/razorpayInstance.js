const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.PAY_ID,
  key_secret: process.env.PAY_SECRET,
});

module.exports = razorpayInstance;
