const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User id is required."]
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: [true, "Product id is required."]
    },
    rating: {
        type: Number,
        required: [true, "Rating is required."]
    },
    comment: {
        type: String
    }


},
    { timestamps: true }
);

module.exports = mongoose.model("review", reviewSchema);