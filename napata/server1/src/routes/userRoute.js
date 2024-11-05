const { register, login, logout, forgetPassword, resetPassword, currentUser } = require("../controllers/userController");
const {isAuthenticated}= require("../middlewares/authMiddleware");
const router = require("express").Router();



// Unsecured routes of user
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot-password").post(forgetPassword);
router.route("/reset-password").post(resetPassword);

//Secure routes of User
router.route("/logout").post(isAuthenticated,logout);
router.route("/current-user").get(isAuthenticated,currentUser);


module.exports = router;





