const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    media:{
        resource_type:{type:String},
        url:{type:String},
        public_id:{type:String},
    },
    views:[{type:mongoose.Schema.Types.ObjectId,ref:"user"}],
    reactions:[{
        user_id:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
        emoji:{type:String},
        reaction_time:{type:Date}
    }],
    expiresAt : {type:Date ,}

},{timestamps:true});


const storyModel = mongoose.model("story",storySchema);

module.exports = storyModel;