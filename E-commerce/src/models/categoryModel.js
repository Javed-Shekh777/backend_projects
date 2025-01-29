const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Category name is required."],
    },
    description: {
      type: String,
      trim: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      default:null
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", categorySchema);
