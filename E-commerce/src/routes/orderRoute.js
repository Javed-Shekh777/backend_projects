const router = require("express").Router();

// secure routes 
router.route("/create-order").post();
router.route("/update-order").post();
router.route("/delete-order").post();
router.route("/get-order").get();
router.route("/get-all-order").get();


module.exports = router;
