const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// Add comment to item
router.post("/", async (req, res) => {
  try {
    const { text, postedBy, itemId } = req.body;

    if (!text || !postedBy || !itemId) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const comment = new Comment({ text, postedBy, itemId });
    await comment.save();
    await comment.populate("postedBy", "name email");

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get comments for an item
router.get("/:itemId", async (req, res) => {
  try {
    const comments = await Comment.find({ itemId: req.params.itemId })
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete comment
router.delete("/:id", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
