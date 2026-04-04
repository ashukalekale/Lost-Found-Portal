const express = require("express");
const router = express.Router();
const multer = require("multer");
const StoryController = require("../controllers/storyController");

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get("/", StoryController.getAllStories);
router.get("/stats/overview", StoryController.getStats);
router.get("/:id", StoryController.getStoryById);
router.post("/", upload.single("image"), StoryController.createStory);
router.put("/:id", upload.single("image"), StoryController.updateStory);
router.delete("/:id", StoryController.deleteStory);

module.exports = router;
