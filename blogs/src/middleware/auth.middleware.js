const JWT = require("jsonwebtoken");
const errorHandler = require("../helper/errorHandler");
const User = require("../models/user.model");

const loggednIn = async(req,res,next)=>{
    try {
        const token =  req.cookies?.token;
        

        if(!token){
            return errorHandler(res,404,"Unauthorized request");
        }

        const verify = await JWT.verify(token, process.env.SECRET_TOKEN);

        

        const user = await User.findById({_id:verify._id}).select("-password");

        if(!user){
            return errorHandler(res,404,"Invalid access token");
        }
        req.user = user;
        next();
    } catch (error) {
        return errorHandler(res,500,error.message);
        
    }

}

module.exports = loggednIn;