const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    candidate_name: {
        type: String,
        trim: true,
        required: [true, "Candidate name is required"],
    },
    mobile: {
        type: String,
        required: [true, "Phone number is required"]
    },
    party: {
        type: String,
        trim: true,
        required: [true, "Party name is required"]
    },
    manifesto: {
        type: String,
        trim: true
    },
    totalVotes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model("Candidate", candidateSchema); 