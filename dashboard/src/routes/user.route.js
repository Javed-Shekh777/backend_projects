const router = require("express").Router();
const authentication = require("../middlewares/authMiddleware");
const {
  register,
  login,
  logout,
  getUser,
  usernameAvailable,
  getAllUser,
  verifyOtp,
  verifyToken,
  forgetPassword,
} = require("../controllers/user/user.controller");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/check-username").get(usernameAvailable);
router.route("/verify-otp").post(verifyOtp);
router.route("/verify-email").get(verifyToken);
router.route("/forget-password").get(forgetPassword);

// Verify OTP

// Verify Link

// Secures routes
router.route("/logout").post(authentication, logout);
router.route("/get-user").get(authentication, getUser);
router.route("/get-all-user").get(authentication, getAllUser);

module.exports = router;
