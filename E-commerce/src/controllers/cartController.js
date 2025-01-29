const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/AsyncHandler");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

console.log(new Date());

const createCart = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    throw new ApiError(402, "All fields are required.");
  }

  const product = await Product.findById({ _id: productId });
  if (!product) throw new ApiError(403, "Product not found.");

  const price = product.price;

  let cart = await Cart.findOne({ user_id: loggedIn._id });

  if (!cart) {
    cart = new Cart({
      user_id: loggedIn._id,
      products: [{ product_id: productId, quantity: quantity, price: price }],
    });
  } else {
    const productIndex = cart.products.findIndex(
      (item) => item.product_id.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product_id: productId, quantity, price });
    }
  }

  if (!cart) {
    throw new ApiError(403, "Something went wrong.");
  }

  await cart.save();

  await User.findByIdAndUpdate(
    { _id: loggedIn?._id },
    {
      $push: {
        cart: cart._id,
      },
    }
  );
  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Item added successfully."));
});

const getCarts = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const carts = await Cart.find({ user_id: loggedIn._id }).populate(
    "products.product_id",
    "name price description"
  );

  if (!carts) {
    throw new ApiError(402, "Carts not found.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, carts, "Carts found successfully."));
});

// const getCart = asyncHandler(async (req, res) => {
//   const loggedIn = req.user;

//   if (!loggedIn) {
//     throw new ApiError(404, "Unauthorized request.");
//   }

//   const id = req?.body?.id || req?.params?.id;

//   if (!id) {
//     throw new ApiError(404, "Cart id is required.");
//   }

//   const cart = await Cart.findOne({ user_id: loggedIn._id, _id: id }).populate(
//     "products.product_id",
//     "name price description"
//   );

//   if (!cart) {
//     throw new ApiError(402, "Cart not found.");
//   }

//   return res
//     .status(201)
//     .json(new ApiResponse(200, cart, "Cart found successfully."));
// });

const updateCart = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const { quantity, productId } = req.body;

  if (!productId || !quantity) {
    throw new ApiError(402, "All fields are required.");
  }

  let cart = await Cart.findOne({ user_id: loggedIn._id });

  if (!cart) {
    throw new ApiError(402, "Cart not exist.");
  }

  const itemIndex = cart.products.findIndex(
    (item) => item.product_id.toString() === productId
  );
  if (itemIndex > -1) {
    if (quantity > 0) {
      // Update quantity
      cart.products[itemIndex].quantity = quantity;
    } else {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();
    return res
      .status(201)
      .json(new ApiResponse(200, {}, "Item updated successfully."));
  }

  throw new ApiError(402, "Product not found in cart.");
});

const deleteCart = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  console.log(req.body, req.params);
  const id = req?.body?.id || req?.params?.id;

  if (!id) {
    throw new ApiError(402, "Cart id is required.");
  }

  const deletedCart = await Cart.findOne({ user_id: loggedIn._id });

  if (!deletedCart) {
    throw new ApiError(402, "Cart not found.");
  }

  deletedCart.products = deletedCart.products.filter((item) => {
    console.log(item._id.toString());
    return item.product_id.toString() !== id && item._id.toString() !== id;
  });

  await deletedCart.save();
  await User.findByIdAndUpdate(
    { _id: loggedIn?._id },
    {
      $pull: {
        cart: deletedCart._id,
      },
    }
  );

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Cart deleted successfully."));
});

module.exports = {
  createCart,
  getCarts,
  //  getCart,
  updateCart,
  deleteCart,
};
