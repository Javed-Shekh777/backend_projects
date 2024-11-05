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
        default:Date.now
    },
    last_login: {
        type: Date,
        default:Date.now
    },
    device_info: [{
        device_type: { type: String,default:"" },
        device_id: { type: String,default:"" },
        login_time: { type: Date,default:"" },
        ip:{type:String,default:""}
    }],

    usage_data: {
        total_likes: { type: Number ,default:0},
        total_posts: { type: Number ,default:0},
        total_comments: { type: Number,default:0 },
        total_stories: { type: Number,default:0 },
        total_reels: { type: Number,default:0 },
        total_followers: { type: Number,default:0 },
        total_following: { type: Number ,default:0},
        average_time_spent: { type: Number,default:0 }
    },
    setting: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"setting"
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    verify_code: {
        type: String,
        default:""
    },
    verify_code_expiry: {
        type: Date,
        default: Date.now,
    },
    refresh_token: {
        type: String,
        default:""
    },
    access_token: {
        type: String,
        default:""
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