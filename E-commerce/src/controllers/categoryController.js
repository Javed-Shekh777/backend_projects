const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");
const Category = require("../models/categoryModel");
const ApiResponse = require("../utils/ApiResponse");

const createCategory = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  if (loggedIn.is_admin != true) {
    throw new ApiError(404, "Unauthorized access.");
  }

  const { name, description, parentCategory } = req.body;

  if (!name || !description) {
    throw new ApiError(402, "All fields are required.");
  }

  const category = new Category({
    name,
    description,
    parentCategory,
  });

  const newCategory = await category.save();
  const createdCategory = await Category.findById({
    _id: newCategory._id,
  });

  if (!createdCategory) {
    throw new ApiError(402, "Category not created.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Category created successfully."));
});

const getCategory = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  if (loggedIn.is_admin != true) {
    throw new ApiError(404, "Unauthorized access.");
  }

  const { id } = req.params;

  if (!id) {
    throw new ApiError(402, "Category id is required.");
  }

  const categories = await Category.findById({ _id: id }).populate(
    "parentCategory"
  );

  if (!categories) {
    throw new ApiError(402, "Category not found.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, categories, "Category found successfully."));
});

const getAllCategory = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  if (loggedIn.is_admin != true) {
    throw new ApiError(404, "Unauthorized access.");
  }

  const categories = await Category.find().populate("parentCategory");

  if (!categories) {
    throw new ApiError(402, "Categories not found.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, categories, "Categories found successfully."));
});

const upateCategory = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  if (loggedIn.is_admin != true) {
    throw new ApiError(404, "Unauthorized access.");
  }
 
  const { name, description, id,parentCategory } = req.body;

  if ((!id && !req?.params ) && (name || description || parentCategory)) {
    throw new ApiError(402, "All fields are required.");
  }

  const isExistCategory = await Category.findById({ _id: id || req?.params?.id});
  if (!isExistCategory) {
    throw new ApiError(402, "Category does not exist.");
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    { _id: isExistCategory._id },
    {
      $set: {
        name: name || isExistCategory.name,
        description: description || isExistCategory.description,
        parentCategory: parentCategory || isExistCategory.parentCategory,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedCategory) {
    throw new ApiError(402, "Category not updated.");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, updatedCategory, "Category updated successfully.")
    );
});

const deleteCategory = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  if (loggedIn.is_admin != true) {
    throw new ApiError(404, "Unauthorized access.");
  }
  const { id } = req.params;

  if (!id) {
    throw new ApiError(402, "Category id is required.");
  }

  const categories = await Category.findByIdAndDelete({ _id: id });

  if (!categories) {
    throw new ApiError(402, "Category not deleted.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Category deleted successfully."));
});

module.exports = {
  createCategory,
  getCategory,
  getAllCategory,
  upateCategory,
  deleteCategory,
};
