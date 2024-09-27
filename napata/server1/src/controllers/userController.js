const asyncHandler = require("../utils/AsyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const User = require("../models/userModel");


const register = asyncHandler(async (req, res) => {

    const { user, email, password } = req.body;

    if (!user || !email || !password) {
        throw new ApiError(402, "All fields are required.");
    }

    const isExituser = await User.findOne({ email: email });

    if (isExituser) {
        throw new ApiError(402, "User already exist.");
    }

    const newUser = new User({
        email,
        password,
        user
    });

    const createdUser = await newUser.save();

    const confirmUser = await User.findById({ _id: createdUser._id }).select("-password");

    if (!confirmUser) {
        throw new ApiError(402, "Something went wrong while registering.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "User registered successfully.")
        );

});



const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email, !password) {
        throw new ApiError(402, "All fields are required.");
    }

    const isExituser = await User.findOne({ email: email }).select("-password");

    if (!isExituser) {
        throw new ApiError(402, "User not exist.");
    }

    const isCorrectPassword = isExituser.isCorrectPassword(password);

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
        .cookie("token", token,options)
        .json(
            new ApiResponse(200, { user: isExituser, token }, "Login successfully.")
        );

});



const logout = asyncHandler(async (req, res) => {

    const isLoggedIn = req.user;

    if(!isLoggedIn){
        throw new ApiError(402,"Unauthorized request.");
    }

    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(201)
    .clearCookie("token",options)
    .json(
        new ApiResponse(200,{},"Logout successfully.")
    );

});



module.exports = { register, login, logout };