const Setting = require("../models/userSettingModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/AsyncHandler");

const getSetting = asyncHandler (async (req,res)=>{

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const setting = await Setting.findById({_id:loggedUser._id});

    if(!setting){
        throw new ApiError(404,"Setting not fetched.");
    }

    return res.status(201)
    .json(
        new ApiResponse(200,setting,"Setting found successfully.")
    );

});


const updateSetting = asyncHandler (async (req,res)=>{
    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }


    const updateData = req.body;

    if(!updateData){
        throw new ApiError(404,"Please update something");
    }


    const updatedSettings = await userSettingModel.findOneAndUpdate(
        { user_id: userId }, // Filter
        { $set: updateData }, // Update data
        { new: true, runValidators: true } // Options: new document return karein, validators run karein
    );

    if (!updatedSettings) {
        throw new ApiError(404,"User  settings not found");
    }

    return res.status(201)
    .json(
        new ApiResponse(200,updatedSettings,"Setting updated successfully")
    );

});

module.exports = {getSetting,updateSetting};