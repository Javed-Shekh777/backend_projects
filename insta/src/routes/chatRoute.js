const { createChat, deleteChat, deleteMessage } = require("../controllers/chatController");
const authUser = require("../middlewares/authMiddlware");

const router = require("express").Router();

router.route("/create-chat").post(authUser,createChat);
router.route("/delete-chat").post(authUser,deleteChat);
router.route("/delete-message").post(authUser,deleteMessage);


module.exports = router;
