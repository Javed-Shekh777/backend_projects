const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String
    },
    candidates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate'
        }
    ],
    voters: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    startDate: {
        type: Date,
        required: [true, "Start Date is required"]
    },
    endDate: {
        type: Date,
        required: [true, "EndDate is required"]
    },
    isActive: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Election", electionSchema);