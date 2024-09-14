const errorHandler = require("../../helper/errorHandler");
const Post = require("../../models/post.model");
const responseHandler = require("../../helper/responseHandler");

const updatePost = async (req, res) => {

    const { title, content,postId } = req.body;

    try {

        const loggedUser = req.user;

        if (!loggedUser) {
            return errorHandler(res, 404, "Please first login");
        }

        if (postId && (!title && !content)) {
            return errorHandler(res, 404, "Please enter all fields");
        }

        const post = await Post.findById({_id:postId});

        if(!post){
            return errorHandler(res,402,"Post not found!!");
        }

        const updatePost = await Post.findByIdAndUpdate({_id:postId},{
            $set:{
                title:title || post.title,
                content: content || post.content
            }
        },{
            new:true
        }).populate("comment");

        if (!updatePost) {
            return errorHandler(res, 402, "Post not updated");
        }

        return responseHandler(res, updatePost, "Post Updated Successfully!!");

    } catch (error) {

        return errorHandler(res, 500, error.message);

    }
}


module.exports = updatePost;