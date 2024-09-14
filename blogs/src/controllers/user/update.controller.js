const errorHandler = require("../../helper/errorHandler");
const responseHandler = require("../../helper/responseHandler");
const User = require("../../models/user.model");


const update = async (req,res)=>{
    const {username} = req.body;
    try {

        const loggedUser = req.user;
        if (!loggedUser) {
            return errorHandler(res, 404, "Please first login");
        }

        if(!username ){
            return errorHandler(res,404,"Please update anyone field");
        }

        

        const updatedUser = await User.findByIdAndUpdate({_id:loggedUser._id},{
            $set:{
                username:username|| loggedUser.username,
            }
        },
        {
            new:true
        }
    ).select("-password");

    if(!updatedUser){
        return errorHandler(res,402,"User not updated");
    }


   
    
    return responseHandler(res,updatedUser,"User Updated Successfully");
       
        
    } catch (error) {
        return errorHandler(res,500,error.message);
    }
};


module.exports = update;