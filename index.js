// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Parse JSON request body
app.use(express.json());

// Improved CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://riz-interiors.vercel.app",
    "https://riz-interiors-admin-panel.vercel.app", // Add your admin panel URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Handle OPTIONS requests explicitly
app.options("*", cors(corsOptions));

// Database connection
const connectDB = require("./config/db");
connectDB();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Routes
const collectionRoutes = require("./routes/collections/index");
const interiorImageRoutes = require("./routes/interior-images/index");
const blogRoutes = require("./routes/blogs/index");
const consultationRoutes = require("./routes/consultations/index");

// Use these routes
app.use("/api/collections", collectionRoutes);
app.use("/api/interior-images", interiorImageRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/consultations", consultationRoutes);

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});
