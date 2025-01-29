const {
  register,
  verifyUser,
  login,
  logout,
  updateUser,
  getUser,
  getAllUser,
  forgetPassword,
  resetPassword,
  deleteAccount,
} = require("../controllers/userController");
const authenticated = require("../middlewares/authMiddleware");
const router = require("express").Router();

// Simple user routes
router.route("/register").post(register);
router.route("/verify/:token?").get(verifyUser);

router.route("/login").post(login);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password").post(resetPassword);

// Secure  User routes
router.route("/logout").post(authenticated, logout);
router.route("/update-user/:id?").patch(authenticated, updateUser);
router.route("/get-user").get(authenticated, getUser);
router.route("/get-all-user").get(authenticated, getAllUser);
router.route("/delete-user/:id").delete(authenticated, deleteAccount);

module.exports = router;
