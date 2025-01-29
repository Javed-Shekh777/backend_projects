const authenticated = require("../middlewares/authMiddleware");
const {
  createCart,
  deleteCart,
  getCarts,
  updateCart,
} = require("../controllers/cartController");

const router = require("express").Router();

// secure routes
router.route("/add-to-cart").post(authenticated, createCart);
router.route("/update-cart").patch(authenticated, updateCart);
router.route("/remove-from-cart/:id?").delete(authenticated, deleteCart);
router.route("/get-carts").get(authenticated, getCarts);
// router.route("/get-cart/:id?").get(authenticated,getCart);

module.exports = router;
