const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        minlength: [3,"Username must be greater than 3 characters"],
        required: [true, "Username is required."]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required."],
        unique: [true, "Email already exist."],
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address.']
    },
    password: {
        type: String,
        trim:true,
        minlength: [6,"Password must be  6 or 16 characters"],
        maxlength: [16,"Password must be 6 or 16 characters"],
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
        minlength: [10,"Phone number must be 10 or 12 characters"],
        maxlength: [13,"Phone number must be 10 or 12 characters"]
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
        type: Date,
        default : Date.now()
    }
},
    { timestamps: true }
);


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
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;