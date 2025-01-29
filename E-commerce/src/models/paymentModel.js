const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User id is required."],
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: [true, "Order id is required."],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required."],
    },
    payment_method: {
      type: String,
    },
    payment_staus: {
      type: String,
      enum: ["PAID", "PENDING", "FAILED"],
      required: [true, "Payment status is required."],
      default:"PENDING"
    },
    transaction_id: {
      type: String,
    },
    razorpay_signature: { type: String },
    error_details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", paymentSchema);
