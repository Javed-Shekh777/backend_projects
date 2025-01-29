const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { collectionsName } = require("../constants");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      min: [3, "Username should be minimum 3 characters."],
      max: [40, "Username should be maximum 40 characters"],
      unique: [true, "Username already exist."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required "],
      unique: [true, "Email already exist"],
      trim: true,
    },
    password: {
      type: String,
      min: [6, "Password should be minimum 6 characters."],
      max: [16, "Password should be maximum 16 characters"],
      trim: true,
    },
    profilePicture: {
      publicId: { type: String, trim: true },
      url: { type: String, trim: true },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    status: { type: String, default: "Hey there, I'm using ChatApp!" },
    onlineStatus: {
      type: String,
      enum: ["online", "offline", "away"],
      default: "offline",
    },
    lastSeen: { type: Date, default: Date.now() },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: collectionsName.user,
      },
    ],
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: collectionsName.user,
      },
    ],
    settings: {
      notifications: true,
      privacy: {
        lastSeen: {
          type: String,
          enum: ["everyone", "contacts", "novody"],
          default: "everyone",
        },
        profilePic: {
          type: String,
          enum: ["everyone", "contacts", "novody"],
          default: "everyone",
        },
        status: {
          type: String,
          enum: ["everyone", "contacts", "novody"],
          default: "everyone",
        },
        readReceipts: true,
      },
    },
    token: {
      type: String,
    },
    tokenExpiry: {
      type: Date,
      default: Date.now,
    },
    otp: {
      type: String,
      default: "",
    },
    otpExpiry: {
      type: Date,
      default: Date.now,
    },
  },
  { timestapms: true }
);

// Encrypting the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generating Auth Tookens
userSchema.methods.generateAuthToken = async function () {
  const token = JWT.sign(
    { _id: this._id, email: this.email, role: this.role },
    process.env.SECRET_TOKEN,
    { expiresIn: process.env.SECRET_TOKEN_EXPIRY }
  );

  let currentDate = new Date();

  let futureDate = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000);

  this.token = token;
  this.tokenExpiry = futureDate;
  await this.save();
  return token;
};

// Compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const userModel = mongoose.model(collectionsName.user, userSchema);

module.exports = userModel;
