const multer = require('multer');
const path = require("path");

 console.log(path.join(__dirname));
// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(dirName, '../../public/temp'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize multer
const upload = multer({ storage: storage });

module.exports =  upload;
