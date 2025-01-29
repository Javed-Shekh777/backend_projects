const router = require("express").Router();
const authenticated = require("../middlewares/authMiddleware");
const { createPayment,getPayment,getAllPayment,deletePayment,webHookPayment ,verifyPayment} = require("../controllers/paymentController");



// secure routes 
router.route("/create-payment").post(authenticated,createPayment);
router.route("/get-payment").get(authenticated,getPayment);
router.route("/get-all-payment").get(authenticated,getAllPayment);
router.route("/delete-payment").delete(authenticated,deletePayment);
router.route("/webhook").post(authenticated,webHookPayment);
router.route("/verify-paument").post(authenticated,verifyPayment);




module.exports = router;
