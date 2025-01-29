const ApiError = require("../utils/ApiError");
const JWT = require("jsonwebtoken");
const User = require("../models/user.model"); // Adjust path to your User model

const authMiddleware = async (req, _, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "No token provided. Unauthorized access.");
    }

    const decoded = await JWT.verify(token, process.env.SECRET_TOKEN);

    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      throw new ApiError(404, "User not found. Unauthorized access.");
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(400, error.message || "Unauthorized access."));
  }
};

module.exports = authMiddleware;
