const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
    comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'comment', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('reply', ReplySchema);
