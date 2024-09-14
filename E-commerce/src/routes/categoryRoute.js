const router = require("express").Router();


// secure routes 
router.route("/add-category").post();
router.route("/update-category").post();
router.route("/delete-category").post();
router.route("/get-category").get();


module.exports = router;
