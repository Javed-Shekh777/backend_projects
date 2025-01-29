const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

const suggestUsername = async (newName) => {
  try {
    return User.findOne({ username: newName })
      .then(function (account) {
        if (account != null) {
          newName += Math.floor(Math.random() * 100 + 1);
          suggestUsername(newName);
        }
        return newName;
      });
  } catch (error) {
    throw new ApiError(401, "Username checking error");
  }
};

module.exports = suggestUsername;
