const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./src/config/db");
const app = require("./src/app");
const ApiError = require("./src/utils/ApiError");

// Global Error-Handling Middleware
// Global Error-Handling Middleware
app.use((err, req, res, next) => {
  console.log("Errrrr :", err, "Name : ", err.name);
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: Object.values(err.errors).map((error) => error.message), // Sab validation errors ka array bhejenge
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`, // CastError ka path aur value return karein
    });
  }

  if (err instanceof ApiError) {
    // ApiError ke properties ka use karke response bhejna
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors || null,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  // Default Error Handler
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
  });
});

app.get("*", (req, res) => {
  res.send("API is RUNNING \n\n\t\t\t\t HAPPY CODING!!!!!! ❤️❤️❤️");
});

// database and server
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, (err) => {
      if (err) {
        console.log("Server not running ", err);
      } else {
        console.log("Server is running.....");
      }
    });
  })
  .catch(() => {
    console.log("Database not connected.....");
  });
