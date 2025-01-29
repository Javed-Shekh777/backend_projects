require("dotenv").config();
const PORT = process.env.PORT || require("./src/constants");
const app = require("./src/app");

const db = require("./src/config/db");

db()
  .then(() => {
    app.listen(PORT, (err) => {
      if (err) {
        console.log("Server not running");
        throw new Error(err.message);
      }
      console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Server not started");
    throw new Error(err.message);
  });
