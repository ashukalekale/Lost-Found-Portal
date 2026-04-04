const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

router.post("/", async (req, res) => {
  try {
    const { text, postedBy, itemId, parentId } = req.body;

    if (!text || !postedBy || !itemId) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const comment = new Comment({ text, postedBy, itemId, parentId: parentId || null });
    await comment.save();
    await comment.populate("postedBy", "name email");

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:itemId", async (req, res) => {
  try {
    const comments = await Comment.find({ itemId: req.params.itemId })
      .populate("postedBy", "name email")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: "Comment text cannot be empty" });

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.text = text;
    await comment.save();
    await comment.populate("postedBy", "name email");

    res.json({ message: "Comment updated successfully", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
