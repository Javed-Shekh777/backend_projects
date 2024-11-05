const mongoose = require("mongoose");


const usageSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    daily_usage: [{
        date: { type: Date,default:Date.now },
        time_spent: { type: String , default:"" },
        actions: {
            posts: { type: Number ,default:0},
            likes: { type: Number ,default:0},
            comments: { type: Number,default:0 },
            messages: { type: Number ,default:0}
        }
    }],
    weekly_summary: {
        posts: { type: Number ,default:0},
        likes: {  type: Number ,default:0 },
        comments: { type: Number ,default:0 },
        messages: {  type: Number ,default:0 },
        time_spent: { type: Number ,default:0 }
    },
    monthly_summary: {
        posts: {  type: Number ,default:0 },
        likes: {  type: Number ,default:0 },
        comments: {  type: Number ,default:0},
        messages: {  type: Number ,default:0 },
        time_spent: {  type: Number ,default:0 }
    },
}, { timestamps: true });



const usageModel = mongoose.model("usagedata", usageSchema);

module.exports = usageModel;