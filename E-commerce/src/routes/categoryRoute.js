const { createCategory, getAllCategory, getCategory, deleteCategory ,upateCategory} = require("../controllers/categoryController");
const authenticated = require("../middlewares/authMiddleware");

const router = require("express").Router();

// secure routes
router.route("/add-category").post(authenticated, createCategory);
router.route("/update-category/:id?").patch(authenticated, upateCategory);
router.route("/delete-category/:id?").delete(authenticated, deleteCategory);
router.route("/get-category/:id?").get(authenticated, getCategory);
router.route("/get-all-category").get(authenticated, getAllCategory);

module.exports = router;
