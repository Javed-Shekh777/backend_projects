const { folderName } = require("../constant");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");
const { uploadCloudinary, deleteCloudinary } = require("../utils/cloudinary");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Review = require("../models/reviewModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");

const createProduct = asyncHandler(async (req, res) => {

    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(404, "Unauthorized request.");
    }

    if (loggedIn.is_admin != true) {
        throw new ApiError(404, "Unauthorized access.");
    }

    const { title, description, price, category, brand, stock } = req.body;
    const files = req.files;


    if (!title || !description || !price || !category || !brand || !stock) {
        throw new ApiError(402, "All fields are required.");
    }

    if (!files && !req.file) {
        throw new ApiError(402, "Product images not found.");
    }

    const localPaths = [];

    files.map((file) => {
        localPaths.push(file.path);
    });

    const cloudinaryResponse = await uploadCloudinary(localPaths, folderName);

    if (!cloudinaryResponse) {
        throw new ApiError(402, "Images not uploaded.");
    }

    const product = new Product({
        title,
        description,
        price,
        brand,
        stock,
        category,
        images: cloudinaryResponse.map((item) => {
            return {
                public_id: item.public_id,
                url: item?.secure_url
            }
        })
    });

    const newProduct = await product.save();

    const createdProduct = await Product.findById({ _id: newProduct._id });

    if (!createdProduct) {
        throw new ApiError(402, "Product not created.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, createdProduct, "Product created successfully.")
        );


});



const updateProduct = asyncHandler(async (req, res) => {

    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(404, "Unauthorized request.");
    }

    if (loggedIn.is_admin != true) {
        throw new ApiError(404, "Unauthorized access.");
    }

    const { title, description, price, stock, productId } = req.body;

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

    if (productId && (!title && !description && !price && !stock)) {
        throw new ApiError(402, "All fields are required.");
    }

    const isExistProduct = await Product.findById({ _id: productId });

    if (!isExistProduct) {
        throw new ApiError(402, "Product not found.");
    }

    const publicIds = [];

    if (isExistProduct?.images) {
        isPostExist?.images.map((item) =>
            publicIds.push(
                {
                    public_id: item?.public_id,
                }
            )
        );
    }

    const cloudinary = await uploadCloudinary(localFilePaths, folderName);

    if (cloudinary.length == 0) {
        throw new ApiError(409, "Error occured while uploading profile picture.");
    }

    if (isExistProduct.images && publicIds.length != 0) {
        await deleteCloudinary(publicIds);
    }

    const cloudinaryResponse = await uploadCloudinary(imagesToUpload, folderName);

    if (!cloudinaryResponse) {
        throw new ApiError(402, "Images not uploaded.");
    }

    cloudinary.map((item) => {
        isExistProduct.images.push({
            public_id: item?.public_id,
            url: item?.secure_url,
        });
    });

    isExistProduct.title = title || isExistProduct.title;
    isExistProduct.description = description || isExistProduct.description;
    isExistProduct.price = price || isExistProduct.price;
    isExistProduct.stock = stock || isExistProduct.stock;
    await isExistProduct.save();


    return res.status(201)
        .json(
            new ApiResponse(200, isExistProduct, "Product updated successfully.")
        );
});



const getProduct = asyncHandler(async (req, res) => {
    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(404, "Unauthorized request.");
    }

    const { productId } = req.body;

    if (!productId) {
        throw new ApiError(402, "Product id is missing.");
    }

    const product = await Product.findById({ _id: productId });

    if (!product) {
        throw new ApiError(402, "Product not found.");
    }

    return res.status(201)
        .json(
            new
                ApiResponse(200, product, "Product found successfully.")
        );
});


const getAllProduct = asyncHandler(async (req, res) => {
    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(404, "Unauthorized request.");
    }

    const products = await Product.find();

    if (!products) {
        throw new ApiError(402, "Products not found.");
    }

    return res.status(201)
        .json(
            new
                ApiResponse(200, products, "Products found successfully.")
        );



});

const deleteProduct = asyncHandler(async (req, res) => {

    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(404, "Unauthorized request.");
    }

    if (loggedIn.is_admin != true) {
        throw new ApiError(404, "Unauthorized access.");
    }



    const { productId } = req.body;
    if (!productId) {
        throw new ApiError(402, "Product id is missing.");
    }

    const isExistProduct = await Product.findById({ _id: productId });

    if (!isExistProduct) {
        throw new ApiError(402, "Product not found.");
    }

    const publicIds = [];

    if (isExistProduct?.images) {
        isPostExist?.images.map((item) =>
            publicIds.push(
                {
                    public_id: item?.public_id,
                }
            )
        );
    }

    await Product.deleteOne({ _id: productId });

    if (isExistProduct.images && publicIds.length != 0) {
        await deleteCloudinary(publicIds);
    }


    // Remove product from cart
    await Cart.updateMany(
        { "products.product_id": productId },
        { $pull: { products: productId } }
    );

    // Delete product reviews
    await Review.deleteMany({ product_id: productId });

    // Mark product as deleted in orders (do not remove, keep history)
    await Order.updateMany(
        { "products.product_id": productId },
        { $set: { "status": "CANCELLED" } }
    );

    await User.updateMany({
        $or: [
            { "cart.products.product_id": productId },
            { "wishlist.product_id": productId }
        ]
    }, {
        $pull: {
            cart: { "cart.$products$.product_id": productId },
            wishlist: { "wishlist.$product_id": productId }
        }
    });


    return res.status(201)
        .json(
            new
                ApiResponse(200, {}, "Product Deleted successfully.")
        );
});



module.exports = {createProduct,getProduct,getAllProduct,updateProduct,deleteProduct};

