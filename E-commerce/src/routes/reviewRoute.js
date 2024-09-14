const router = require("express").Router();


// secure routes 
router.route("/add-review").post();
router.route("/update-review").post();
router.route("/delete-review").post();
router.route("/get-review").get();
router.route("/get-all-review").get();


module.exports = router;
