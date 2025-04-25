// routes/collections/index.js
const express = require("express");
const {
  addInteriorImage,
  getAllInteriorImages,
  deleteInteriorImage,
  updateInteriorImage,
  getInteriorImageById,
} = require("./routes");
const router = express.Router();

router.post("/", addInteriorImage);
router.get("/", getAllInteriorImages);
router.get("/:id", getInteriorImageById);
router.delete("/:id", deleteInteriorImage);
router.put("/:id", updateInteriorImage);

module.exports = router;
