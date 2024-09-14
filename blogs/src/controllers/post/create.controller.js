const errorHandler = require("../../helper/errorHandler");
const Post = require("../../models/post.model");
const responseHandler = require("../../helper/responseHandler");

const createPost = async (req, res) => {

    const { title, content } = req.body;

    try {

        const loggedUser = req.user;

        if (!loggedUser) {
            return errorHandler(res, 404, "Please firt login");
        }

        if (!title || !content) {
            return errorHandler(res, 404, "Please enter all fields");
        }

        const newPost = new Post({
            title,
            content,
            author: loggedUser._id
        });

        const createdPost = await newPost.save();

        if (!createdPost) {
            return errorHandler(res, 402, "Post not created");
        }

        return responseHandler(res, createdPost, "Post Created Successfully!!");

    } catch (error) {

        return errorHandler(res, 500, error.message);

    }
}


module.exports = createPost;