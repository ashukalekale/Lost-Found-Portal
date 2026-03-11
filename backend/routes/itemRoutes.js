const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// Create a new item
router.post("/", async (req, res) => {
  try {
    const { title, type, category, description, location, postedBy, contact, image } = req.body;

    if (!title || !type || !category || !description || !location || !postedBy || !contact) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const item = new Item({
      title,
      type,
      category,
      description,
      location,
      postedBy,
      contact,
      image,
    });

    await item.save();
    await item.populate("postedBy", "name email phone");

    res.status(201).json({ message: "Item posted successfully", item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all items with optional filters
router.get("/", async (req, res) => {
  try {
    const { search, location, type, category, status } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    const items = await Item.find(filter)
      .populate("postedBy", "name email phone")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("postedBy", "name email phone");
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update item
router.put("/:id", async (req, res) => {
  try {
    const { title, description, location, status, contact } = req.body;
    
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { title, description, location, status, contact, updatedAt: Date.now() },
      { new: true }
    ).populate("postedBy", "name email phone");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item updated successfully", item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete item
router.delete("/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
