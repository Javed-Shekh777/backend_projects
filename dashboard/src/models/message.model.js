const mongoose = require("mongoose");
const { collectionsName } = require("../constants");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionsName.chat,
      required: true,
      index: true, // ✅ Index for faster queries
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionsName.user,
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionsName.user,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio", "link", "pdf"],
      default: "text",
    },
    content: { type: String }, // ✅ Used for text and links

    media: [
      {
        url: { type: String }, // ✅ Media file URL (Cloudinary, S3, etc.)
        publicId: { type: String }, // ✅ Cloudinary publicId (if using Cloudinary)
        type: { type: String }, // ✅ "image", "video", "audio", "pdf"
        size: { type: Number }, // ✅ File size in bytes
        name: { type: String }, // ✅ Original filename
        duration: { type: String }, // ✅ For video/audio
        pages: { type: String }, // ✅ For PDF
      },
    ],

    reactions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: collectionsName.user,
        },
        emoji: { type: String, default: "" },
      },
    ],

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionsName.message, // ✅ Fix: Should reference `message`, not `user`
    },

    forwarded: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },

    seenAt: { type: Date }, // ✅ Timestamp for read receipt
  },
  { timestamps: true } // ✅ `createdAt` and `updatedAt` auto-generated
);

module.exports = mongoose.model(collectionsName.message, messageSchema);
