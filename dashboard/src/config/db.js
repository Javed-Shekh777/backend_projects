const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    console.log(`Database connected to Host ${conn.connection.host}`);
  } catch (error) {
    console.log(error, message);
    throw new Error(error.message);
  }
};

module.exports = dbConnection;
