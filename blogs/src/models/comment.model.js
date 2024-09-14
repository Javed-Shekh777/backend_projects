const mongoose = require("mongoose");



const commentSchema =new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    content: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true
    }
);

const commentModel = mongoose.model("comment", commentSchema);

module.exports = commentModel;