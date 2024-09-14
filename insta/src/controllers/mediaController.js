const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/AsyncHandler");
const { uploadCloudinary, deleteCloudinary } = require("../utils/cloudinary");
const postFolder = require("../constants");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");


const createPost = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { caption, location = "" } = req.body;

    const files = req.files;
    const file = req.file;

    if (!files || files.length === 0 && (!file)) {
        throw new ApiError(409, "Media file is missing."); // Validate if media files are provided
    }

    let localFilePaths = [];

    if (file) {
        localFilePaths.push(file.path);
    }

    if (files) {
        files.forEach((file) => {
            localFilePaths.push(file.path);
        });
    }


    if (caption === "" && location === "") {
        throw new ApiError(409, "All fields are reuired.");
    }

    const cloudinary = await uploadCloudinary(localFilePaths, postFolder);

    if (!cloudinary || cloudinary.length === 0) {
        throw new ApiError(409, "Media not uploaded.");
    }

    const newPost = new Post({
        caption: caption,
        location: location,
        media: cloudinary.map((file) => {
            return {
                public_id: file.public_id,
                url: file.url,
                resource_type: file.resource_type
            }
        }),
        user_id: loggedUser._id
    });


    const savedPost = await newPost.save();

    await User.findByIdAndUpdate({ _id: loggedUser._id }, {
        $push: { posts: savedPost._id }
    }, { new: true });

    if (!savedPost) {
        throw new ApiError(409, "Post not created.");
    }

    return res.staus(200)
        .json(
            new ApiResponse(200, savedPost, "Post created successfully.")
        );
});



const readPost = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { postId } = req.body;

    if (!postId) {
        throw new ApiError(409, "Post id not found.");
    }

    const post = await Post.findById({ _id: postId }).populate("user_id,username profile_picture").populate("comments");

    if (!post) {
        throw new ApiError(409, "Post not found.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, post, "Post found successfully.")
        );


});



const readAllPost = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const posts = await Post.find().populate("user_id , username profile_picture").populate("comments");

    if (!posts) {
        throw new ApiError(409, "Posts not found.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, posts, "Post found successfully.")
        );

});



const updatePost = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { postId, caption, location = "" } = req.body;

    if (!postId || !caption) {
        throw new ApiError("All fields are required.");
    }

    const files = req.files;
    const file = req.file;

    if (!files || files.length === 0 && (!file)) {
        throw new ApiError(409, "Media file is missing."); // Validate if media files are provided
    }

    let localFilePaths = [];

    if (file) {
        localFilePaths.push(file.path);
    }

    if (files) {
        files.forEach((file) => {
            localFilePaths.push(file.path);
        });
    }

    const isPostExist = await Post.findById({ _id: postId });

    const publicIds = [];

    if (isPostExist?.media) {
        isPostExist?.media.map((item) =>
            publicIds.push(
                {
                    public_id: item.public_id,
                    resource_type: item.resource_type
                }
            )
        );

        await deleteCloudinary(publicIds);
    }

    const cloudinary = await uploadCloudinary(localFilePaths, postFolder);

    if (!newAvatar || cloudinary.length == 0) {
        throw new ApiError(409, "Error occured while uploading profile picture.");
    }

    cloudinary.map((item) => {
        isPostExist.media.push({
            public_id: item.public_id,
            url: item.url,
            resource_type: item.resource_type
        });
    });

    isPostExist.location = location;
    isPostExist.caption = caption;
    await isPostExist.save();

    return res.status(201)
        .json(
            new ApiResponse(200, isPostExist, "Post updated successfully.")
        );




});



const deletePost = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { postId } = req.body;

    if (!postId) {
        throw new ApiError(409, "All fileds are required.");
    }

    const isPostExist = await Post.findById({ _id: postId });

    if (!isPostExist) {
        throw new ApiError(409, "Post not found.");
    }

    await User.findByIdAndUpdate({ _id: loggedUser._id }, {
        $pull: { posts: postId }
    }, { new: true });



    await Comment.deleteMany({post_id:postId});

    const publicIds = [];

    isPostExist.media.map((item)=>{
        publicIds.push({
            public_id:item.public_id,
            resource_type:item.resource_type
        });
    });

    await deleteCloudinary(publicIds);


    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Post Deleted successfully")
        );

});



const likeUnlikePost = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { postId } = req.body;

    if (!postId) {
        throw new ApiError(409, "All fields are required.");
    }

    const isPostExist = await Post.findById({ _id: postId });

    if (!isPostExist) {
        throw new ApiError(409, "Post not found.");
    }

    if (isPostExist.likes.includes(loggedUser._id)) {
        isPostExist.likes.pull(loggedUser._id);
    } else {
        isPostExist.likes.push(loggedUser._id);
    }

    await isPostExist.save();

    return res.status(201)
        .json(
            new ApiResponse(200, isPostExist.likes.length, "Post liked successfully.")
        );

});



