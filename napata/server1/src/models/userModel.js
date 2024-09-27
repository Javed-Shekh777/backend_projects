const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        trim: true,
        min: 3,
        required: [true, "Username is required."]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required."],
        unique: [true, "Email should be unique."]
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required."]
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    voterId: {
        type: String,
        unique: [true, "VoterId should be unique."]
    },
    hasVoted: {
        type: Boolean,
        default: false
    },
    verifyCode: { type: String },
    expiryCode: { type: Date },
    createdAt: {
        type: Date,
        default: Date.now
    },
});


userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const encryptedPsw = await bcrypt.hash(this.password, process.env.SALT);
        this.password = encryptedPsw;
        next();
    }
    return next();
});


userSchema.methods.isCorrectPassword = async function (passord) {
    const correct = await bcrypt.compare(passord, this.passord);
    return correct;
}

userSchema.methods.generateToken = function () {
    const token = {
        _id: this._id,
        user: this.user,
        email: this.email,
        role: this.role
    }

    return  JWT.sign(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        });
}


module.exports = mongoose.model("User", userSchema);