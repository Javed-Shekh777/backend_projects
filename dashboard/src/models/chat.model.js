const mongoose = require("mongoose");
const { collectionsName } = require("../constants");

const chatSchema = new mongoose.Schema(
  {
    isGroupChat: { type: Boolean, default: false },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: collectionsName.user,
      },
    ],
    groupDetails: {
      name: { type: String, default: "" }, // ✅ Group name (Only for group chats)
      groupPic: {
        publicId: { type: String, trim: true },
        url: { type: String, trim: true },
      },
      admins: [
        { type: mongoose.Schema.Types.ObjectId, ref: collectionsName.user },
      ], // ✅ List of group admins
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collectionsName.user,
      }, // ✅ Who created the group
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionsName.message,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(collectionsName.chat, chatSchema);
