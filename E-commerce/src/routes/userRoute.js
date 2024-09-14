const { register, login, logout, updateUser, getUser, getAllUser,forgotPassword,resetPassword } = require("../controllers/userController");
const authenticated = require("../middlewares/authMiddleware");

const router = require("express").Router();



router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot-password").get( forgotPassword);
router.route("/reset-password").get( resetPassword);


// secure routes
router.route("/logout").post(authenticated, logout);
router.route("/update-user").post(authenticated, updateUser);
router.route("/get-user").get(authenticated, getUser);
router.route("/get-all-user").get(authenticated, getAllUser);



// router.route("/delete-user").post();




module.exports = router;
