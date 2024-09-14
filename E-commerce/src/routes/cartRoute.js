const router = require("express").Router();

// secure routes 
router.route("/add-to-cart").post();
router.route("/update-cart").post();
router.route("/remove-from-cart").post();


module.exports = router;

