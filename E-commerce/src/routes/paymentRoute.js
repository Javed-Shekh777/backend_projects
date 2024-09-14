const router = require("express").Router();


// secure routes 
router.route("/create-payment").post();
router.route("/update-payment").post();
router.route("/get-payment").get();
router.route("/get-all-payment").get();
router.route("/delete-payment").post();



module.exports = router;
