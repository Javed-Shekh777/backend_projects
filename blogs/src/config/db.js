const mongoose = require("mongoose");

const connectDB = async ()=>{
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/blog`);
        console.log(`Database connected... ${db.connection.host}`);
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connectDB;