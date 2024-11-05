const Candidate = require("../models/candidateModel");
const Election = require("../models/electionModel");
const User = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/AsyncHandler");

const createCandidate = asyncHandler(async (req, res) => {

    const { cadidate_name, mobile, manifesto, party } = req.body;

    if (!cadidate_name || !mobile || !manifesto || !party) {
        throw new ApiError(402, "All fields are required.");
    }

    const isExitCandidate = await Candidate.findOne({ mobile });

    if (isExitCandidate) {
        throw new ApiError(402, "Candidate already exist.");
    }

    const user = new Candidate({
        mobile,
        candidate_name: cadidate_name,
        manifesto,
        party,
        createdAt: new Date.now()
    });

    const candidate = await user.save();

    const createdCandidate = await Candidate.findById({ _id: candidate._id });

    if (!createdCandidate) {
        throw new ApiError(402, "Candidate not created.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, createdCandidate, "Candidate created successfully.")
        );

});

const getCandidate = asyncHandler(async (req, res) => {
    const { candidateId } = req.body;

    if (!candidateId) {
        throw new ApiError(402, "Candidate selection is required.");
    }

    const candidate = await Candidate.findById({ _id: candidateId });

    if (!candidate) {
        throw new ApiError(402, "Candidate not found.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, candidate, "Candidate found successfully.")
        );
});

const getAllCandidates = asyncHandler(async (req, res) => {

    const candidates = await Candidate.find();

    if (!candidates) {
        throw new ApiError(402, "Candidates not found.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, candidates, "Candidates found successfully.")
        );
});

const updateCandidate = asyncHandler(async (req, res) => {
    const { manifesto, candidate_name, party, candidateId } = req.body;

    if (candidateId && (manifesto || candidate_name || party)) {
        throw new ApiError(402, "All fields are required.");
    }

    const isExitCandidate = await Candidate.findOne({ mobile });

    if (!isExitCandidate) {
        throw new ApiError(402, "User not exist.");
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate({ candidateId }, {
        $set: {
            manifesto: manifesto || isExitCandidate.manifesto,
            candidate_name: candidate_name || isExitCandidate.cadidate_name,
            party: party || isExitCandidate.party
        }
    }, { new: true });

    if (!updatedCandidate) {
        throw new ApiError(402, "Candidate not updated.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, updatedCandidate, "Candidate updated successfully.")
        );

});

const deleteCandidate = asyncHandler(async (req, res) => {
    const { candidateId } = req.body;

    if (!candidateId) {
        throw new ApiError(402, "Candidate selection is required.");
    }

    const deletedCandidate = await Candidate.findByIdAndDelete({ candidateId });

    if (!deletedCandidate) {
        throw new ApiError(402, "Candidate not deleted.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Candidate deleted successfully.")
        );

});

const createElection = asyncHandler(async (req, res) => {

    const { title, description, candidate } = req.body;

    if (!title || !description || !candidate) {
        throw new ApiError(402, "All fields are requred.");
    }

    const isExistElection = await Election.findOne({ title: title });

    if (isExistElection) {
        throw new ApiError(402, "Election already exist.");
    }

    const election = new Election({
        title,
        description,
        candidates: candidate,
        startDate: new Date.now(),
        isActive: true,
        createdAt: new Date.now(),
    });

    const newElection = await election.save();

    const createdElection = await Election.findById({ _id: newElection._id });

    if (!createdElection) {
        throw new ApiError(402, "Election not created.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, createdElection, "Election created successfully.")
        );

});

const getElection = asyncHandler(async (req, res) => {
    const { electionId } = req.body;

    if (!electionId) {
        throw new ApiError(402, "Election selection is required.");
    }

    const election = await Election.findById({ _id: electionId });

    if (!election) {
        throw new ApiError(402, "Election not found.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, election, "Election found successfully.")
        );

});

const getAllElection = asyncHandler(async (req, res) => {

    const elections = await Election.find();

    if (!elections) {
        throw new ApiError(402, "Elections not found.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, elections, "Elections found successfully.")
        );
});

const updateElection = asyncHandler(async (req, res) => {
    const { electionId, title, description, startDate, endDate } = req.body;

    if (electionId && (title || description || startDate || endDate)) {
        throw new ApiError(402, "All fields are required.");
    }

    const isExitElection = await Election.findOne({ mobile });

    if (!isExitElection) {
        throw new ApiError(402, "Election not exist.");
    }

    const updatedElection = await Election.findByIdAndUpdate({ id: electionId }, {
        $set: {
            title: title || isExitElection.title,
            description: description || isExitElection.description,
            startDate: startDate || isExitElection.startDate,
            endDate: endDate || isExitElection.endDate,
        }
    }, { new: true });

    if (!updatedElection) {
        throw new ApiError(402, "Election not updated.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, updatedElection, "Election updated successfully.")
        );
});

const deleteElection = asyncHandler(async (req, res) => {
    const { electionId } = req.body;

    if (!electionId) {
        throw new ApiError(402, "Candidate selection is required.");
    }

    const deletedElection = await Election.findByIdAndDelete({ _id: electionId });

    if (!deletedElection) {
        throw new ApiError(402, "Election not deleted.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Election deleted successfully.")
        );
});

const activeDeElection = asyncHandler(async (req, res) => {
    const { electionId } = req.body;

    if (electionId) {
        throw new ApiError(402, "All fields are required.");
    }

    const isExitElection = await Candidate.findOne({ mobile });

    if (!isExitElection) {
        throw new ApiError(402, "Election not exist.");
    }

    isExitElection.isActive = isExitElection.isActive == true ? true : false;

    await isExitElection.save();
    return res.status(201)
        .json(
            new ApiResponse(200, updatedElection, "Election updated successfully.")
        );
});


const addCandidatesElection = asyncHandler(async (req, res) => {

    const { electionId, candidate } = req.body;
    if (!electionId || !candidate) {
        throw new ApiError(402, "All fields are required.");
    }

    const election = await Election.findById({ _id: electionId });

    if (!election) {
        throw new ApiError(402, "Election does not exist");
    }

    const hasCandidate = election.candidates.includes(candidate);

    if (hasCandidate) {
        await Election.findByIdAndUpdate({ _id: electionId }, {
            $pull: { candidates: candidate }
        });
    } else {
        await Election.findByIdAndUpdate({ _id: electionId }, {
            $pull: { candidates: candidate }
        });
    }

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Candidate added successfully.")
        );
});


const addVotersElection = asyncHandler(async (req, res) => {

    const { electionId, voters } = req.body;
    if (!electionId || !voters) {
        throw new ApiError(402, "All fields are required.");
    }

    const allVoters = await Election.findOneAndUpdate(
        { _id: electionId },
        {
          // Condition to decide whether to push or pull
          $cond: {
            if: { $in: [voters, "$voters"] },  // Check if the value exists in the array
            then: { $pull: { voters: voters } },  // If exists, pull the value
            else: { $push: { voters: voters } }  // If not exists, push the value
          }
        },
        { new: true }
      );
    if (!allVoters) {
        throw new ApiError(402, "Voters not added.");
    }
    
    return res.status(201)
        .json(
            new ApiResponse(200, allVoters, "Voter added successfully.")
        );

});



const getAllUser = asyncHandler(async (req, res) => {

    const users = await User.find();

    if (!users) {
        throw new ApiError(402, "Users not found.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, users, "Users found successfully.")
        );
});

module.exports = { createCandidate, getCandidate, getAllCandidates, updateCandidate, deleteCandidate, createElection, getElection, getAllElection, updateElection, deleteElection, activeDeElection,addCandidatesElection,addVotersElection,getAllUser };