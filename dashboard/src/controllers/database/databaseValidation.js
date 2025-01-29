const Joi = require("joi");
const ApiError = require("../../utils/ApiError");

// Collection Delete  validation schema
const collectionDeleteSchema = Joi.object({
  database: Joi.string().required().messages({
    "string.empty": "Database Name is required",
  }),
  collection: Joi.string().required().messages({
    "string.empty": "Collection Name is required",
  }),
});

 
 // Collection Rename  validation schema
const collectionRenameSchema = Joi.object({
  database: Joi.string().required().messages({
    "string.empty": "Database Name is required",
  }),
  oldCollection: Joi.string().required().messages({
    "string.empty": "Old Collection Name is required",
  }),
  newCollection: Joi.string().required().messages({
    "string.empty": "New Collection Name is required",
  }),
});
 
// Generic validation function
const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const formattedErrors = error.details.map((detail) => ({
      field: detail.context.key,
      message: detail.message,
    }));
    throw new ApiError(400, formattedErrors); // Send structured Joi errors
  }
  return value;
};

module.exports = {
  collectionDeleteSchema,
  collectionRenameSchema,
  validate,
};
