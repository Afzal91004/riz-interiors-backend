//config/db.js

const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    if (!process.env.MONGO_DB_URI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(process.env.MONGO_DB_URI, options);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error; // Re-throw to handle in the server startup
  }
};

module.exports = connectDb;
