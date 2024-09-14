const { allStory, createStory, deleteStory, reactStory, readReactStory, storyView, storyViewed, userAllStory } = require("../controllers/storyController");
const authUser = require("../middlewares/authMiddlware");
const upload = require("../middlewares/multerConfig");

const router = require("express").Router();

// Create a Story
// Delete a Story
// View All Stories of a User
// View All Stories from Users Followed by a User
// React to a Story
// View All Reactions to a Story


// Secure routes 

router.route("/create-story").post(authUser,upload.single("story"),createStory);
router.route("/delete-story").post(authUser,deleteStory);
router.route("/user-all-story").get(authUser,userAllStory);
router.route("/all-story").get(authUser,allStory);
router.route("/react-story").post(authUser,reactStory);
router.route("/read-react").get(authUser,readReactStory);
router.route("/story-view").post(authUser,storyView);
router.route("/story-views").get(authUser,storyViewed);







module.exports = router;