const commentPost = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }


    const { comment_text, postId } = req.body;

    if (!comment_text || !postId) {
        throw new ApiError(409, "All fields are required.");
    }

    const isPostExist = await Post.findById({ _id: postId });

    if (!isPostExist) {
        throw new ApiError(409, "Post not exist.");
    }

    const newComment = new Comment({
        comment_text: comment_text,
        user_id: loggedUser._id,
        post_id: postId
    });

    const savedComment = await newComment.save();

    await Post.findByIdAndUpdate({ _id: postId }, {
        $push: { comments: savedComment._id }
    }, { new: true });

    return res.status(201)
        .json(
            new ApiResponse(200, savedComment, "Post commented successfully.")
        );

});



const likeUnlikeComment = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { commentId } = req.body;

    if (!commentId) {
        throw new ApiError(409, "All fields are required.");
    }

    const isCommentExist = await Comment.findById({ _id: commentId });

    if (!isCommentExist) {
        throw new ApiError(409, "Comment does not exist.");
    }

    if (isCommentExist.likes.includes(loggedUser._id)) {
        isCommentExist.likes.pull(loggedUser._id);
    } else {
        isCommentExist.likes.push(loggedUser._id);
    }

    await isCommentExist.save();

    return res.status(201)
        .json(
            new ApiResponse(200, isCommentExist.likes.length, "Comment Likes successfully.")
        );

});



const deleteComment = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { commentId } = req.body;

    if (!commentId) {
        throw new ApiError(409, "All fields are required.");
    }

    const isCommentExist = await Comment.findByIdAndDelete({ _id: commentId });

    if (!isCommentExist) {
        throw new ApiError(409, "Comment not found");
    }



    await Post.findByIdAndDelete({ _id: isCommentExist.post_id }, {
        $pull: { comments: isCommentExist._id }
    }, { new: true });

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Comment Deleted successfully.")
        );
});




const readAllComment = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { postId } = req.body;

    if (!postId) {
        throw new ApiError(409, "All fields are required.");
    }

    const isPostExist = await Comment.find({ post_id: postId }).populate('user_id', 'username profile_picture').populate('replies');

    if (!isPostExist) {
        throw new ApiError(409, "Comments not found.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, isPostExist, "Comments found successfully.")
        );

});



const replyPost = asyncHandler(async (req, res) => {
    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { commentId, reply_text } = req.body;

    if (!commentId, reply_text) {
        throw new ApiError(409, "All fields are required.");
    }

    const isCommentExist = await Comment.findByIdAndUpdate({ _id: commentId }, {
        $push: {
            replies: {
                user_id: loggedUser._id,
                reply_text: reply_text,
                createdAt: Date.now()
            }
        }
    }, { new: true });

    if (!isCommentExist) {
        throw new ApiError(409, "Not replied on comment.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, isCommentExist, "Replied successsfully on comment.")
        );

});



const likeUnlikeReply = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { replyIndex, commentId } = req.body;

    if (!replyIndex || !commentId) {
        throw new ApiError(409, "All fields are required");
    }

    const isCommentExist = await Comment.findById({ _id: commentId });

    if (!isCommentExist || isCommentExist.replies[replyIndex]) {
        throw new ApiError(409, "Comment or reply not found");
    }

    const reply = isCommentExist.replies[replyIndex];

    if (reply.likes.includes[loggedUser._id]) {
        reply.likes.pull(loggedUser._id);
    } else {
        reply.likes.push(loggedUser._id);
    }

    await isCommentExist.save();

    return res.status(201)
        .json(
            new ApiResponse(200, reply.likes.length, "Reply liked successfully.")
        );
});



const readAllReply = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { commentId } = req.body;

    if (!commentId) {
        throw new ApiError(409, "All fields are required.");
    }

    const isCommentExist = await Comment.findById({ _id: commentId }).populate("replies");

    if (!isCommentExist) {
        throw new ApiError(409, "Comment or reply not found.");
    }

    return res.status(201)
        .json(new
            ApiResponse(200, isCommentExist, "Reply found successfully.")
        );

});



const deleteReply = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { commentId, replyIndex } = req.body;

    if (!commentId || replyIndex) {
        throw new ApiError(409, "All fields are required.");
    }

    const isCommentExist = await Comment.findByIdAndUpdate({ _id: commentId }, {
        $pull: { replies: replyIndex }
    }, { new: true }).populate("replies,user_id");

    if (!isCommentExist) {
        throw new ApiError(409, "Reply not found.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, isCommentExist, "Reply deleted successfully")
        );

});




const sharePost = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

});



const saveUnsavePost = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

    const { postId } = req.body;

    if (!postId) {
        throw new ApiError(409, "All fields are required.");
    }

    const user = await User.findById({ _id: loggedUser._id });

    if (user.saved_posts.includes(postId)) {
        user.saved_posts.pull(postId);
    } else {
        user.saved_posts.push(postId);
    }

    await user.save();

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Post saved successfully.")
        );


});



const createReel = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

});



const readReel = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

});



const updateReel = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

});



const deleteReel = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthprized request.");
    }

});



module.exports = { createPost, readPost, readAllPost, updatePost, deletePost, saveUnsavePost, likeUnlikePost, commentPost, likeUnlikeComment, deleteComment, readAllComment, replyPost, likeUnlikeReply, readAllReply, deleteReply, sharePost, createReel, readReel, updateReel, deleteReel }; 