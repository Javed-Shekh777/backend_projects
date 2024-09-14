const User = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");
const JWT = require("jsonwebtoken");

const authenticated = asyncHandler(async (req, res, next) => {
    try {

        const token = req.cookie.token || req.header['Authorization'].replace("Bearer ", "");

        if (!token) {
            throw new ApiError(404, "Unauthorized access.");
        }

        const decoded = await JWT.verify(token.process.env.SECRET_TOKEN);

        if (!decoded) {
            throw new ApiError(404, "Invalid access token.");
        }

        const user = await User.findById({ _id: decoded._id }).select("-password");

        req.user = user;
        next();

    } catch (error) {
        console.log(error.message);
        throw new ApiError(404, error.message);

    }
});

module.exports = authenticated;