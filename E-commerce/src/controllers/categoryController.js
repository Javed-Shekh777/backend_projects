const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");
const Category = require("../models/categoriesModel");

const createCategory = asyncHandler(async (req, res) => {

    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(404, "Unauthorized request.");
    }

    if (loggedIn.is_admin != true) {
        throw new ApiError(404, "Unauthorized access.");
    }

    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(402, "All fields are required.");
    }

    const category = new Category({
        name,
        description
    });

    const newCategory = await category.save();

    const createdCategory = await newCategory.findById({ _id: newCategory._id });

    if (!createdCategory) {
        throw new ApiError(402, "Category not created.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Category created successfully.")
        );

});


const getCategory = asyncHandler(async (req, res) => {
    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(404, "Unauthorized request.");
    }

    if (loggedIn.is_admin != true) {
        throw new ApiError(404, "Unauthorized access.");
    }

    const { categoryId } = req.body;

    if (!categoryId) {
        throw new ApiError(402, "Category id is required.");
    }

    const categories = await Category.findById({ _id: categoryId });

    if (!categories) {
        throw new ApiError(402, "Category not found.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, categories, "Category found successfully.")
        );

});

const getAllCategory = asyncHandler(async (req, res) => {
    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(404, "Unauthorized request.");
    }

    if (loggedIn.is_admin != true) {
        throw new ApiError(404, "Unauthorized access.");
    }

    const categories = await Category.find();

    if (!categories) {
        throw new ApiError(402, "Categories not found.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, categories, "Categories found successfully.")
        );


});

const upateCategory = asyncHandler(async (req, res) => {
    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(404, "Unauthorized request.");
    }

    if (loggedIn.is_admin != true) {
        throw new ApiError(404, "Unauthorized access.");
    }

    const { name, description, categoryId } = req.body;

    if (categoryId && (name || description)) {
        throw new ApiError(402, "All fields are required.");
    }

    const isExistCategory = await Category.findById({ _id: categoryId });
    if (!isExistCategory) {
        throw new ApiError(402, "Category does not exist.");
    }

    const updatedCategory = await Category.findByIdAndUpdate({ _id: isExistCategory._id }, {
        $set: {
            name: name || isExistCategory.name,
            description: description || isExistCategory.description
        }
    }, {
        new: true
    });

    if (!updatedCategory) {
        throw new ApiError(402, "Category not updated.");
    }

    return res.status(201)
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
    const { categoryId } = req.body;

    if (!categoryId) {
        throw new ApiError(402, "Category id is required.");
    }

    const categories = await Category.findByIdAndDelete({ _id: categoryId });

    if (!categories) {
        throw new ApiError(402, "Category not deleted.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Category deleted successfully.")
        );

});


module.exports = {createCategory,getCategory,getAllCategory,upateCategory,deleteCategory};