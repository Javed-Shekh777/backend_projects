const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const JWT = require("jsonwebtoken");
const User = require("../models/userModel");
const sendEmail = require("../helper/mail");
const generateOTP = require("../helper/generateOTP");

 

const register = asyncHandler(async (req, res) => {
  const { username, email, password, phone } = req.body;

  if (!username || !email || !password || !phone) {
    throw new ApiError(400, "All fields are required.");
  }

  const isUserExist = await User.findOne({ email: email });

  if (isUserExist) {
    throw new ApiError(409, "User already exist.");
  }

  const user = await User.create({
    username,
    email,
    password,
    phone,
  });

  let otp = generateOTP(6, "numeric");
  console.log(otp);
  token = await user.simpleToken();

  user.verify_code = otp;
  user.verify_code_token = token;

  user.verify_code_expiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendEmail.verifyEmail(user.username, user.email, token, otp);

  const newUser = await User.findById({ _id: user._id }).select("-password");

  if (!newUser) {
    throw new ApiError(500, "Something went wrong while registering user.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "User Registered Successfully."));
});

const verifyUser = asyncHandler(async (req, res) => {
  const { parameter, otp } = req?.body || null;

  const { token } = req?.params || null;

  const decoded = token && (await JWT.verify(token, process.env.SECRET_TOKEN));

  const user = await User.findOne({
    $or: [{ username: parameter }, { email: parameter || decoded?.email }],
  });

  if (!user) {
    return res.status(400).send("Invalid token");
  }

  if (token && user?.verify_code_token !== token) {
    return res.status(400).send("Invalid token");
  } else if (token && user?.verify_code_expiry < Date.now()) {
    return res.status(400).send("Time has been expired.");
  }
  if (otp && user?.verify_code !== otp) {
    throw new ApiError(403, "Invalid OTP");
  } else if (otp && user?.verify_code_expiry < Date.now()) {
    throw new ApiError(403, "Time has been expired.");
  }

  user.verify_code_expiry = null;
  user.verify_code = "";
  user.verify_code_token = "";
  await user.save();

  if (token) {
    return res.status(200).send("Email verified successfully!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Email verified successfully!"));
});

const login = asyncHandler(async (req, res) => {
  
  const { parameter, password } = req.body;

  if (!parameter || !password) {
    throw new ApiError(404, "All fields are required.");
  }

  const isUserExist = await User.findOne({
    $or: [{ username: parameter }, { email: parameter }],
  });

  if (!isUserExist) {
    throw new ApiError(409, "User not exist.");
  }

  const isPasswordCorrect = await isUserExist.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(409, "Email or password is wrong.");
  }

  const token = await isUserExist.generateToken();

  if (!token) {
    throw new ApiError(409, "Something went while generating token.");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("token", token, options)
    .json(
      new ApiResponse(
        200,
        { user: isUserExist, token },
        "User Login Successfully."
      )
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
    secure: true,
  };

  return res
    .status(201)
    .clearCookie("token", options)
    .json(new ApiResponse(200, {}, "User logout Successfully."));
});

const updateUser = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  const {id} = req.params || null;

  if (!loggedIn) {
    throw new ApiError(409, "Unauthorized request.");
  }

  const { username, address, phone } = req.body;

  if (!username && !address && !phone) {
    throw new ApiError(409, "Please edit something.");
  }
  const updatedUser = await User.findByIdAndUpdate(
    { _id: loggedIn._id ||id},
    {
      $set: {
        username: username || loggedIn.username,
        address: address ||loggedIn.address,
        phone: phone || loggedIn.phone,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not updated.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, updatedUser, "User updated successfully."));
});

const getUser = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  // const user = await User.findById({ _id: loggedIn._id ||id})
  //   .select("-password")
  //   .populate("wishlist cart order_history");

  const user = await User.findById({ _id: loggedIn._id }).select("-password");

  if (!user) {
    throw new ApiError(404, "User not fetched.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, user, "User fetched successfully."));
});

const getAllUser = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  if (loggedIn.is_admin != true) {
    throw new ApiError(404, "Unauthorized access.");
  }

  // const users = await User.find().select("-password").populate("wishlist cart order_history");
  const users = await User.find().select("-password");

  if (!users) {
    throw new ApiError(404, "Users not fetched.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, users, "Users fetched successfully."));
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { parameter } = req.body;

  if (!parameter) {
    throw new ApiError(403, "All fields are required.");
  }

  const user = await User.findOne({
    $or: [{ username: parameter }, { email: parameter }],
  });

  if (!user) {
    throw new ApiError(403, "User not exist.");
  }

  token = await user.simpleToken();
  user.verify_code_token = token;
  user.verify_code_expiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const mail = await sendEmail.resetPasswordEmail(
    user?.username,
    user?.email,
    token
  );

  if (!mail) {
    throw new ApiError(404, "Something went wrong while sending email.");
  }

  return res.status(201).json(new ApiResponse(200, {}, "Email has been sent."));
});

const resetPassword = asyncHandler(async (req, res) => {

  const { token, password } = req.body;

  if (!token || !password) {
    throw new ApiError(402, "All fields are required.");
  }

  const decoded = await JWT.verify(token, process.env.SECRET_TOKEN);

  if (!decoded) {
  throw new ApiError(403, "Something went wrong");
  }

  const user = await User.findOne({
    $or: [
      { email: decoded?.email },
      { _id: decoded?._id },
      { username: decoded?.username },
    ],
  });

  if (!user) {
    throw new ApiError(403, "User not exist.");
  }

  if (user.verify_code_expiry && user.verify_code_expiry < Date.now()) {
    throw new ApiError(409, "Time has been expired.");
  }

  user.verify_code = "";
  user.verify_code_token = "";
  user.verify_code_expiry = null;
  user.password = password;
  await user.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Password updated successfully."));
});

const deleteAccount = asyncHandler(async (req, res) => {
  const isLoggedIn = req.user;

  if (!isLoggedIn) {
    throw new ApiError(402, "Unauthorized request.");
  }
});

module.exports = {
  register,
  verifyUser,
  login,
  logout,
  updateUser,
  getUser,
  getAllUser,
  forgetPassword,
  resetPassword,
  deleteAccount,
};
