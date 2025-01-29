const ApiError = require("./ApiError");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = null; // To store field-specific errors

  if (err.name === "ValidationError" || err instanceof ApiError) {
    statusCode = 400;
    message = "Validation error"; // Aapka simple message

    // If the error is an instance of ApiError and it contains validation errors
    if (err instanceof ApiError && Array.isArray(err.message)) {
      errors = err.message; // Structured Joi-like errors
    } else if (err.errors) {
      // If it's Joi validation error, extract fields and messages
      errors = Object.values(err.errors).map((error) => ({
        field: error.path,
        message: error.message,
      }));
    }
  }

  // Check for custom ApiError
  if (err instanceof ApiError && !Array.isArray(err.message)) {
    statusCode = err.statusCode;
    message = err.message;
    errors = Array.isArray(err.message) ? err.message : null; // Joi or custom errors
  }

  // MongoDB Duplicate Field Errors
  if (err.code && err.code === 11000) {
    statusCode = 400;
    errors = Object.keys(err.keyValue).map((field) => ({
      field,
      message: `${field} already exists`,
    }));
    message = "Duplicate field value";
  }

  // Invalid ObjectId Errors
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = `Invalid ID format: ${err.value}`;
  }

  // Fallback for unknown errors
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors, // Includes Joi/MongoDB errors or null for generic errors
  });
};

module.exports = errorHandler;
