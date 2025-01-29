const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./utils/errorHandler");
const userRoute = require("./routes/user.route");
const databaseRoute = require("./routes/database.route");
const chatRoute = require("./routes/chat.route");
 
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Global Error Hanlder
app.use(
  cors({
    methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
    origin: process.env.CROSS_ORIGIN,
    credentials: true,
  })
);


// Some basic middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("common"));

//  User Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/database", databaseRoute);
app.use("/api/v1/chat", chatRoute);

 

app.use(errorHandler);

module.exports = server;
