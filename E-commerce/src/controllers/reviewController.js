const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

const createReviwer = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const { productId, rating, comment } = req.body;

  if (!productId || !rating || !comment) {
    throw new ApiError(404, "All fields are required.");
  }

  const product = await Product.findById({ _id: productId }).populate(
    "reviews"
  );
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find((review) => {
    return review.user_id.toString() === loggedIn._id.toString();
  });

  if (alreadyReviewed) {
    throw new ApiError(403, "You have already reviewed this product.");
  }

  const review = await Review.create({
    user_id: loggedIn?._id,
    product_id: productId,
    rating: rating,
    comment: comment,
  });

  const newReviewer = await Review.findById({ _id: review._id });

  if (!newReviewer) {
    throw new ApiError(409, "Something went wrong.");
  }

  if (newReviewer) {
    product.reviews.push(newReviewer._id);
  }

  await product.save();

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Review created successfully ."));
});

const updateReview = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const { id = null, rating } = req.body;

  if (!rating) {
    throw new ApiError(404, "All fields are required.");
  }

  const updatedReviewer = await Review.findByIdAndUpdate(
    { _id: id || req?.params?.id },
    {
      $set: {
        rating,
      },
    },
    { new: true }
  );

  if (!updatedReviewer) {
    throw new ApiError(409, "Something went wrong.");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, updatedReviewer, "Review updated successfully .")
    );
});

const likeAndDislikeReview = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  console.log(req.body, req.params);
  const id = req?.params?.id || req?.body?.id;

  console.log(id);

  if (!id) {
    throw new ApiError(404, "All fields are required.");
  }

  let isLiked = false;
  const isReviewExist = await Review.findOne({ _id: id });

  if (!isReviewExist) {
    throw new ApiError(409, "Review not exist.");
  }

  if (isReviewExist.likes.includes(loggedIn._id)) {
    isReviewExist.likes.pull(loggedIn._id);
    isLiked = false;
  } else {
    isReviewExist.likes.push(loggedIn._id);
    isLiked = true;
  }

  await isReviewExist.save();

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        {},
        `User ${isLiked ? "Liked" : "Unliked"}  successfully.`
      )
    );
});

const getAllReviewer = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const reviewer = await Review.find();

  if (!reviewer) {
    throw new ApiError(404, "Reviewers not fetched.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, reviewer, "Reviewers fetched successfully."));
});

const getReviewer = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const id = req?.params?.id || req?.body?.id;

  if (!id) {
    throw new ApiError(402, "Review Id is required.");
  }

  const reviewer = await Review.findById({ _id: id });

  if (!reviewer) {
    throw new ApiError(404, "Reviewer not fetched.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, reviewer, "Reviewer fetched successfully."));
});

const deleteReview = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const reviewId = req?.params?.reviewId || req?.body?.reviewId;

  const productId = req?.params?.productId || req?.body?.productId;

  if (!productId || !reviewId) {
    throw new ApiError(402, "All fields are required.");
  }

  const product = await Product.findById({ _id: productId }).populate(
    "reviews"
  );
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // Check if user already reviewed
  console.log(product);
  console.log(product.reviews);

  const alreadyReviewed = product.reviews.find(
    (rev) =>
      rev?._id?.toString() === reviewId &&
      rev?.user_id?.toString() === loggedIn?._id?.toString()
  );

  //   const alreadyReviewed = product?.reviews?.find((review) => {
  //     return review?._id?.toString(),
  //       reviewId?.toString() && review?.user_id?.toString(),
  //       loggedIn?._id.toString();
  //   });

  if (!alreadyReviewed) {
    throw new ApiError(404, "Review not found or unauthorized.");
  }

  const reviewer = await Review.findByIdAndDelete({ _id: reviewId });

  console.log("Deleted Review:", reviewer);
  if (!reviewer) {
    throw new ApiError(404, "Reviewer not deleted.");
  }

  product.reviews = product.reviews.filter(
    (review) => review._id.toString() !== reviewId.toString()
  );

  await product.save();
  return res
    .status(201)
    .json(new ApiResponse(200, reviewer, "Reviewer deleted successfully."));
});

module.exports = {
  createReviwer,
  likeAndDislikeReview,
  getAllReviewer,
  getReviewer,
  updateReview,
  deleteReview,
};
