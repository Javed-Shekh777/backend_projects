const register = require("../controllers/user/register.controller");
const login = require("../controllers/user/login.controller");
const logout = require("../controllers/user/logout.controller");
const loggedUser = require("../middleware/auth.middleware");
const update = require("../controllers/user/update.controller");
const deleteUser = require("../controllers/user/delete.controller");
const readAllUser = require("../controllers/user/readall.controller");
const currentUser = require("../controllers/user/read.conroller");


const router = require("express").Router();


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(loggedUser,logout);
router.route("/update").post(loggedUser,update);
router.route("/delete").post(loggedUser,deleteUser);
router.route("/current-user").get(loggedUser,currentUser);
router.route("/read-all").get(readAllUser);


 

module.exports = router;
