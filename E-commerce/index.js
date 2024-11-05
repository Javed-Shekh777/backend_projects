const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./src/config/db");
const app = require("./src/app");
app.set('view engine', 'ejs');

console.log(__dirname)

 
app.get("/forget", (req, res) => {
    res.sendFile(__dirname+'/index.html');
  });

app.get("*",(req,res)=>{
    res.send("API is RUNNING \n\n\t\t\t\t HAPPY CODING!!!!!! ❤️❤️❤️");
});

// database and server 
connectDB().then(() => {
    app.listen(process.env.PORT || 8080, (err) => {
        if (err) {
            console.log("Server not running ", err);
        } else {
            console.log("Server is running.....");
        }
    });

}).catch(() => {
    console.log("Database not connected.....");
})