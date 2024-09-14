const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwbtoken");


const userSchema = new mongoose.Schema({
    username: {
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
        required: [true, "Password is required."],
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zip: { type: String, trim: true },
        country: { type: String, trim: true }
    },
    phone: {
        type: String,
    },
    order_history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }],
    is_admin:{
        type:Boolean,
        default:false
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart"
    }],
    verify_code: {
        type: String,
    },
    verify_code_expiry: {
        type: Date
    }
},
    { timestamps: true }
);


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
        email: this.email,
        phone: this.phone,
        is_admin:this.is_admin
    },
        process.env.SECRET_TOKEN,
        {
            expiresIn: process.env.SECRET_TOKEN_EXPIRY
        }
    );

}
module.exports = mongoose.model("user", userSchema);