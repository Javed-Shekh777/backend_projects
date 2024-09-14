const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const userRoute = require("./routes/userRoute");

// Some middlewares 
app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({extended:true,limit:"5mb"}));
app.use(express.static("public"));
app.use(cookieParser());




// User Route 
app.use("/api/v1/user",userRoute);


module.exports = app;
