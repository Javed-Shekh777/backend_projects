const router = require("express").Router();
const { createOrder, updateOrder, deleteOrder, getOrder, getAllOrders } = require("../controllers/orderController");
const authenticated = require("../middlewares/authMiddleware");


// secure routes 
router.route("/create-order").post(authenticated,createOrder);
router.route("/update-order/:id?").patch(authenticated,updateOrder);
router.route("/delete-order/:id?").delete(authenticated,deleteOrder);
router.route("/get-order/:id?").get(authenticated,getOrder);
router.route("/get-all-order").get(authenticated,getAllOrders);


module.exports = router;
