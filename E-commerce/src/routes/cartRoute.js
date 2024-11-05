const authenticated = require("../middlewares/authMiddleware");
const { createCart, deleteCart, getCarts ,upateCart} = require("../controllers/cartController");

const router = require("express").Router();

// secure routes 
router.route("/add-to-cart").post(authenticated,createCart);
router.route("/update-cart").post(authenticated,upateCart);
router.route("/remove-from-cart").post(authenticated,deleteCart);
router.route("/get-carts").get(authenticated,getCarts);



module.exports = router;

