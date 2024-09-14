const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User id is required."]
    },
    products: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: [true, "Product id is required."]
        },
        qunatity: {
            type: Number,
            required: [true, "Quantity is required."]
        }
    }]

},
    { timestamps: true }
);

module.exports = mongoose.model("cart", cartSchema);