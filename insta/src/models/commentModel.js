const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    comment_text: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    replies: [{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        reply_text: { type: String },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        createdAt: { type: Date },
    }],

}, { time: true });


const commentModel = mongoose.model("comment",commentSchema);

module.exports = commentModel;