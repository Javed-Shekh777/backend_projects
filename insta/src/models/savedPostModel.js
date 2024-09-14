const mongoose = require("mongoose");

const savedPostSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }
}, { timestamps: true });

const savedPostModel = mongoose.model("savedPost", savedPostSchema);

module.exports = savedPostModel;