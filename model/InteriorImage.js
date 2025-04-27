// model/InteriorImage.js
const mongoose = require("mongoose");

const interiorImageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    collectionRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
  },
  { timestamps: true }
);

const InteriorImage = mongoose.model("InteriorImage", interiorImageSchema);
module.exports = InteriorImage;
