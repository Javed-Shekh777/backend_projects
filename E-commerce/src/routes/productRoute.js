const router = require("express").Router();



// secure routes 
router.route("/add-product").post();
router.route("/update-product").post();
router.route("/delete-product").post();
router.route("/get-product").get();
router.route("/get-all-product").get();


module.exports = router;
