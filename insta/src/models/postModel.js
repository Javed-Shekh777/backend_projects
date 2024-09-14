const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    caption: {
        type: String,
    },
    media: [{
        resource_type: { type: String },
        url: { type: String },
        public_id: { type: String }
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"like",
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }],
    location:{
        type:String
    },
    tags:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tag",
    }],
    isReel:{
        type:Boolean,
    },
    is_shared:{
        type:Boolean
    },
    original_post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    }

}, { timestamps: true });


const postModel = mongoose.model("post",postSchema);

module.exports = postModel;