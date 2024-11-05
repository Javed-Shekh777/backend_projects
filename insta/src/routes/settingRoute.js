const { getSetting, updateSetting } = require("../controllers/settingController");
const authUser = require("../middlewares/authMiddlware");

const router = require("express").Router();

router.route("/get-setting").get(authUser,getSetting);
router.route("/update-setting").post(authUser,updateSetting);

module.exports = router;
