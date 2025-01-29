const ApiError = require("./ApiError");

const handleMongooseErrors = (error) => {
  console.log("EEEEEEEEE : ", error);
  if (error.name === "ValidationError") {
    return new ApiError(
      400,
      "Schema validation failed",
      Object.values(error.errors).map((e) => e.message)
    );
  }
  if (error.name === "CastError") {
    return new ApiError(
      400,
      `Invalid ${error.path}: ${JSON.stringify(error.value, null, 2)}`
    );
  }
  return null; // Agar Mongoose error nahi hai toh `null` return karega
};

module.exports = handleMongooseErrors;
