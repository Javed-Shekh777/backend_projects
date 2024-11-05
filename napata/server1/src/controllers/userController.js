const asyncHandler = require("../utils/AsyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const User = require("../models/userModel");
const JWT = require("jsonwebtoken");
const newVoterId = require("../helper/generateVoterId");
const sendMail = require("../helper/mail");


const register = asyncHandler(async (req, res) => {

    const { user, email, password, role } = req.body;

    if (!user || !email || !password) {
        throw new ApiError(402, "All fields are required.");
    }

    const isExituser = await User.findOne({ email: email });

    if (isExituser) {
        throw new ApiError(402, "User already exist.");
    }

    const voterId = newVoterId(user);
    const newUser = new User({
        email,
        password,
        user,
        role: role && role,
        voterId: voterId
    });

    const createdUser = await newUser.save();

    const confirmUser = await User.findById({ _id: createdUser._id }).select("-password");

    if (!confirmUser) {
        throw new ApiError(402, "Something went wrong while registering.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, confirmUser.voterId, "User registered successfully. \n Please not that your Voter ID.")
        );

});



const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(402, "All fields are required.");
    }

    const isExituser = await User.findOne({ email: email }).select("-password");

    if (!isExituser) {
        throw new ApiError(402, "User not exist.");
    }
    const isCorrectPassword = isExituser.isPasswordCorrect(password);

    if (!isCorrectPassword) {
        throw new ApiError(402, "Username or Password is wrong.");
    }

    const token = await isExituser.generateToken();

    if (!token) {
        throw new ApiError(402, "Token not generated.");
    }


    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(201)
        .cookie("token", token, options)
        .json(
            new ApiResponse(200, { user: isExituser, token }, "Login successfully.")
        );

});



const logout = asyncHandler(async (req, res) => {

    const isLoggedIn = req.user;

    if (!isLoggedIn) {
        throw new ApiError(402, "Unauthorized request.");
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(201)
        .clearCookie("token", options)
        .json(
            new ApiResponse(200, {}, "Logout successfully.")
        );

});



const forgetPassword = asyncHandler(async (req, res) => {
    const isLoggedIn = req.user;

    if (!isLoggedIn) {
        throw new ApiError(402, "Unauthorized request.");
    }

    const token = await JWT.sign(
        {
            _id: isLoggedIn._id,
            email: isLoggedIn.email,
            user: isLoggedIn.user
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: process.env.TOKEN_EXPIRY
        });

    const mail = await sendMail(isLoggedIn.user, isLoggedIn.email, token);

    if (!mail) {
        throw new ApiError(404, "Something went wrong while seding email.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Forget Password Email has been sent.")
        );
});


const resetPassword = asyncHandler(async (req, res) => {
    const isLoggedIn = req.user;

    if (!isLoggedIn) {
        throw new ApiError(402, "Unauthorized request.");
    }

    const { token, password } = req.body;

    if (!token || !password) {
        throw new ApiError(402, "All fields are required.");
    }

    const decoded = await JWT.verify(token, process.env.TOKEN_SECRET);
    if (!decoded) {
        throw new ApiError(402, "Invalid request.");
    }

    const updatedUser = await User.findByIdAndUpdate({ _id: decoded._id }, {
        $set: { password: password }
    });

    if (!updatedUser) {
        throw new ApiError(402, "Password not updated.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Password updated successfully.")
        );
});


const currentUser = asyncHandler(async (req, res) => {
    const isLoggedIn = req.user;

    if (!isLoggedIn) {
        throw new ApiError(402, "Unauthorized request.");
    }

    const user = await User.findById({ _id: isLoggedIn._id });

    if (!user) {
        throw new ApiError(402, "User not found.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, user, "Candidate found successfully.")
        );
});



module.exports = { register, login, logout, forgetPassword, resetPassword, currentUser };