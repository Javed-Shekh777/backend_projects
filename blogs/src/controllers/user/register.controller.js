const errorHandler = require("../../helper/errorHandler");
const responseHandler = require("../../helper/responseHandler");
const User = require("../../models/user.model");

const register = async(req,res)=>{

    const {username , email,password } = req.body;

    try {

        // 1. Checking all fields are filled or not
        if(!username || !email || !password){
            return errorHandler(res,403,"Please fill all fields");
        }

        // 2. Checking that user already exist the return 
        const userExist = await User.findOne({email});

        if(userExist){
            return errorHandler(res,402,"User already exist");
        }

        // 3. If user not exist then create a new user and save data into database.
        const newUser = await User.create({
            username,email,password
        });



        // 4. If new user not created then return error
        const createdUser = await User.findById(newUser._id).select("-password");
        if(!createdUser){
            return errorHandler(res,404,"User not registered");
        }

         
        // Return created a new user data
        return responseHandler(res,createdUser,"User Registered Successfully!");

        
    } catch (error) {
        return errorHandler(res,500,"");
    }
}


module.exports = register;