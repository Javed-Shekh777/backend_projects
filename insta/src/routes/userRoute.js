const express = require("express");
const authUser = require("../middlewares/authMiddlware.js");
const upload = require("../middlewares/multerConfig.js");
const { userLogin, userLogout, userRegister, verifyEmail, checkUsername, forgotPassword, resetPassword, allUser, userUpdate, currentUser, searchUser, refreshToken, userFollow, userUnfollow, userFollowing, userFollowers, profilePicture, userBlockUnblock, userBlockList, closeUncloseFriend, privateAccount,userProfile } = require("../controllers/userController.js");


// Creating a router 
const router = express.Router();


// Simple routes 
router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/verify-email").post(verifyEmail);
router.route("/check-username").get(checkUsername);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/refresh_token").post(refreshToken);






// secure routes 
router.route("/logout").post(authUser, userLogout);
router.route("/update").post(authUser, userUpdate);
router.route("/current-user").get(authUser, currentUser);
router.route("/search-user").get(authUser, searchUser);
router.route("/user-follow").post(authUser, userFollow);
router.route("/user-unfollow").post(authUser, userUnfollow);
router.route("/user-following").get(authUser, userFollowing);
router.route("/user-followers").get(authUser, userFollowers);
router.route("/profile_picture").post(authUser, upload.single("profile_picture"), profilePicture);
router.route("/user-block").post(authUser, userBlockUnblock);
router.route("/user-blocklist").get(authUser, userBlockList);
router.route("/user-closefriend").post(authUser, closeUncloseFriend);
router.route("/private").post(authUser, privateAccount);







router.route("/get-user-profile/:_id").get(authUser, userProfile);



// admin routes 
router.route("/get-all-user").get(authUser, allUser);
// router.route("/delete-user")




module.exports = router;


