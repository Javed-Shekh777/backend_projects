const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    activity_type: {
        type: String,
        default:""
    },
    activity_details: { type: String,default:"" },
    ip_address: { type: String,default:"" },
    device_id: { type: String ,default:""}
}, { timestamps: true });


const activityModel = mongoose.model("activity", activitySchema);

module.exports = activityModel;