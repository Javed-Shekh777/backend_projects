const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");


const userSchema =new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        required: true
    },
    email:
    {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        min: 6,
        required: true,
    }
},
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (!(this.isModified("password"))) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});



userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  
userSchema.methods.generateToken = function () {
    return JWT.sign({
        _id:this._id,
        username: this.username,
        email: this.email,
    },
        process.env.SECRET_TOKEN,
        {
            expiresIn: process.env.SECRET_EXPIRY
        }
    );
}


const userModel = mongoose.model("user", userSchema);


module.exports = userModel;