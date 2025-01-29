const mongoose = require("mongoose");
const joi = require("joi");
const JWT = require("jsonwebtoken");
const { collectionsName } = require("../constants");

const userSchema = mongoose.Schema({}, { timestapms: true });

const userModel = mongoose.model(collectionsName.setting, userSchema);

module.exports = userModel;
