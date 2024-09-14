const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./src/config/db");
const app = require("./src/app");




// database and server 
connectDB().then(() => {
    app.listen(process.env.PORT || 3000, (err) => {
        if (err) {
            console.log("Server not running ", err);
        } else {
            console.log("Server is running.....");
        }
    });

}).catch(() => {
    console.log("Database not connected.....");
})