const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema({
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
        seen_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        sent_at: {
            type: Date,
        },
        isDeleted: { type: Boolean }
    }],

}, { timestamps: true });


const messageModel = require("message", messageSchema);

module.exports = messageModel;