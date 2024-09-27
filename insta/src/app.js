const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoute = require("../src/routes/userRoute.js");
const mediaRoute = require("../src/routes/mediaRoute.js");
const storyRoute = require("../src/routes/storyRoute.js");

const { Server } = require("socket.io");

 

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
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));
app.use(express.static("public"));
app.use(cookieParser());




//  User defined API's 
app.use("/api/v1/user", userRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/story", storyRoute);

 

app.use("", (req, res) => {
    res.send("<h1>Hello , Server is running on port 3000</h1>")
});

// All Api errors middleware handler
// app.use(errorHandler());



module.exports = app;