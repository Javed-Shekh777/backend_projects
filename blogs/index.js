const express = require("express");
const dotenv = require("dotenv");
const DB = require("./src/config/db");
const userRouter = require("./src/routes/user.route");
const postRouter = require("./src/routes/post.route");
const cookieParser = require("cookie-parser");
 

// Dotenv configuration 
dotenv.config();


//  Database calling
DB();

// router creating 
const app = express();

// some default middlewares 
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true,limit:'10mb'}));
app.use(express.static("public/images"));
app.use(cookieParser());


// routes
app.get("/",(req,res)=>{
    res.send("Blog server is running.....");
});


// user defined routes 
app.use("/api/user",userRouter);
app.use("/api/post",postRouter);


app.listen(process.env.PORT || 8080,(error)=>{
    if(error){
        console.log(`Server not running`);
    }
    console.log(`Server is running : http://localhost:${process.env.PORT}`);
});

