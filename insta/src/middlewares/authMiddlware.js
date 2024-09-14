const User = require("../models/userModel.js");
const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("../utils/AsyncHandler.js");
const JWT = require("jsonwebtoken");

const authUser = asyncHandler(async (req, res, next) => {
    try {

        const token =
       req.cookies?.accessToken ||
       req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(409, "Unauthorized access.");
        }

        const decodedForm = await JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById({ _id: decodedForm._id }).select("-password -refreshtoken -access_token -verify_code_expiry -verify_code");

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(409, error.message || "Invalid access token");

    }

});

module.exports =  authUser;