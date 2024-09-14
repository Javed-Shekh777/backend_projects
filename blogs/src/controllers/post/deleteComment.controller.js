const errorHandler = require("../../helper/errorHandler");
const Post = require("../../models/post.model");
const Comment = require("../../models/comment.model");
const responseHandler = require("../../helper/responseHandler");

const deleteComment = async (req, res) => {

    const { commentId, postId } = req.body;

    try {

        const loggedUser = req.user;

        if (!loggedUser) {
            return errorHandler(res, 404, "Please first login");
        }

        if (!commentId || !postId) {
            return errorHandler(res, 404, "Please enter all fields");
        }

        let post = await Post.findById({ _id: postId });

        if (!post) {
            return errorHandler(res, 402, "This Post not found!!");
        }

        let deletedComment = await Comment.findById({ _id: commentId });

        if (!deletedComment) {
            return errorHandler(res, 402, "This Comment not found!!");
        }

    
        deletedComment = await Comment.findByIdAndDelete({ _id: commentId });

         post = await Post.findByIdAndUpdate(
            postId,
            { $pull: { comment: deletedComment._id } },
            { new: true } // This option returns the updated document
        );


        if (!post || !deletedComment) {
            return errorHandler(res, 402, "Comment not deleted");
        }

        return responseHandler(res, { deletedComment, post }, "Commented Deleted Successfully!!");

    } catch (error) {

        return errorHandler(res, 500, error.message);

    }
}


module.exports = deleteComment;


