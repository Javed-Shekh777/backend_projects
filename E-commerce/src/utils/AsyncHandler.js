const handleMongooseErrors = require("./MongooseError");
const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      // Pehle mongoose error ko check karein
      const mongooseError = handleMongooseErrors(error);
      if (mongooseError) {
        return next(mongooseError); // Agar mongoose error hai toh global handler tak bhejein
      }
      return next(error); // Baaki errors global handler handle karega
    }
  };
};

module.exports = asyncHandler;

// const asyncHandler = (fn) => {
//     return (req, res, next) => {
//         Promise.resolve(fn(req, res, next))
//             .catch((error) => next(error));
//     }
// }

// module.exports  =  asyncHandler;
