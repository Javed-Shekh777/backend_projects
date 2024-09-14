const errorHandler = require("../../helper/errorHandler");
const Post = require("../../models/post.model");
const responseHander = require("../../helper/responseHandler");

const readPost = async (req,res)=>{

    const {postId}  = req.body; 
    try {

        const loggedUser = req.user;

        if(!loggedUser){
            return errorHandler(res,404,"Please firt login");
        }

        if(!postId){
            return errorHandler(res,404,"Please select any post to read");
        }

        const post = await Post.findById({_id:postId}).populate("comment");

        if(!post){
            return errorHandler(res,402,"Post not found!!");
        }

        return responseHander(res,post,"Post Find Successfully!!");

        
    } catch (error) {

        return errorHandler(res,500,error.message);
        
    }

}

module.exports = readPost;