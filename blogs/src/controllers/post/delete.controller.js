const errorHandler = require("../../helper/errorHandler");
const Post = require("../../models/post.model");
const responseHandler = require("../../helper/responseHandler");

const deletePost = async (req,res)=>{

    const {postId}  = req.body; 
    try {

        const loggedUser = req.user;

        if(!loggedUser){
            return errorHandler(res,404,"Please firt login");
        }

        if(!postId){
            return errorHandler(res,404,"Please select any post to read");
        }

        const post = await Post.findByIdAndDelete({_id:postId});

        if(!post){
            return errorHandler(res,402,"Post not deleted!!");
        }

        return responseHandler(res,post,"Post Deleted Successfully!!");

        
    } catch (error) {

        return errorHandler(res,500,error.message);
        
    }

}

module.exports = deletePost;