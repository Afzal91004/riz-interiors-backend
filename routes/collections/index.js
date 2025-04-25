// routes/collections/index.js
const express = require("express");
const {
  addCollection,
  getAllCollections,
  deleteCollection,
  updateCollection,
} = require("./routes");
const router = express.Router();

router.post("/", addCollection);
router.get("/", getAllCollections);
router.delete("/:id", deleteCollection);
router.put("/:id", updateCollection);

module.exports = router;
