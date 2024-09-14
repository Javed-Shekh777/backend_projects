const errorHandler = require("../../helper/errorHandler");
const Post = require("../../models/post.model");
const Comment = require("../../models/comment.model");
const responseHandler = require("../../helper/responseHandler");

const postComment = async (req, res) => {

    const { content, postId } = req.body;

    try {

        const loggedUser = req.user;

        if (!loggedUser) {
            return errorHandler(res, 404, "Please first login");
        }

        if (!content || !postId) {
            return errorHandler(res, 404, "Please enter all fields");
        }

        const post = await Post.findById({ _id: postId });

        if (!post) {
            return errorHandler(res, 402, "This Post not found!!");
        }


        const newComment = new Comment({
            content: content,
            author: loggedUser._id,
        });

        const createdComment = await newComment.save();

        if (!createdComment) {
            return errorHandler(res, 402, "Not commented post");
        }


        post.comment.push(createdComment._id);
        await post.save();


        const updatePost = await Post.findById({_id: postId}).populate("comment");

        if (!updatePost) {
            return errorHandler(res, 402, "Post not commented");
        }

        return responseHandler(res, updatePost, "Post not commented Successfully!!");

    } catch (error) {

        return errorHandler(res, 500, error.message);

    }
}


module.exports = postComment;