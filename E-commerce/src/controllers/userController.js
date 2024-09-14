const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const User = require("../models/userModel");


const register = asyncHandler(async (req, res) => {

    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
        throw new ApiError(404, "All fields are required.");
    }

    const isUserExist = await User.findOne({ email: email });

    if (isUserExist) {
        throw new ApiError(409, "User already exist.");
    }

    const user = new User({
        username,
        email,
        password,
        phone
    }).save();


    const newUser = await User.findById({ _id: user._id });

    if (!newUser) {
        throw new ApiError(409, "Something went wrong while registering user.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "User registered successfully.")
        );

});



const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(404, "All fields are required.");
    }

    const isUserExist = await User.findOne({ email: email });

    if (!isUserExist) {
        throw new ApiError(409, "User not exist.");
    }

    const isPasswordCorrect = isUserExist.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(409, "Email or password is wrong.");
    }

    const token = await isUserExist.generateToken();

    if (!token) {
        throw new ApiError(409, "Something went while generating token.");
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.satus(201)
        .cookie("token", token, options)
        .json(
            new ApiResponse(200, { user: isUserExist, token }, "Login Successfully.")
        );

});



const logout = asyncHandler(async (req, res) => {

    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(409, "Unauthorized request.");
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(201)
        .clearCookie("token", options)
        .json(
            new ApiResponse(200, {}, "Logout Successfully.")
        );

});



const updateUser = asyncHandler(async (req, res) => {

    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(409, "Unauthorized request.");
    }

    const { username, email } = req.body;

    if (username == "" && email == "") {
        throw new ApiError(409, "Please edit something.");
    }

    const updatedUser = await User.findByIdAndUpdate({ _id: loggedIn._id }, {
        $set: {
            username: username || loggedIn.username,
            email: email || loggedIn.email
        }
    },
        {
            new: true
        });

    if (!updatedUser) {
        throw new ApiError(404, "User not updated.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, updatedUser, "User updated successfully.")
        );

});



const getUser = asyncHandler (async (req,res)=>{

    const loggedIn = req.user;

    if(!loggedIn){
        throw new ApiError(404,"Unauthorized request.");
    }

    const user = await User.findById({_id:loggedIn._id}).select("-password").populate("wishlist cart");

    if(!user){
        throw new ApiError(404,"User not fetched.");
    }

    return res.status(201)
    .json(
        new ApiResponse(200,user,"User fetched successfully.")
    );

});



const getAllUser = asyncHandler (async (req,res)=>{

    const loggedIn = req.user;




    if(!loggedIn){
        throw new ApiError(404,"Unauthorized request.");
    }

    if(loggedIn.is_admin != true){
        throw new ApiError(404,"Unauthorized access.");
    }

    const users = await User.find().select("-password").populate("wishlist cart order_history");

    if(!users){
        throw new ApiError(404,"Users not fetched.");
    }

    return res.status(201)
    .json(
        new ApiResponse(200,users,"Users fetched successfully.")
    );

});


const forgotPassword = asyncHandler(async (req,res)=>{

    const loggedIn = req.user;

    if(!loggedIn){
        throw new ApiError(404,"Unauthorized request.");
    }

});



const resetPassword = asyncHandler(async (req,res)=>{

    const loggedIn = req.user;

    if(!loggedIn){
        throw new ApiError(404,"Unauthorized request.");
    }

});

module.exports = { register, login, logout ,updateUser,getUser,getAllUser,forgotPassword,resetPassword};