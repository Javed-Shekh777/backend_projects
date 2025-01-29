const Joi = require("joi");
const ApiError = require("../../utils/ApiError");

// User registration validation schema
const registerUserSchema = Joi.object({
  username: Joi.string().min(3).max(40).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must be less than 40 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(6).max(16).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must be less than 16 characters",
  }),
});

// User login validation schema
const loginUserSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username or Email is required",
    "string.username": "Invalid Username or Email",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

// Forget Password validation schema
const forgetPasswordSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username or Email is required",
  }),
});

// Password update validation schema
const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "string.empty": "Old password is required",
  }),
  newPassword: Joi.string().min(6).max(128).required().messages({
    "string.empty": "New password is required",
    "string.min": "New password must be at least 6 characters",
    "string.max": "New password must be less than 128 characters",
  }),
});

// Password update validation schema
const checkUsername = Joi.object({
  username: Joi.string().min(3).max(40).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must be less than 40 characters",
  }),
});

// Generic validation function
const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const formattedErrors = error.details.map((detail) => ({
      field: detail.context.key,
      message: detail.message.replace(/"/g, ""),
    }));
    throw new ApiError(400, formattedErrors); // Send structured Joi errors
  }
  return value;
};

module.exports = {
  registerUserSchema,
  loginUserSchema,
  updatePasswordSchema,
  forgetPasswordSchema,
  checkUsername,
  validate,
};
