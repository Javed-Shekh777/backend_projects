const errorHandler = require("../../helper/errorHandler");
const responseHandler = require("../../helper/responseHandler");
const User = require("../../models/user.model");

const readUser = async (req, res) => {

    try {

        const loggedUser = req.user;

        if (!loggedUser) {
            return errorHandler(res, 404, "Please first Login");
        }

        const user = await User.findById({ _id: loggedUser._id });

        if (!user) {
            return errorHandler(res, 402, "User not found");
        }

        return responseHandler(res, user, "User Found Successfully!!");

    } catch (error) {

        return errorHandler(res, 500, error.message);

    }
}


module.exports = readUser;