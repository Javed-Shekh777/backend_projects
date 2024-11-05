const http = require("http");
const express = require('express');
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoute = require("../src/routes/userRoute.js");
const mediaRoute = require("../src/routes/mediaRoute.js");
const storyRoute = require("../src/routes/storyRoute.js");
const settingRoute = require("../src/routes/settingRoute.js");
const chatRoute = require("../src/routes/chatRoute.js");


const {handleSocketChatEvents } = require("../src/controllers/chatController.js");


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        methods: ["POST", "GET"],
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
});
 


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
app.use("/api/v1/setting", settingRoute);
app.use("/api/v1/chat",chatRoute);



io.on("connection",(socket)=>{
    console.log("New User connected with socket id : ",socket.id);

    handleSocketChatEvents(socket,io);

    socket.on("disconnect",()=>{
        console.log("User disconnected ");
    });
});




app.use("", (req, res) => {
    res.send("<h1>Hello , Server is running on port 3000</h1>")
});

// All Api errors middleware handler
// app.use(errorHandler());



module.exports = server;