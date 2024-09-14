const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User Id is required."]
    },
    products: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: [true, "Product is required."]
        },
        quantity: {
            type: Number,
            required: [true, "Product quantity is required."]
        },
        price: {
            type: Number,
            required: [true, "Price of product is required."]
        }
    }],
    total_amount: {
        type: Number,
        required: [true, "Total amount is required."]
    },
    status: {
        type: String,
        enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"],
    },
    payment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment",
    }

},
    { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);