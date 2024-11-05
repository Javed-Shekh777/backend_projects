const mongoose = require("mongoose");

const deviceInfoSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    device_type: {
        type: String,
        default:""
    },
    device_id: {
        type: String,
        default:""
    },
    login_time: {
        type: Date,
        default:Date.now
    },
    logout_time: {
        type: Date,
        default:Date.now
    },
    last_active: { type: Date },
    location: { type: String },
}, { timestamps: true });


const deviceInfoModel = mongoose.model("deviceinfo", deviceInfoSchema);

module.exports = deviceInfoModel;