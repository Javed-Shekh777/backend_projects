const router = require("express").Router();
const {
  createReviwer,
  deleteReview,
  getReviewer,
  getAllReviewer,
  likeAndDislikeReview,
  updateReview,
} = require("../controllers/reviewController");
const authenticated = require("../middlewares/authMiddleware");

// secure routes
router.route("/add-review").post(authenticated, createReviwer);
router
  .route("/delete-review/:productId?/:reviewId?")
  .delete(authenticated, deleteReview);
router.route("/get-review/:id?").get(authenticated, getReviewer);
router.route("/update-review/:id?").patch(authenticated, updateReview);

router.route("/get-all-review").get(authenticated, getAllReviewer);
router.route("/like-unlike/:id?").post(authenticated, likeAndDislikeReview);

module.exports = router;
