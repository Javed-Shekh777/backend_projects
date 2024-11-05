const mongoose = require("mongoose");


const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    messages: [{
        sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        message_text: { type: String },
        media: [{
            resource_type: { type: String },
            url: { type: String },
            public_url: { type: String }
        }],
        seen_by: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }],
        sent_at: {
            type: Date,
            default: Date.now
        },
        isDeleted: { type: Boolean,default:false },
        last_seen: [{
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            last_seen_at: { type: Date, default: Date.now }
        }]
    }],

}, { timestamps: true });

const chatModel = mongoose.model("chat",chatSchema);

module.exports = chatModel;