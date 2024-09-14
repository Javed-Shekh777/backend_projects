const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const asyncHandler = require("../utils/AsyncHandler");
const { storyFolderName } = require("../constants");
const Story = require("../models/storyModel");
const User = require("../models/userModel");

const { uploadCloudinary, deleteCloudinary } = require("../utils/cloudinary");


const createStory = asyncHandler(async (req, res) => {
    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }
    

    const file = req.file;

    if (!file || !file?.path) {
        throw new ApiError(409, "Media file is missing.");
    }

    const uploadedFile = await uploadCloudinary([file.path], storyFolderName);

    if (!uploadedFile) {
        throw new ApiError(409, "Story not uploaded.");
    }

    const story = new Story({
        media: {
            resource_type: uploadedFile?.resource_type,
            url: uploadedFile?.url,
            public_id: uploadedFile?.public_id
        },
        user_id: loggedUser._id,
        expiresAt: Date.now() + 24 * 60 * 60 * 600
    });

    const newStory = await story.save();

    if (!newStory) {
        throw new ApiError(409, "Story not created.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, newStory, "Story uploaded successfully.")
        );
});


const deleteStory = asyncHandler(async (req, res) => {
    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }


    const { storyId } = req.body;

    if (!storyId) {
        throw new ApiError(409, "All fields are required.");
    }

    const isStoryExist = await Story.findByIdAndDelete({ _id: storyId });

    if (!isStoryExist) {
        throw new ApiError(409, "Story does not exist.");
    }


    const response = await deleteCloudinary([{
        resource_type: isStoryExist?.media?.resource_type,
        public_id: isStoryExist?.media?.public_id
    }]);

    if (!response) {
        throw new ApiError(409, "Story not deleted.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Story deleted successfully.")
        );

});


const userAllStory = asyncHandler(async (req, res) => {
    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const stories = await Story.find({ user_id: loggedUser._id }).populate("views,username profile_picture");

    if (!stories) {
        throw new ApiError(409, "Stories not fetched.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, stories, "User Stories found successfully.")
        );

});


const allStory = asyncHandler(async (req, res) => {
    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const user = await User.findById({ _id: loggedUser._id });

    const following = user.following;

    const stories = await Story.find({ user_id: { $in: following } }).populate("user_id, username profile_picture");

    if (!stories) {
        throw new ApiError(409, "Stories not found");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, stories, "Story fetched successfully.")
        );


});


const reactStory = asyncHandler(async (req, res) => {
    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { emoji, userId, storyId } = req.body;

    if (!emoji || !userId || storyId) {
        throw new ApiError(409, "All fields are required.");
    }

    const story = await Story.findByIdAndUpdate({ _id: storyId }, {
        $push: {
            reactions: {
                user_id: userId,
                emoji: emoji,
                reaction_time: Date.now()
            }
        }
    }, { new: true });

    if (!story) {
        throw new ApiError(409, "React not created.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, story, "Story reacted successfully.")
        );

});


const readReactStory = asyncHandler(async (req, res) => {
    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }




});


const storyView = asyncHandler(async (req, res) => {
    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { storyId } = req.body;

    if (!storyId) {
        throw new ApiError(409, "All fields are required.");
    }

    const story = await Story.findByIdAndUpdate({ _id: storyId }, {
        $push: {
            views: loggedUser._id
        }
    }, { new: true });

    if (!story) {
        throw new ApiError(409, "Story not viewed.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, story, "Story seen successfully.")
        );


});


const storyViewed = asyncHandler(async (req, res) => {
    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { storyId } = req.body;

    if (!storyId) {
        throw new ApiError(409, "All fields are required.");
    }

    const story = await Story.findById({ _id: storyId }).populate("views,username profile_picture");

    if (!story) {
        throw new ApiError(409, "Story does not exist.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, story, "Story viewed fetched successfully.")
        );






});

module.exports = { createStory, deleteStory, userAllStory, allStory, reactStory, readReactStory, storyView, storyViewed }; 