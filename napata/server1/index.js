const dotenv = require("dotenv")
dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const port = process.env.PORT || 8080;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is Running on PORT : http://localhost:${port}`);
        });
    }).catch((error) => console.log("MongoDB connection failed ", error));
 

