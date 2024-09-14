const mongoose = require("mongoose");

const deviceInfoSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    device_type: {
        type: String,
    },
    device_id: {
        type: String
    },
    login_time: {
        type: Date
    },
    logout_time: {
        type: Date
    },
    last_active: { type: Date },
    location: { type: String },
}, { timestamps: true });


const deviceInfoModel = mongoose.model("deviceinfo", deviceInfoSchema);

module.exports = deviceInfoModel;