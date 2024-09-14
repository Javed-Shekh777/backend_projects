const mongoose = require("mongoose");

const connectionDB = async ()=>{
    try {
       const connectedDB =  await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected ",connectedDB.connection.host);
    } catch (error) {
        console.log("Database not connected...",error);
        throw error;
        
    }
}

module.exports = connectionDB;