const { isAuthenticated } = require("../middlewares/authMiddleware");

const router = require("express").Router();


// Secure routes for Voter 
router.route("/add-vote").post(isAuthenticated);
router.route("/active-elections").get(isAuthenticated);
router.route("/vote-status").get(isAuthenticated);



module.exports =router;
