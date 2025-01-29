const mongoose = require("mongoose");
const { collectionsName } = require("../constants");

const databaseSchema = mongoose.Schema(
  {
    dbName: { type: String, required: true, unique: true },
    collections: [
      {
        name: { type: String },
        documents: [{ type: mongoose.Schema.Types.Mixed }],
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collectionsName.user,
    },
  },
  { timestapms: true }
);

const databaseModel = mongoose.model(collectionsName.database, databaseSchema);

module.exports = databaseModel;
