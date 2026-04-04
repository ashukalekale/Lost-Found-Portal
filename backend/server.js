require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const commentRoutes = require("./routes/commentRoutes");
const storyRoutes = require("./routes/storyRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/stories", storyRoutes);

app.get("/", (req,res)=>{
  res.send("Lost & Found Portal API Running");
});

app.listen(5000, ()=>console.log("Server running on port 5000"));