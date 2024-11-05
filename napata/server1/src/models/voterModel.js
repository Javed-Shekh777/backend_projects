const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
    voter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    election: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    votedAt: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model("Voter", voterSchema);