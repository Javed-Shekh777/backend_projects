const User = require("../models/userModel.js");
const ApiError = require("../utils/ApiError.js");

const generateAccessAndRefreshToken = async (userId) => {
    try {

        const user = await User.findById({ _id: userId });

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refresh_token = refreshToken;
        user.access_token = accessToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}


module.exports = generateAccessAndRefreshToken;