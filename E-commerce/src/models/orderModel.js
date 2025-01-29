const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User Id is required."],
    },
    products: {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: [true, "Product is required."],
      },
      quantity: {
        type: Number,
        required: [true, "Product quantity is required."],
        min: [1, "Quantity must be at least 1."], // Optional: Ensure quantity is at least 1
      },
      price: {
        type: Number,
        required: [true, "Price of product is required."],
        min: [0, "Price must be a positive number."], // Optional: Ensure price is non-negative
      },
    },
    shipping_address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    total_amount: {
      type: Number,
      required: [true, "Total amount is required."],
      min: [0, "Total amount must be a positive number."], // Optional: Ensure total amount is non-negative
    },
    payment_staus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    order_status: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"],
    },
    cancelledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


orderSchema.index({cancelledAt:1},{expireAfterSeconds:864000});

module.exports = mongoose.model("order", orderSchema);
