const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoute = require("../src/routes/userRoute.js");
const mediaRoute = require("../src/routes/mediaRoute.js");
const storyRoute = require("../src/routes/storyRoute.js");

const mongoose = require("mongoose");
const { Server } = require("socket.io");


const admin = require('firebase-admin');
const serviceAccount = require("../src/helper/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://instagram-cadee.firebaseio.com"
});

// import { errorHandler } from "./middlewares/errorHanlder.js";


// creating a server using express
const app = express();

// creating a server for socket.io
const server = http.createServer(app);

// socket.io is starting
const io = new Server(server);



// cross origin setting 
app.use(cors({
    methods: ["POST", "GET"],
    origin: process.env.CROSS_ORIGIN,
    credentials: true
}));



// Other middlewares for safety and other purpose
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(express.static("public"));
app.use(cookieParser());




//  User defined API's 
app.use("/api/v1/user", userRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/story", storyRoute);



// OTP Schema
const otpSchema = new mongoose.Schema({
    phoneNumber: String,
    otp: String,
    createdAt: { type: Date, expires: 300, default: Date.now }  // OTP expires in 5 minutes
});

const OTP = mongoose.model('OTP', otpSchema);

// API to send OTP
app.post('/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;
    console.log("Body : ", req.body);

    try {
        // Verify phone number format
        if (!/^\+91\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({ error: 'Invalid phone number format. Must be in +91XXXXXXXXXX format.' });
        }

        // Send OTP via Firebase Admin SDK
        // const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);
        // if (!userRecord) {
            await admin.auth().createUser({ phoneNumber });
        // }

        // Send OTP using Firebase Authentication (phone sign-in)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        res.status(200).json({
            message: 'OTP sent successfully!',
            verificationCode: verificationCode // Just for demo; do not expose this in production
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});




app.use("", (req, res) => {
    res.send("<h1>Hello , Server is running on port 3000</h1>")
});

// All Api errors middleware handler
// app.use(errorHandler());



module.exports = app;