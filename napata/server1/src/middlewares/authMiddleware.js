const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const isAuthenticated = asyncHandler(async (req, res, next) => {
    try {

        const token = req.cookie?.token || req.header("Authorization")?.replace("Bearer", "");

        if (!token) {
            throw new ApiError(402, "Unauthorized access.");
        }

        const decoted = await bcrypt.compare(token, process.env.REFRESH_TOKEN_SECRET);

        if (!decoted) {
            throw new ApiError(409, "Something went wrong while decoding the token.");
        }

        const user = await User.findById(decoted._id).select("-password");
        if (!user) {
            throw new ApiError(402, "User not found.");
        }

        re.user = user;
        next();

    } catch (error) {
        throw new ApiError(500, error.message || "Invalid access token");
    }

});

module.exports = isAuthenticated;