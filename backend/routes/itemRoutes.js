const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

router.post("/", async (req, res) => {
  try {
    console.log("Received req.body:", req.body);
    console.log("Received req.file:", req.file);
    
    const { title, type, category, brand, primaryColor, lostDate, lostTime, ownerName, description, location, postedBy, contact } = req.body || {};

    if (!title) return res.status(400).json({ message: "Item name is required" });
    if (!type) return res.status(400).json({ message: "Item type (Lost/Found) is required" });
    if (!category) return res.status(400).json({ message: "Category is required" });
    if (!description) return res.status(400).json({ message: "Description is required" });
    if (!location) return res.status(400).json({ message: "Location is required" });
    if (!postedBy) return res.status(400).json({ message: "User ID is required" });
    if (!contact) return res.status(400).json({ message: "Contact information is required" });
    if (type === "lost" && !ownerName) return res.status(400).json({ message: "Owner name is required for lost items" });

    let imageData = null;
    if (req.file) {
      imageData = "data:" + req.file.mimetype + ";base64," + req.file.buffer.toString("base64");
    }

    const item = new Item({
      title,
      type,
      category,
      brand,
      primaryColor,
      lostDate,
      lostTime,
      ownerName,
      description,
      location,
      postedBy,
      contact,
      image: imageData,
    });

    await item.save();
    await item.populate("postedBy", "_id name email phone");

    res.status(201).json({ message: "Item posted successfully", item });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: error.message });
  }
});

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
      .populate("postedBy", "_id name email phone")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("postedBy", "_id name email phone");
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
    const { title, description, location, status, contact, brand, primaryColor, lostDate, lostTime, ownerName } = req.body;
    
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { title, description, location, status, contact, brand, primaryColor, lostDate, lostTime, ownerName, updatedAt: Date.now() },
      { new: true }
    ).populate("postedBy", "_id name email phone");

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
    const { userId } = req.body;

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Allow deletion if user is owner or admin
    if (userId !== "admin" && item.postedBy.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own items" });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Delete items by user ID (for bulk cleanup)
router.delete("/admin/deleteByUser/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const result = await Item.deleteMany({ postedBy: userId });
    res.json({ 
      message: `Deleted ${result.deletedCount} items by user ${userId}`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
