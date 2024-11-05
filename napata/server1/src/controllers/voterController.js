const Election = require("../models/electionModel");
const User = require("../models/userModel");
const Voter = require("../models/voterModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/AsyncHandler");

const addVote = asyncHandler(async (req, res) => {

    const { voterId, user,cadidate,election } = req.body;
    if (!voterId || !user) {
        throw new ApiError(402, "All fields are required.");
    }

    const voter = await User.findOneAndUpdate({
        $or: [{ voterId: voterId }, { user: user }]
    }, {
        $set: {
            hasVoted: true
        }
    }, {
        new: true
    }).select("-password -verifyCode -expiryCode");

    const voting = new Voter({
        voter:voter._id,
        candidate:cadidate,
        election:election,
        votedAt:new Date.now()
    });

    const voted = (await voting.save()).isNew(true);

    if (!voted) {
        throw new ApiError(402, "Vote not done.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, voted, "Vote has been done.")
        );

});


const activeElections = asyncHandler(async (req, res) => {

    const elections = await Election.find({ isActive: true }).populate("candidates").select("-voters");

    if (!elections) {
        throw new ApiError(402, "There are no active elections.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, elections, "Active election found successfully.")
        );

});

const voteStatus = asyncHandler(async (req, res) => {

 const { voterId, user } = req.body;
    if (!voterId && !user) {
        throw new ApiError(402, "All fields are required.");
    }

    const voter = await User.findOne({
        $or: [{ voterId: voterId }, { user: user }]
    }).select("-password -verifyCode -expiryCode");

    if (!voter) {
        throw new ApiError(402, "Vote not done.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, voter.hasVoted, "Vote has been done.")
        );

});


module.exports = {addVote,activeElections,voteStatus};