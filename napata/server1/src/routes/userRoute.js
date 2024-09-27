const { register, login, logout } = require("../controllers/userController");
const auth = require("");
const auth = require("../middlewares/authMiddleware");
const router = require("express").Router();


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(auth,logout);
router.route("/forgot-password").post();
router.route("/reset-password").post();
router.route("/update").post();
router.route("/get-user").post();
router.route("/delete-user").post();
router.route("/get-all-user").post();


module.exports = router;





