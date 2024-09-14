const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        required: true,
        trim: true
    },
    mobile_number: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: [true, "Username should be unique"],
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email Id is required"],
        unique: [true, "Email Id should be unique"],
        lowercase: true,
        trim: true,
    },
    dob:{
        type:String,
    },
    password: {
        type: String,
        required: [true, "Passwerd is required"],
    },
    bio: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    profile_picture: {
        public_id: {
            type: String,
        },
        url: {
            type: String
        },
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
    }],
    stories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "story",
    }],
    saved_posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "savedPosts",
    }],
    notification: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "notification",
    }],
    is_verified: {
        type: Boolean,
        default: false
    },
    private_account: {
        type: Boolean,
        default: false
    },
    blocked_users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }],
    close_friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }],
    date_joined: {
        type: Date,
    },
    last_login: {
        type: Date
    },
    device_info: [{
        device_type: { type: String },
        device_id: { type: String },
        login_time: { type: Date }
    }],

    usage_data: {
        total_likes: { type: Number },
        total_posts: { type: Number },
        total_comments: { type: Number },
        total_stories: { type: Number },
        total_reels: { type: Number },
        total_followers: { type: Number },
        total_following: { type: Number },
        average_time_spent: { type: Number }
    },
    setting: {
        notification: {
            likes: { type: Boolean, default: true },
            comments: { type: Boolean, default: true },
            newFollowers: { type: Boolean, default: true },
            directMessages: { type: Boolean, default: true },
            mentions: { type: Boolean, default: true }
        },

        privacy: {
            account_privacy: { type: String },
            activity_status: { type: Boolean, default: true },
            story_sharing: { type: Boolean, default: true },
            message_replies: { type: String },
            tagging: { type: String },
        }
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    verify_code: {
        type: String,
    },
    verify_code_expiry: {
        type: Date,
        default: Date.now,
    },
    refresh_token: {
        type: String,
    },
    access_token: {
        type: String,
    },
},
    {
        timestamps: true
    });



userSchema.pre("save", async function (next) {
    if (!(this.isModified("password"))) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {

    const correct = await bcrypt.compare(password, this.password);
    return correct;
};


userSchema.methods.generateAccessToken = function () {
    return JWT.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        name: this.name,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};


userSchema.methods.generateRefreshToken = function () {
    return JWT.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};






const userModel = mongoose.model("user", userSchema);

module.exports = userModel;