const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    tag_name: { type: String, required: true },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }]
}, { timestamps: true });

const tagModel = mongoose.model("tag", tagSchema);

module.exports = tagModel;