const errorHandler = require("../../helper/errorHandler");
const Post = require("../../models/post.model");
const responseHandler = require("../../helper/responseHandler");

const readAllPost = async (req, res) => {


    try {

        const loggedUser = req.user;

        if (!loggedUser) {
            return errorHandler(res, 404, "Please first login");
        }

        const post = await Post.find({ author: loggedUser._id }).populate("comment");

        if (!post) {
            return errorHandler(res, 402, "Posts not found!!");
        }

        return responseHandler(res, post, "All Post Find Successfully!!");


    } catch (error) {

        return errorHandler(res, 500, error.message);

    }

}

module.exports = readAllPost;