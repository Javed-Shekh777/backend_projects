const multer = require("multer");
const path = require("path");

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (_, file, cb) {
    cb(null, path.join(__dirname, "../../public"));
  },
  filename: function (_, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Initialize multer
const upload = multer({ storage: storage });

module.exports = upload;
