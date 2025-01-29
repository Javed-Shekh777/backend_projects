const User = require("../../models/user.model");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const {
  registerUserSchema,
  validate,
  loginUserSchema,
  forgetPasswordSchema,
  verifyEmailSchema,
  checkUsername,
} = require("./userValidation");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");
const suggestUsername = require("../../helper/suggestUsername");
const { forgetMail, verifyMail } = require("../../helper/mail");

const generateVerificationData = (userId, email, key, expiryTime) => {
  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Generate Token
  const token = JWT.sign({ userId, email }, key, {
    expiresIn: expiryTime,
  });

  return { otp, token };
};

const register = asyncHandler(async (req, res) => {
  validate(registerUserSchema, req.body);

  const { username, email, password } = req.body;

  const userExist = await User.findOne({
    username,
    email,
  });

  if (userExist) {
    throw new ApiError(400, "User already exists.");
  }

  const user = await User.create({ username, email, password });

  const { otp, token } = generateVerificationData(
    user._id,
    email,
    process.env.SECRET_KEY,
    "10m"
  );

  if (!otp || !token) {
    throw new ApiError(400, "Something went wrong while register.");
  }

  const emailResponse = await verifyMail(user.username, user.email, token, otp);

  if (!emailResponse) {
    throw new ApiError(400, "Mail not send.");
  }

  user.otp = otp;
  user.token = token;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;
  user.tokenExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  if (!user) {
    throw new ApiError(500, "User not created.");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        {},
        "User Registered Successfully!\nPlease verify email"
      )
    );
});

const login = asyncHandler(async (req, res) => {
  validate(loginUserSchema, req.body);

  const { username, password } = req.body;

  const isUserExist = await User.findOne({
    $or: [{ username: username }, { email: username }],
  });

  if (!isUserExist) {
    throw new ApiError(400, "User not exist.");
  }

  const comparePassword = await isUserExist.comparePassword(password);
  if (!comparePassword) {
    throw new ApiError(400, "Username or password is wrong");
  }

  const isVerifiedAccount = isUserExist.isVerified;

  if (!isVerifiedAccount) {
    throw new ApiError(409, "Please verify your account , then login");
  }

  const token = await isUserExist.generateAuthToken();

  if (!token) {
    throw new ApiError(500, "Token not generated.");
  }

  const config = {
    httpOnly: true, // Prevent access from JavaScript
    secure: process.env.NODE_ENV !== "development", // Only send over HTTPS in production
    sameSite: "None",
  };

  isUserExist.password = undefined;
  isUserExist.token = undefined;
  return res
    .status(200)
    .cookie("token", token, config)
    .json(
      new ApiResponse(
        200,
        { token: token, user: isUserExist },
        "User Login Successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(401, "Please first login");
  }

  await User.findByIdAndUpdate({ _id: loggedIn._id }, { $set: { token: "" } });

  const options = {
    httpOnly: true, // Prevent access from JavaScript
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
  };

  return res
    .status(201)
    .clearCookie("token", options)
    .json(new ApiResponse(200, {}, "User logout Successfully."));
});

const getUser = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(409, "Unauthorized request.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, loggedIn, "User fetched successfully."));
});

const usernameAvailable = asyncHandler(async (req, res) => {
  validate(checkUsername, req?.query);
  const { username } = req.query;

  const isUserExist = await User.find({ username });

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  if (isUserExist?.length > 0) {
    return res
      .status(201)
      .json(
        new ApiResponse(200, { username: username }, "Username already taken.")
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { username: username }, "Username is available.")
    );
});

const forgetPassword = asyncHandler(async (req, res) => {
  validate(forgetPasswordSchema, req.body);

  const { username } = req.body;

  const isUserExist = await User.findOne({
    $or: [{ username: username }, { email: username }],
  });

  if (!isUserExist) {
    throw new ApiError(401, "User not exist.");
  }

  const { otp, token } = generateVerificationData(
    isUserExist._id,
    email,
    process.env.RESET_PASSWORD_TOKEN,
    "1h"
  );

  if (!otp || !token) {
    throw new ApiError(400, "Something went wrong while register.");
  }

  const emailResponse = await forgetMail(
    isUserExist.username,
    isUserExist.email,
    token,
    otp
  );

  if (!emailResponse) {
    throw new ApiError(401, "Email not sent");
  }

  let currentDate = new Date();
  let futureDate = new Date(currentDate.getTime() + 60 * 60 * 1000);

  isUserExist.token = token;
  isUserExist.tokenExpiry = futureDate;
  isUserExist.otp = otp;
  isUserExist.otpExpiry = futureDate;
  await isUserExist.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `We sent an email to ${isUserExist.email} with a link to get back to your account.`
      )
    );
});

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not exist.");
  }
  if (user.otpExpiry < Date.now()) {
    throw new ApiError(400, "Time has been exceed.");
  }

  if (user.otp !== otp) {
    throw new ApiError(400, "OTP in Invalid.");
  }

  // Verify user
  user.isVerified = true;
  user.token = null; // Clear token after verification
  user.otp = null; // Clear OTP after verification
  user.tokenExpiry = null;
  user.otpExpiry = null;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully."));
};

const verifyToken = async (req, res) => {
  const { token, email } = req.query;

  // Verify token
  const decoded = JWT.verify(token, process.env.SECRET_KEY);
  const { userId } = decoded;

  if (!decoded) {
    throw new ApiError(400, "Something went wrong");
  }
  // Find user

  const user = await User.findOne({ $or: [{ email: email }, { _id: userId }] });
  if (!user) {
    throw new ApiError(400, "User not exist.");
  }
  if (user.tokenExpiry < Date.now()) {
    throw new ApiError(400, "Time has been exceed.");
  }

  if (user.token !== token) {
    throw new ApiError(400, "OTP in Invalid.");
  }

  // Verify user
  user.isVerified = true;
  user.token = null; // Clear token after verification
  user.otp = null; // Clear OTP after verification
  user.tokenExpiry = null;
  user.otpExpiry = null;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully."));
};

// const resetPassword = asyncHandler(async (req, res) => {

//   const { token, newPassword } = req.body;

//   if (!token || !newPassword) {
//       throw new ApiError(409, "All fields are required.");
//   }

//   const decodedToken = await JWT.verify(token, process.env.RESET_PASSWORD_TOKEN);

//   if (!decodedToken) {
//       throw new ApiError(409, "Something went wrong.");
//   }

//   const user = await User.findOne({
//       $or: [{ username: decodedToken?.username }, { email: decodedToken?.email }]
//   });

//   const newDate = new Date();
//   if (user.verify_code_expiry && user.verify_code_expiry < newDate) {
//       throw new ApiError(409, "Time has been expired.");
//   }

//   user.verify_code = "";
//   user.verify_code_expiry = null;
//   user.is_verified = true;
//   user.password = newPassword;
//   await user.save({ validateBeforeSave: false });

//   return res.status(201)
//       .json(new
//           ApiResponse(200, {}, "Password reset successfully.")
//       );
// });

const getAllUser = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(401, "Please first login");
  }

  const users = await User.find().select("-password -token");

  if (!users) {
    throw new ApiError(400, "Users not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "User fetched successfully."));
});

module.exports = {
  register,
  login,
  logout,
  getUser,
  usernameAvailable,
  forgetPassword,
  getAllUser,
  verifyToken,
  verifyOtp,
};
