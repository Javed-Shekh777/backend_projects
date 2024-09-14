const errorHandler = require("../../helper/errorHandler");
const responseHandler = require("../../helper/responseHandler");
const User = require("../../models/user.model");
const Post = require("../../models/post.model");
const Comment = require("../../models/comment.model");


const deleteUser = async (req, res) => {
    try {

        const loggedUser = req.user;

        if (!loggedUser) {
            return errorHandler(res, 404, "Please first login");
        }

        const deleteUser = await User.findByIdAndDelete({ _id: loggedUser._id }).select("-password");

        if (!deleteUser) {
            return errorHandler(res, 402, "User not Found!!");
        }


        let posts = await Post.deleteMany({author:loggedUser._id});

        if(!posts){
            return errorHandler(res,402,"Posts not Deleted!!");
        }

        let comments = await Comment.deleteMany({author:loggedUser._id});
        
        if(!comments){
            return errorHandler(res,402,"Comments not Deleted!!");
        }


        const options = {
            httpONly: true,
            secure: true
        }
        res.clearCookie("token", options);
        return responseHandler(res, deleteUser, "User Deleted Successfully!!");
    } catch (error) {

        return errorHandler(res, 500, error.message);

    }



}


module.exports = deleteUser;