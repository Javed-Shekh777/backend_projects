const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const JWT = require("jsonwebtoken");
const User = require("../models/userModel");
const sendEmail = require("../helper/mail");


const register = asyncHandler(async (req, res) => {

    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
        throw new ApiError(404, "All fields are required.");
    }

    const isUserExist = await User.findOne({ email: email });

    if (isUserExist) {
        throw new ApiError(409, "User already exist.");
    }

    const user =await User.create({
        username,
        email,
        password,
        phone
    });


    const newUser = await User.findById({ _id: user._id }).select("-password");

    if (!newUser) {
        throw new ApiError(409, "Something went wrong while registering user.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "User registered successfully.")
        );

});



const login = asyncHandler(async (req, res) => {
    const { parameter, password } = req.body;

    if (!parameter || !password) {
        throw new ApiError(404, "All fields are required.");
    }

    const isUserExist = await User.findOne({
        $or: [
            // { username: parameter },
             { email: parameter }]
    });

    if (!isUserExist) {
        throw new ApiError(409, "User not exist.");
    }

    const isPasswordCorrect  = await isUserExist.isPasswordCorrect(password);
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

    return res.status(201)
        .cookie("token", token, options)
        .json(
            new ApiResponse(200, { user: isUserExist, token }, "User Login Successfully.")
        );

});



const logout = asyncHandler(async (req, res) => {

    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(409, "Unauthorized request.");
    }

    console.log(loggedIn);

    const options = {
        httpOnly: true,
        secure: true
    }


    return res.status(201)
        .clearCookie("token", options)
        .json(
            new ApiResponse(200, {}, "User logout Successfully.")
        );
});



const updateUser = asyncHandler(async (req, res) => {

    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(409, "Unauthorized request.");
    }

    const { username, address,phone  } = req.body;

    if (!username  && !address && !phone) {
        throw new ApiError(409, "Please edit something.");
    }

    const updatedUser = await User.findByIdAndUpdate({ _id: loggedIn._id }, {
        $set: {
            username: username || loggedIn.username,
            address: address || loggedIn.address,
            phone:phone || loggedIn.phone
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



const currentUser = asyncHandler (async (req,res)=>{

    const loggedIn = req.user;

    if(!loggedIn){
        throw new ApiError(404,"Unauthorized request.");
    }

    // const user = await User.findById({_id:loggedIn._id}).select("-password").populate("wishlist cart order_history");

    const user = await User.findById({_id:loggedIn._id}).select("-password");


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

    // const users = await User.find().select("-password").populate("wishlist cart order_history");
    const users = await User.find().select("-password");


    if(!users){
        throw new ApiError(404,"Users not fetched.");
    }

    return res.status(201)
    .json(
        new ApiResponse(200,users,"Users fetched successfully.")
    );

});



const forgetPassword = asyncHandler(async (req, res) => {

    const {parameter} = req.body;

    if(!parameter){
        throw new ApiError(403,"All fields are required.");
    }

    const user  =  await User.findOne({
        $or:[
            // {username : parameter},
            {email : parameter}
        ]
    });

    if(!user){
        throw new ApiError(403,"User not exist.");
    }

   
    
    const token = await JWT.sign(
        {
            _id:user?._id,
            username:user?.username,
            email : user?.email
        },
        process.env.SECRET_TOKEN,
        {
            expiresIn: '10m'
        });

        user.verify_code = token;
        user.verify_code_expiry =  new Date(Date.now() + 600000);
        await user.save({validateBeforeSave:false});

    const mail = await sendEmail(user?.username,user?.email, token);

    if (!mail) {
        throw new ApiError(404, "Something went wrong while sending email.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Email has been sent expires in 10 minutes.")
        );
});


const resetPassword = asyncHandler(async (req, res) => {

    const { token, password } = req.body;
    console.log(token,password);


    if (!token || !password) {
        throw new ApiError(402, "All fields are required.");
    }

    console.log("Process : ", process.env.SECRET_TOKEN);
    // const decodedToken = await JWT.verify(token,  process.env.SECRET_TOKEN);
    // const decoded = await JWT.verify(token, process.env.SECRET_TOKEN);
    const decoded = await JWT.verify(token, process.env.SECRET_TOKEN);


    if(!decoded){
        throw new ApiError(403,"Something went wrong");
    }

    console.log("fdfds");

    const user  =  await User.findOne({
        $or:[
            {email : decoded?.email},
            {_id : decoded?._id},
            {username : decoded?.username}
        ]
    });

    if(!user){
        throw new ApiError(403,"User not exist.");
    }

    const newDate = new Date();
    if (user.verify_code_expiry && user.verify_code_expiry < newDate) {
        throw new ApiError(409, "Time has been expired.");
    }

     user.verify_code = "",
     user.verify_code_expiry = null;
     user.password = password;
    await user.save({ validateBeforeSave: false });

    
    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Password updated successfully.")
        );
});


const deleteAccount = asyncHandler (async (req,res)=>{
    const isLoggedIn = req.user;

    if (!isLoggedIn) {
        throw new ApiError(402, "Unauthorized request.");
    }





});


module.exports = { register, login, logout ,updateUser,currentUser,getAllUser,forgetPassword,resetPassword,deleteAccount};