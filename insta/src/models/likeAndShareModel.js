const mongoose = require("mongoose");

const likeAndshareSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    type: { type: String },
    target_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, { timestamps: true });


const likeAndshareModel = mongoose.model("likeandshare", likeAndshareSchema);

module.exports = likeAndshareModel;