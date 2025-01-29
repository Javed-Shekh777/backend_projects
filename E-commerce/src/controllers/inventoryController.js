const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");
const Inventory = require("../models/InventoryModel");
const mongoose = require("mongoose");
const { lowStockEmail } = require("../helper/mail");

const addInventory = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(403, "Unauthorized request.");
  }

  if (loggedIn.role != true) {
    throw new ApiError(403, "Unauthorized access.");
  }

  const { productId, stock, restockTreshold, supplierInfo } = req.body;

  if (!productId || !stock || !restockTreshold || !supplierInfo) {
    throw new ApiError(402, "All fields are required.");
  }

  const created = await Inventory.create({
    product_id: productId,
    stock: stock,
    restock_threshold: restockTreshold,
    supplier_info: supplierInfo,
    restock_date: Date.now(),
  });

  const newInventory = await Inventory.findById({ _id: created._id });

  if (!newInventory) {
    throw new ApiError(402, "New Inventory not created.");
  }

  return res
    .status(201)
    .json(ApiResponse(200, newInventory, "New Inventory added."));
});

const getInventory = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(403, "Unauthorized request.");
  }

  if (loggedIn.role != true) {
    throw new ApiError(403, "Unauthorized access.");
  }

  const id = req.body?.id || req.params?.id;

  if (!id) {
    throw new ApiError(403, "Inventory id is required.");
  }

  const inventory = await Inventory.findById({ _id: id }).populate(
    "product_id"
  );

  if (!inventory) {
    throw new ApiError(402, "Inventory not exist.");
  }

  return res
    .status(200)
    .json(ApiResponse(200, inventory, "Inventory found successfully."));
});

const getAllInventory = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(403, "Unauthorized request.");
  }

  if (loggedIn.role != true) {
    throw new ApiError(403, "Unauthorized access.");
  }

  const inventories = await Inventory.find().populate("product_id");

  if (!inventories) {
    throw new ApiError(402, "Inventories not exist.");
  }

  return res
    .status(200)
    .json(ApiResponse(200, inventories, "Inventories found successfully."));
});

const updateInventory = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(403, "Unauthorized request.");
  }

  if (loggedIn.role != true) {
    throw new ApiError(403, "Unauthorized access.");
  }

  const { id, stock } = req.body;

  if (!id || (!stock && !restockTreshold && !supplierInfo)) {
    throw new ApiError(403, "All fields are required.");
  }

  const existInventory = await Inventory.findById({ _id: id });

  if (!existInventory) {
    throw new ApiError(403, "Inventory not exist.");
  }

  const updatedItem = await Inventory.findByIdAndUpdate(
    id,
    {
      stock: stock,
      supplier_info: supplierInfo || existInventory.supplier_info,
      restock_threshold: restockTreshold || existInventory.restock_threshold,
    },
    { new: true }
  );

  if (!updatedItem) {
    throw new ApiError(402, "Inventory data not updated.");
  }

  return res
    .status(200)
    .json(ApiResponse(200, updatedItem, "Inventory updated successfully."));
});

const deleteInventory = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(403, "Unauthorized request.");
  }

  if (loggedIn.role != true) {
    throw new ApiError(403, "Unauthorized access.");
  }

  const id = req?.body?.id || req?.params?.id;

  if (!id) {
    throw new ApiError(403, "Inventory id is required.");
  }

  const deletedItem = await Inventory.findByIdAndDelete(id);

  if (!deletedItem) {
    throw new ApiError(402, "Inventory not deleted.");
  }

  return res
    .status(200)
    .json(ApiResponse(200, deletedItem, "Inventory item deleted successfully"));
});

const inventoryFilterOptions = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(403, "Unauthorized request.");
  }

  if (loggedIn.role != true) {
    throw new ApiError(403, "Unauthorized access.");
  }

  const {
    createdDate, // Example: "2024-12-01"
    stockMin, // Minimum stock value
    stockMax, // Maximum stock value
    thresholdMin, // Minimum threshold value
    thresholdMax, // Maximum threshold value
    page = 1, // Default page is 1
    limit = 10, // Default limit is 10 items per page
  } = req.query;

  let filter = {};

  if (createdDate) {
    filter.createdAt = {
      $gte: new Date(createdDate),
    };
  }

  if (stockMax || stockMin) {
    filter.stock = {};
    if (stockMin) filter.stock.$gte = parseInt(stockMin);
    if (stockMax) filter.stock.$lte = parseInt(stockMax);
  }

  if (thresholdMin || thresholdMax) {
    filter.restock_threshold = {};
    if (thresholdMin) filter.restock_threshold.$gte = parseInt(thresholdMin);
    if (thresholdMax) filter.restock_threshold.$lte = parseInt(thresholdMax);
  }

  let skip = parseInt(page - 1) * parseInt(limit);

  const inventoryData = await Inventory.find(filter)
    .populate("product_id")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  if (!inventoryData) {
    throw new ApiError(402, "Data not filtered.");
  }

  const totalItems = await Inventory.countDocuments(filter);

  // Response
  return res.status(200).json(
    ApiResponse(
      200,
      {
        data: inventoryItems,
        pagination: {
          totalItems,
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / limit),
        },
      },
      "Data filtered successfully."
    )
  );
});

const watchInventory = asyncHandler(async () => {
  const inventoryCollection = mongoose.connection.collection("inventory");

  const changeStream = inventoryCollection.watch();
  changeStream.on("change", async (change) => {
    if (change.operationType === "update") {
      const updatedInventory = await inventoryCollection.findOne({
        _id: change.documentKey._id,
      }).populate("product_id");

      if (updatedInventory.stock <= updatedInventory.restock_threshold) {
        lowStockEmail(
          process.env.OWNER_NAME,
          process.env.OWNER_EMAIL,
          updateInventory
        );
      }
    }
  });
});

 

module.exports = {
  addInventory,
  getInventory,
  getAllInventory,
  updateInventory,
  deleteInventory,
  inventoryFilterOptions,
};
