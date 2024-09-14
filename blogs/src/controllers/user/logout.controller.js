const errorHandler = require("../../helper/errorHandler");
const responseHandler = require("../../helper/responseHandler");

const logout = async (req, res) => {


    try {
        const loggedUser = req.user;
        if (!loggedUser) {
            return errorHandler(res, 404, "Please first login");
        }
        // 5. Setting token/cookie into header.
        const options = {
            httpOnly: true,
            secure: true
        }

        res.clearCookie("token", options);
        // 6. After all send the userdata with generated token as a response 
        return responseHandler(res, "", "User Logout Successfully!!");

    } catch (error) {
        return errorHandler(res, 500, error.message);

    }
}

module.exports = logout;