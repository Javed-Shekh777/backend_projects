const router = require("express").Router();
const {addInventory,getAllInventory,getInventory,updateInventory,deleteInventory,inventoryFilterOptions} = require("../controllers/inventoryController");
const authenticated = require("../middlewares/authMiddleware");


// secure routes 

router.route("/add-inventory").post(authenticated,addInventory);
router.route("/get-inventory").get(authenticated,getInventory);
router.route("/get-all-inventory").get(authenticated,getAllInventory);
router.route("/update-inventory").post(authenticated,updateInventory);
router.route("/notification-inventory").post(authenticated);
router.route("/delete-inventory").delete(authenticated,deleteInventory);
router.route("/inventory-filter").post(authenticated,inventoryFilterOptions);



module.exports = router;