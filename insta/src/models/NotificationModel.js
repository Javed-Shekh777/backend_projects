const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }],
    type: { type: String, required: true },
    message: {
        type: String
    },
    related_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    is_read: {
        type: Boolean, default: false
    }
}, { timestamps: true });

const notificationModel = mongoose.model("notification", notificationSchema);

module.exports = notificationModel;