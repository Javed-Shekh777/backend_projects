const errorHandler = require("../../helper/errorHandler");
const responseHandler = require("../../helper/responseHandler");
const User = require("../../models/user.model");

const readAllUser = async (req, res) => {

    try {

        const loggedUser = req.user;

        if (!loggedUser) {
            return errorHandler(res, 404, "Please first Login");
        }

        const users = await User.find();

        if (!users) {
            return errorHandler(res, 402, "User not found");
        }

        return responseHandler(res, users, "Users Found Successfully!!");

    } catch (error) {

        return errorHandler(res, 500, error.message);

    }
}


module.exports = readAllUser;