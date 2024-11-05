const Notification  = require("../models/NotificationModel");
const User  = require("../models/userModel");

const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/AsyncHandler");


const sendNotification = async (userId,type,message,relatedIds)=>{

    try {

        if(!userId || !type || !message || !relatedIds){
            return null;
        }

        const newNotify = await Notification.create({
            user_id:userId ,
            type:type, 
            message:message,
            related_id:relatedIds
        });

        const noti = await Notification.findById({_id:newNotify._id}).populate("user_id","username,profile_picture");

        const user = await User.findByIdAndUpdate({_id:loggedUser._id},{
            $push:{notification:deleted._id}
        });

        if(!noti || !user){
            return null;
        }

        return noti;

    } catch (error) {
        console.error('Error sending notification:', error);
        return null;
    }

};


const deleteNotification = asyncHandler (async (req,res)=>{

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthorized request.");
    }

    const {notificationId} =  req.body;

    if(!notificationId){
        throw new ApiError(403,"Please select any notification.");
    }

    const deleted = await Notification.deleteOne({
        $or:[
            {_id:notificationId},
            {user_id:loggedUser._id}
        ]
    });

    const user = await User.findByIdAndUpdate({_id:loggedUser._id},{
        $pull:{notification:deleted._id}
    });

    if(!deleted || !user){
        throw new ApiError(403,"Notification not deleted.");
    }

    return res.status(201)
    .json(
        new ApiResponse(200,{},"Notification deleted successfully")
    );

});


 

module.exports = {sendNotification,deleteNotification};