const mongoose = require("mongoose");
const { collectionsName } = require("../constants");
const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // File or folder name
    type: { type: String, enum: ["file", "folder"], required: true }, // Type
    content: { type: String }, // File content or file URL
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionsName.fileExplorer,
    }, // Reference to parent folder
    owner: { type: mongoose.Schema.Types.ObjectId, ref: collectionsName.user }, // File owner
    sharedWith: [
      { type: mongoose.Schema.Types.ObjectId, ref: collectionsName.user },
    ], // Shared users
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model(collectionsName.fileExplorer, fileSchema);
