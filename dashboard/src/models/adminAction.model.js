const mongoose = require("mongoose");
const { collectionsName } = require("../constants");

const AdminActionSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionsName.user,
    required: true,
  },
  action: { type: String, required: true }, // e.g., "deleted collection", "added user"
  details: { type: String }, // Specific details about the action
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model(collectionsName.adminAction, AdminActionSchema);
