const router = require("express").Router();


// secure routes 

router.route("/update-inventory").post();
router.route("/get-inventory").get();
router.route("/nnotification-inventory").post();
router.route("/delete-inventory").post();


module.exports = router;