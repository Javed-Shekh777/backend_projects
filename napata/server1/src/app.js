const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/userRoute");
const voterRoute = require("./routes/voterRoute");





app.use(cors({
    credentials:true,
    methods:["POST","GET"],
    origin:process.env.CORS_ORIGIN
}));


app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({extended:true,limit:'10mb'}));
app.use(cookieParser());
app.use(express.static("public"));



app.use("/api/v1/user",userRoute);
app.use("/api/v1/admin",adminRoute);
app.use("/api/v1/voter",voterRoute);



module.exports = app;

