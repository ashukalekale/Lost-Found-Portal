require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } 
});

app.use("/api/items", upload.single("image"));

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));


app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/comments", commentRoutes);

app.get("/", (req,res)=>{
  res.send("Lost & Found Portal API Running");
});

app.listen(5000, ()=>console.log("Server running on port 5000"));