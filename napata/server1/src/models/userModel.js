const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
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
        required: [true, "VoterID is required."],
        unique: [true, "VoterId should be unique."]
    },
    hasVoted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

 



userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken =  function () {

    return JWT.sign({
        _id: this._id,
        username: this.username,
        email: this.email
    },
        process.env.SECRET_TOKEN,
        {
            expiresIn: process.env.SECRET_TOKEN_EXPIRY
        }
    );

}


module.exports = mongoose.model("User", userSchema);