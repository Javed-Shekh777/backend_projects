const errorHandler = require("../../helper/errorHandler");
const Post = require("../../models/post.model");
const responseHandler = require("../../helper/responseHandler");

const postDislike = async (req, res) => {

    const { postId } = req.body;

    try {

        const loggedUser = req.user;

        if (!loggedUser) {
            return errorHandler(res, 404, "Please firt login");
        }

        if (!postId) {
            return errorHandler(res, 404, "Please enter all fields");
        }

        const post = await Post.findById({_id:postId});

        if(!post){
            return errorHandler(res,402,"Post not found!!");
        }

        const updatePost = await Post.findByIdAndUpdate({_id:postId},{
            $set:{
                likes : post.likes - 1,
            }
        },{
            new:true
        }).populate("comment");

        if (!updatePost) {
            return errorHandler(res, 402, "Post not liked");
        }

        return responseHandler(res, updatePost, "Post Liked Successfully!!");

    } catch (error) {

        return errorHandler(res, 500, error.message);

    }
}


module.exports = postDislike;