const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["lost", "found"],
    required: true,
  },
  category: {
    type: String,
    enum: ["Electronics", "Clothing", "Documents", "Jewelry", "Keys", "Books", "Bags", "Other"],
    required: true,
  },
  brand: {
    type: String,
  },
  primaryColor: {
    type: String,
  },
  lostDate: {
    type: Date,
  },
  lostTime: {
    type: String,
  },
  ownerName: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "claimed", "resolved"],
    default: "open",
  },
  contact: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
