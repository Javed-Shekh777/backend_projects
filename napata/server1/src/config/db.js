const mongoose = require("mongoose");

const connection =async ()=>{
    try {

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        if(conn){
            console.log(`Database connected.. Host is ${conn.connection.host}`);
        }
        
    } catch (error) {
        console.log("Database not connected....",error.message);
        throw new Error(error.message);
    }
};


module.exports = connection;