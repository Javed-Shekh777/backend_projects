const { createProduct, getProduct, updateProduct, deleteProduct, getAllProduct } = require("../controllers/productController");
const authenticated = require("../middlewares/authMiddleware");
const multer = require("../middlewares/multer");


const router = require("express").Router();

// secure routes
router.route("/add-product").post(authenticated,multer.array('images'),createProduct);
router.route("/update-product/:id?").patch(authenticated,multer.array('images'),updateProduct);
router.route("/delete-product/:id?").delete(authenticated,deleteProduct);
router.route("/get-product/:id?").get(authenticated,getProduct);
router.route("/get-all-product").get(authenticated,getAllProduct);

module.exports = router;
