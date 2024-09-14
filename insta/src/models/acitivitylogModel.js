const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    activity_type: {
        type: String
    },
    activity_details: { type: String },
    is_address: { type: String },
    device_id: { type: String }
}, { timestamps: true });


const activityModel = mongoose.model("activity", activitySchema);

module.exports = activityModel;