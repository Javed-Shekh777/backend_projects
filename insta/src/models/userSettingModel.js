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
        accountPrivacy: {type:String,default:"public"},
        activityStatus: {type:Boolean,default:true},
        storySharing: {type:Boolean,default:true},
        messageReplies: {type:String,default:"everyone"},
        tagging: {type:String,default:"everyone"}
    },
    generalSettings: {
        language: { type: String ,default:"en"},
        theme: { type: String ,default:"dark"},
        time_zone: { type: String ,default:"UTC"},
        autoPlayVideos: { type: Boolean, default: true }
    }

}, { timestamps: true });


const userSettingModel = mongoose.model("setting", userSettingSchema);

module.exports = userSettingModel;