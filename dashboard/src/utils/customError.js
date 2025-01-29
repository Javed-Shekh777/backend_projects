class ValidationError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.errors = message;
    // this.errors = [];
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.errors, this.message, this.name);
    }
    console.log("VVV : ", this, "\n\n");
  }
}
module.exports = ValidationError;
