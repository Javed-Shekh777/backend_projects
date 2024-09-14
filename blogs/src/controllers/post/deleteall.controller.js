const errorHandler = require("../../helper/errorHandler");
const Post = require("../../models/post.model");
const responseHandler = require("../../helper/responseHandler");

const deleteAllPost = async (req, res) => {


    try {

        const loggedUser = req.user;

        if (!loggedUser) {
            return errorHandler(res, 404, "Please firt login");
        }

        const post = await Post.find({ author: loggedUser._id });

        if (!post) {
            return errorHandler(res, 402, "Posts not deleted!!");
        }

        return responseHandler(res, post, "All Post Deleted Successfully!!");


    } catch (error) {

        return errorHandler(res, 500, error.message);

    }

}

module.exports = deleteAllPost;