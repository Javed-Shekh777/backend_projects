const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: [true, "Product Id is required."]
    },
    stock: {
        type: Number,
        required: [true, "Stock number is required."]
    },
    restock_threshold: {
        type: Number
    },
    restock_date: {
        type: Date
    },
    supplier_info: {
        name: {
            type: String,
            trim: true,
            required: [true, "Supplier name is required."]
        },
        contact: {
            type: String,
            required: [true, "Supplier contact is required."]
        }
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("inventory", inventorySchema);