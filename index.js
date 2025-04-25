// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(express.json());
app.use(cors());

// Database connection
const connectDB = require("./config/db");
connectDB();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Routes
const collectionRoutes = require("./routes/collections/index");
const interiorImageRoutes = require("./routes/interior-images/index");

// Use these routes
app.use("/api/collections", collectionRoutes);
app.use("/api/interior-images", interiorImageRoutes);

// Serve the privacy policy HTML file
app.get("/privacypolicy", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "privacypolicy.html"));
});

app.get("/app-ads.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "app-ads.txt"));
});

app.get("/", (req, res) => {
  res.send("Welcome to the Riz Interiors backend server");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});
