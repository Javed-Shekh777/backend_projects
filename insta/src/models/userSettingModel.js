const mongoose = require("mongoose");

const userSettingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    notifications: {
        likes: { type: Boolean, default: true },
        comments: { type: Boolean, default: true },
        newFollowers: { type: Boolean, default: true },
        messages: { type: Boolean, default: true },
        mentions: { type: Boolean, default: true },
    },
    privacy: {
        accountPrivacy: String,
        activityStatus: Boolean,
        storySharing: Boolean,
        messageReplies: String,
        tagging: String
    },
    generalSettings: {
        language: { type: String },
        theme: { type: String },
        time_zone: { type: String },
        autoPlayVideos: { type: Boolean, default: true }
    }

}, { timestamps: true });


const userSettingModel = mongoose.model("setting", userSettingSchema);

module.exports = userSettingModel;