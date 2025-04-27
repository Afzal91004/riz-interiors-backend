const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    service: {
      type: String,
      required: true,
      enum: ["residential", "commercial", "virtual"],
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "in-progress", "completed"],
      default: "new",
    },
  },
  { timestamps: true }
);

const Consultation = mongoose.model("Consultation", consultationSchema);
module.exports = Consultation;
