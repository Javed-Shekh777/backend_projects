const multer = require("multer");
const ApiError = require("../utils/ApiError");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../public/temp"));
    },
    filename: function (req, file, cb) {
        cb(null, + Date.now() + file.originalname);
    }
});


const filter = function (req, file, cb) {
    if (
        file.mimetype == "images/jpeg" ||
        file.mimetype == "images/jpg" ||
        file.mimetype == "images/png"
    ) {
        return cb(null, true);
    } else {
        cb(null, false);
        throw new ApiError(402, "Only jpeg,jpg,png images are allowed.");
    }
};


const upload = multer({
    storage: storage,
    fileFilter: filter
});

module.exports = upload;