const mongoose = require("mongoose");


const reelSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    caption: {
        type: String
    },
    media: [{
        resource_type: { type: String },
        url: { type: String },
        public_id: { type: String },
        duration: { type: Number }
    }],

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
    }],
    shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "share",
    }]

}, { timestamps: true });


const reelModel = mongoose.model("reel", reelSchema);

module.exports = reelModel;