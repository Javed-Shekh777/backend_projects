const mongoose = require("mongoose");


const usageSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    daily_usage: [{
        date: { type: Date },
        time_spent: { type: Number },
        actions: {
            posts: { type: Number },
            likes: { type: Number },
            comments: { type: Number },
            messages: { type: Number }
        }
    }],
    weekly_summary: {
        posts: { type: Number },
        likes: { type: Number },
        comments: { type: Number },
        messages: { type: Number },
        time_spent: { type: Number }
    },
    monthly_summary: {
        posts: { type: Number },
        likes: { type: Number },
        comments: { type: Number },
        messages: { type: Number },
        time_spent: { type: Number }
    },
}, { timestamps: true });



const usageModel = mongoose.model("usagedata", usageSchema);

module.exports = usageModel;