const router = require("express").Router();
const authentication = require("../middlewares/authMiddleware");
const {
    getDatabases,
    getCollections,
    getAllData,
    monitorChanges,
    createCollection,
    renameCollection,
    deleteCollection
} = require("../controllers/database/database.controller");

router.route("/get-databases").get(authentication,getDatabases);
router.route("/get-collections/:database?").get(authentication,getCollections);
router.route("/create-collection").post(authentication,createCollection);
router.route("/rename-collection").patch(authentication,renameCollection);
router.route("/delete-collection").delete(authentication,deleteCollection);

// router.route("/monitor").get(monitorChanges);




module.exports = router;
