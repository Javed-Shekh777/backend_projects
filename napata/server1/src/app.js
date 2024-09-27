const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");

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



module.exports = app;

