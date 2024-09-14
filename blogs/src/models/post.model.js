const mongoose = require("mongoose");



const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    title:
    {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
    }]
},
    {
        timestamps: true
    }
);

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;