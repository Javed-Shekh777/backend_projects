const mongoose = require("mongoose");
const joi = require("joi");
const { collectionsName } = require("../constants");

const notificationSchema = mongoose.Schema({}, { timestapms: true });

const notificationModel = mongoose.model(collectionsName.notifications, notificationSchema);

module.exports = notificationModel;
