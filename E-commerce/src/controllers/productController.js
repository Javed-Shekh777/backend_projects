const { folderName } = require("../constant");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/AsyncHandler");
const { uploadCloudinary, deleteCloudinary } = require("../utils/cloudinary");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Review = require("../models/reviewModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Inventory = require("../models/InventoryModel");

const createProduct = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  if (loggedIn.is_admin !== true) {
    throw new ApiError(404, "Unauthorized access.");
  }

  const { title, description, price, category, brand, stock } = req.body;
  const files = req.files;
 

  if (!title || !description || !price || !category || !brand || !stock) {
    throw new ApiError(402, "All fields are required.");
  }

  if (!files || !req.files) {
    throw new ApiError(402, "Product images not found.");
  }

  const localPaths = files.map((file) => file.path);
  let cloudinaryResponse = null;

  if (localPaths.length > 0) {
    cloudinaryResponse = await uploadCloudinary(localPaths, folderName);
  }

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
    images: cloudinaryResponse?.map((item) => ({
      public_id: item?.public_id,
      url: item?.secure_url,
    })),
  });

  try {
    const newProduct = await product.save();

    const createdProduct = await Product.findById(newProduct._id);

    if (!createdProduct) {
      throw new ApiError(402, "Product not created.");
    }

    return res
      .status(201)
      .json(new ApiResponse(200, {}, "Product created successfully."));
  } catch (error) {
    console.error("Error saving product:", error);
    throw new ApiError(500, "Internal server error.");
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  if (loggedIn.is_admin != true) {
    throw new ApiError(404, "Unauthorized access.");
  }

  const {
    title,
    description,
    price,
    category,
    brand,
    stock,
    id = null,
    oldImages = [],
  } = req.body;
  const files = req?.files || [];

  console.log(req.body, typeof oldImages);
  // console.log(req.files);

  if (
    !id &&
    !req?.params &&
    (title || description || price || category || brand || stock)
  ) {
    throw new ApiError(402, "All fields are required.");
  }

  if (!files && !req?.files && oldImages) {
    throw new ApiError(402, "Product images not found.");
  }

  const isExistProduct = await Product.findById({ _id: id || req?.params.id });
  if (!isExistProduct) {
    throw new ApiError(404, "Product not found.");
  }

  const publicIds = [],
    localPaths = [];
  let cloudinaryResponse = null;

  if (isExistProduct && oldImages) {
    for (const image of oldImages) {
      publicIds.push(image); // Delete from Cloudinary
      isExistProduct.images = isExistProduct.images.filter((imageUrl) => {
        if (imageUrl?.public_id !== image) {
          return {
            ...imageUrl,
          };
        }
      });
    }
  }

  files?.map((file) => localPaths.push(file.path));

  if (localPaths && localPaths.length > 0) {
    cloudinaryResponse = await uploadCloudinary(localPaths, folderName);
  }

  if (localPaths && localPaths.length > 0 && !cloudinaryResponse) {
    throw new ApiError(402, "Images not uploaded.");
  }

  if (publicIds && publicIds.length > 0) {
    try {
      await deleteCloudinary(publicIds);
    } catch (error) {
      throw new ApiError(404, `Product image not deleted ${error}.`);
    }
  }

  isExistProduct.title = title || isExistProduct.title;
  isExistProduct.description = description || isExistProduct.description;
  isExistProduct.price = price || isExistProduct.price;
  isExistProduct.stock = stock || isExistProduct.stock;
  if (cloudinaryResponse && cloudinaryResponse.length > 0) {
    const newImages = cloudinaryResponse.map((item) => ({
      public_id: item?.public_id,
      url: item?.secure_url,
    }));

    // Use push with the spread operator
    isExistProduct.images.push(...newImages);
  }

  await isExistProduct.save();

  const updatedProduct = await Product.findById({
    _id: id || req?.params?.id,
  }).populate("category");

  return res
    .status(201)
    .json(
      new ApiResponse(200, updatedProduct, "Product updated successfully.")
    );
});

const getProduct = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const { id } = req.params;

  if (!id) {
    throw new ApiError(402, "Product id is missing.");
  }

  const product = await Product.findById({ _id: id }).populate("category");

  if (!product) {
    throw new ApiError(402, "Product not found.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, product, "Product found successfully."));
});

const getAllProduct = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const products = await Product.find().populate("category");

  if (!products) {
    throw new ApiError(402, "Products not found.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, products, "Products found successfully."));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  if (loggedIn.is_admin != true) {
    throw new ApiError(404, "Unauthorized access.");
  }

  const id  = req.body?.id || req?.params.id;
  if (!id) {
    throw new ApiError(402, "Product id is missing.");
  }

  const isExistProduct = await Product.findById({ _id: id });

  if (!isExistProduct) {
    throw new ApiError(402, "Product not found.");
  }


  const publicIds = [];

  if (isExistProduct?.images) {
    isPostExist?.images.map((item) =>
      publicIds.push({
        public_id: item?.public_id,
      })
    );
  }

  await Product.deleteOne({ _id: id });

  if (isExistProduct.images && publicIds.length != 0) {
    await deleteCloudinary(publicIds);
  }

  // Remove product from cart
  await Cart.updateMany(
    { "products.product_id": id },
    { $pull: { products: { product_id: id } } }
  );

  // Delete product reviews
  await Review.deleteMany({ product_id: id });

  await Inventory.deleteOne({ product_id: id });

  // Mark product as deleted in orders (do not remove, keep history)
  await Order.updateMany(
    { "products.product_id": id },
    { $set: { status: "CANCELLED" } }
  );

  await User.updateMany(
    {
      $or: [
        { "cart.products.product_id": id },
        { "wishlist.product_id": id },
      ],
    },
    {
      $pull: {
        cart: { "cart.$products$.product_id": id },
        wishlist: { "wishlist.$product_id": id },
      },id
    }
  );

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Product Deleted successfully."));
});

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
};
 