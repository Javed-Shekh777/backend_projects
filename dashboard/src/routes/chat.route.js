const router = require("express").Router();
const {
  createGroupChat,
  createOneToOneChat,
  getMessages,
  getUserChats,
  sendMessages,
} = require("../controllers/chat/chat.controller");
const authentication = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerConfig");

router.route("/get-all-chats").get(authentication, getUserChats);
router.route("/get-all-messages").get(authentication, getMessages);
router.route("/create-chat").post(authentication, createOneToOneChat);
router.route("/create-group-chat").post(authentication, createGroupChat);
router.route("/create-message").post(authentication, sendMessages);
router
  .route("/create-message-media")
  .post(authentication, upload.array("media"), sendMessages);

module.exports = router;
