const loggednIn = require("../middleware/auth.middleware");
const createPost = require("../controllers/post/create.controller");
const readPost = require("../controllers/post/read.controller");
const readAllPost = require("../controllers/post/readall.controller");
const deletePost = require("../controllers/post/delete.controller");
const deleteAllPost = require("../controllers/post/deleteall.controller");
const updatePost = require("../controllers/post/update.controller");
const postLike = require("../controllers/post/postLike.controller");
const postComment = require("../controllers/post/postComment.controller");
const postDislike = require("../controllers/post/postDislike");
const deleteComment = require("../controllers/post/deleteComment.controller");


const router = require("express").Router();


router.route("/create").post(loggednIn,createPost);
router.route("/read").post(loggednIn,readPost);
router.route("/readall").post(loggednIn,readAllPost);
router.route("/delete").post(loggednIn,deletePost);
router.route("/deleteall").post(loggednIn,deleteAllPost);
router.route("/update").post(loggednIn,updatePost);
router.route("/postlike").post(loggednIn,postLike);
router.route("/postdislike").post(loggednIn,postDislike);
router.route("/postcomment").post(loggednIn,postComment);
router.route("/deletecomment").post(loggednIn,deleteComment);






module.exports = router;