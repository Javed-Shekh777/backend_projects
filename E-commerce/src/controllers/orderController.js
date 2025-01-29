const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const asyncHandler = require("../utils/AsyncHandler");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

const createOrder = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  console.log(req.body);
  const { items, totalAmount, shippingAddress } = req.body;

  if (!items || !totalAmount || !shippingAddress) {
    throw new ApiError(402, "All fields are required.");
  }

  const order = await Order.create({
    user_id: loggedIn?._id,
    products: items,
    total_amount: totalAmount,
    shipping_address: shippingAddress,
  });

  const newOrder = await Order.findById({ _id: order?._id });

  if (!newOrder) {
    throw new ApiError(402, "Order not saved.");
  }

  await Cart.updateOne(
    { user_id: loggedIn?._id }, // Find the user's cart
    { $pull: { products: { product_id: items?.product_id } } } // Remove ordered products
  );
  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Order saved successfully."));
});

const updateOrder = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  if (loggedIn.is_admin != true) {
    throw new ApiError(404, "Unauthorized access.");
  }

  const { id, orderStatus, paymentStatus } = req.body;

  if (!id && (!orderStatus || !paymentStatus)) {
    throw new ApiError(402, "All fields are required.");
  }

  const isExistOrder = await Order.findById({ _id: id });

  if (!isExistOrder) {
    throw new ApiError(402, "Order not found.");
  }

  isExistOrder.order_status = orderStatus || isExistOrder.price;
  isExistOrder.payment_staus = paymentStatus || isExistOrder.payment_staus;
  await isExistOrder.save();

  return res
    .status(201)
    .json(new ApiResponse(200, isExistOrder, "Order updated successfully."));
});

const getOrder = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const id = req?.body?.id || req?.params?.id;

  if (!id) {
    throw new ApiError(402, "Order id is missing.");
  }

  const order = await Order.findById({ _id: id });

  if (!order) {
    throw new ApiError(402, "Order not found.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, order, "Order found successfully."));
});

const getAllOrders = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const orders = await Order.find({ user_id: loggedIn._id });

  if (!orders) {
    throw new ApiError(402, "Orders not found.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, orders, "Orders found successfully."));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const id = req?.body?.id || req?.params?.id;
  if (!id) {
    throw new ApiError(402, "Order id is missing.");
  }

  const isExistOrder = await Order.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        order_status: "CANCELLED",
        cancelledAt: new Date(),
      },
    }
  );

  if (!isExistOrder) {
    throw new ApiError(402, "Order not found.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Order cancelled successfully."));
});

module.exports = {
  createOrder,
  getOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
