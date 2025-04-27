// routes/consultations/index.js
const express = require("express");
const {
  submitConsultation,
  getAllConsultations,
  getConsultationById,
  updateConsultationStatus,
  deleteConsultation,
} = require("./routes");
const router = express.Router();

router.post("/", submitConsultation);
router.get("/", getAllConsultations);
router.get("/:id", getConsultationById);
router.put("/:id", updateConsultationStatus);
router.delete("/:id", deleteConsultation);

module.exports = router;
