const register = require("../controllers/user/register.controller");
const login = require("../controllers/user/login.controller");
const logout = require("../controllers/user/logout.controller");
const loggedUser = require("../middleware/auth.middleware");
const update = require("../controllers/user/update.controller");
const deleteUser = require("../controllers/user/delete.controller");
const readUser = require("../controllers/user/read.conroller");
const readAllUser = require("../controllers/user/readall.controller");


const router = require("express").Router();


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(loggedUser,logout);
router.route("/update").post(loggedUser,update);
router.route("/delete").post(loggedUser,deleteUser);
router.route("/read").post(loggedUser,readUser);
router.route("/readall").post(readAllUser);


 

module.exports = router;
