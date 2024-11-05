const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");

const createCart = asyncHandler(async (req, res) => {

    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(404, "Unauthorized request.");
    }


    const { products } = req.body;

    if (!products) {
        throw new ApiError(402, "All fields are required.");
    }

    let cart = await Cart.findOne({ user_id: loggedIn._id });

    cart = cart.products || [];


    const category = new Cart({
        user_id: loggedIn._id,
        products: [...cart, ...products]
    });

    const newCart = await category.save();

    const createdCart = await Cart.findById({ _id: newCart._id });

    if (!createdCart) {
        throw new ApiError(402, "Cart not created.");
    }


    await User.findByIdAndUpdate({_id:loggedIn._id},{
        $push:{cart:createdCart._id}
    });


    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Item added successfully.")
        );

});


const getCarts = asyncHandler(async (req, res) => {
    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(404, "Unauthorized request.");
    }

    const updatedCart = await Cart.findOneAndUpdate(
        { user_id: loggedIn._id, "products.product_id": productId },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
    );

    if (!updatedCart) {
        throw new ApiError(402, "Carts not updated.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, updatedCart, "Carts found successfully.")
        );

});


const upateCart = asyncHandler(async (req, res) => {
    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(404, "Unauthorized request.");
    }


    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        throw new ApiError(402, "All fields are required.");
    }

    let cart = await Cart.findOne({ user_id: loggedIn._id });

    if (!cart) {
        throw new ApiError(402, "Cart not exist.");
    }

    let index = cart.products.find((item) => item.product_id == productId);
    cart.products[index].quantity = quantity;
    await cart.save();


    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Item updated successfully.")
        );

});

const deleteCart = asyncHandler(async (req, res) => {
    const loggedIn = req.user;

    if (!loggedIn) {
        throw new ApiError(404, "Unauthorized request.");
    }


    
    const { productId } = req.body;

    if (!productId) {
        throw new ApiError(402, "Product id is required.");
    }

    const updatedCart = await Cart.findOneAndUpdate(
        { user_id: loggedIn._id },
        { $pull: { products: { product_id: productId } } },
        { new: true }
    );

    if (!updatedCart) {
        throw new ApiError(402, "Cart not deleted.");
    }

    await User.findByIdAndUpdate({_id:loggedIn._id},{
        $pull:{cart:updatedCart._id}
    });

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Cart deleted successfully.")
        );

});


module.exports = {createCart,getCarts,upateCart,deleteCart};