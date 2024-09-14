const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        required: [true, "Order id is required."]
    },
    amount: {
        type: Number,
        required: [true, "Amount is required."]
    },
    payment_method: {
        type: String,
    },
    staus: {
        type: String,
        enum: ["PAID", "PENDING", "FAILED"],
        required: [true, "Payment status is required."]
    },
    transaction_id: {
        type: String,
        required: [true, "Transaction Id is required."]
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("payment", paymentSchema);