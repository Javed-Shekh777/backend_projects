const { createPost, readPost, readAllPost, updatePost, deletePost, saveUnsavePost, likeUnlikePost, commentPost, likeUnlikeComment, deleteComment, readAllComment, replyPost, likeUnlikeReply, readAllReply, deleteReply, sharePost, createReel, readReel, updateReel, deleteReel } = require("../controllers/mediaController");
const authUser = require("../middlewares/authMiddlware");
const upload = require("../middlewares/multerConfig");

const router = require("express").Router();


// Secure Post Routes 
router.route("/create-post").post(authUser, upload.array("post"), createPost);
router.route("/read-post").get(authUser, readPost);
router.route("/read-all-post").get(authUser, readAllPost);
router.route("/update-post").post(authUser,upload.array("post"), updatePost);
router.route("/delete-post").post(authUser, deletePost);
router.route("/save-post").post(authUser, saveUnsavePost);
router.route("/like-post").post(authUser, likeUnlikePost);
router.route("/comment-post").post(authUser, commentPost);
router.route("/like-comment").post(authUser, likeUnlikeComment);
router.route("/delete-comment").post(authUser, deleteComment);
router.route("/read-all-comment").get(authUser, readAllComment);
router.route("/reply-post").post(authUser, replyPost);
router.route("/like-reply").post(authUser, likeUnlikeReply);
router.route("/read-all-reply").get(authUser, readAllReply);
router.route("/delete-reply").post(authUser, deleteReply);



router.route("/share-post").post(authUser, sharePost);





// Secure Reel Routes 
router.route("/create-reel").post(authUser, upload.single("reel"), createReel);
router.route("/read-reel").get(authUser, readReel);
router.route("/update-reel").post(authUser, updateReel);
router.route("/delete-reel").post(authUser, deleteReel);





module.exports = router;