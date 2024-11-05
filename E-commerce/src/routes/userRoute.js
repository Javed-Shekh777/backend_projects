const { register, login, logout, updateUser, currentUser, getAllUser, forgetPassword, resetPassword, deleteAccount } = require("../controllers/userController");
const authenticated = require("../middlewares/authMiddleware");
const router = require("express").Router();


// Simple user routes 
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password").post(resetPassword);


// Secure  User routes
router.route("/logout").post(authenticated, logout);
router.route("/update-user").post(authenticated, updateUser);
router.route("/current-user").get(authenticated, currentUser);
router.route("/get-all-user").get(authenticated, getAllUser);



router.route("/delete-user").post(authenticated, deleteAccount);




module.exports = router;
