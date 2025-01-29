const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Product name is required."],
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    brand: {
      type: String,
    },
    stock: {
      type: Number,
    },
    images: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
