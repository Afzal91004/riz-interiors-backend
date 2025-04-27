// config/db.js
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    if (!process.env.MONGO_DB_URI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Add timeout
      socketTimeoutMS: 45000, // Add socket timeout
    };

    await mongoose.connect(process.env.MONGO_DB_URI, options);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDb;
