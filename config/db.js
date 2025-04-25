//config/db.js

const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_DB_URI;

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(mongoURI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database error", error);
  }
};

module.exports = connectDb;
