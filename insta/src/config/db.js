const mongoose = require("mongoose");
const { DB_NAME } = require("../constants.js");

const connectDB = async () => {
    try {
        const connectionVar = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log(`MongoDB connected Successfully !! \n Host name is : ${connectionVar.connection.host}`);

    } catch (error) {
        console.log("MongoDB connection FAILED due to ", error);
        process.exit(1);
    }
}


module.exports = connectDB;