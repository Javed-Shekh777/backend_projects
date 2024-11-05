const { createCandidate, getCandidate, getAllCandidates, updateCandidate, deleteCandidate, createElection, getElection, getAllElection, updateElection, deleteElection } = require("../controllers/adminController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

const router = require("express").Router();


// Secure admin routes

// Routes for candidates manipulation
router.route("/add-candidate").post(isAuthenticated,isAdmin,createCandidate);
router.route("/get-candidate").get(isAuthenticated,isAdmin,getCandidate);
router.route("/get-all-candidate").get(isAuthenticated,isAdmin,getAllCandidates);
router.route("/update-candidate").post(isAuthenticated,isAdmin,updateCandidate);
router.route("/delete-candidate").post(isAuthenticated,isAdmin,deleteCandidate);

// Routes for election manipulation
router.route("/add-election").post(isAuthenticated,isAdmin,createElection);
router.route("/get-election").get(isAuthenticated,isAdmin,getElection);
router.route("/get-all-election").get(isAuthenticated,isAdmin,getAllElection);
router.route("/update-election").post(isAuthenticated,isAdmin,updateElection);
router.route("/delete-election").post(isAuthenticated,isAdmin,deleteElection);
router.route("/add-re-candidate").post(isAuthenticated,isAdmin,getAllElection);
router.route("/active-de-election").post(isAuthenticated,isAdmin,deleteElection);


router.route("/get-all-user").post();
router.route("/delete-user").post();


// router.route("/election-result").get();
 




module.exports = router;