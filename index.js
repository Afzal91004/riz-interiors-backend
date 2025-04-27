// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
const corsOptions = {
  origin: [
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3000",
    "https://your-frontend-domain.com",
    "https://riz-interiors.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Add OPTIONS method handling for preflight requests
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

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});
// In your index.js (backend entry point)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
