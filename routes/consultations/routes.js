// routes/blogs/routes.js
const Consultation = require("../../model/Consultation");

// Submit a new consultation request
const submitConsultation = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address",
      });
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^\+?[0-9\s-()]{8,20}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid phone number",
      });
    }

    // Create consultation request
    const consultation = await Consultation.create({
      name,
      email,
      phone,
      service,
      message,
    });

    res.status(201).json({
      success: true,
      consultation,
    });
  } catch (error) {
    console.error("Consultation submission error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error submitting consultation request",
    });
  }
};

// Get all consultation requests with filtering and pagination (admin only)
const getAllConsultations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
        { phone: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const totalConsultations = await Consultation.countDocuments(query);

    const consultations = await Consultation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalConsultations / limit);

    res.status(200).json({
      success: true,
      consultations,
      totalConsultations,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching consultations:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch consultation requests",
    });
  }
};

// Get a single consultation by ID
const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findById(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: "Consultation request not found",
      });
    }

    res.status(200).json({
      success: true,
      consultation,
    });
  } catch (error) {
    console.error("Error fetching consultation:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch consultation request",
    });
  }
};

// Update consultation status
const updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      !status ||
      !["new", "contacted", "in-progress", "completed"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        error: "Valid status is required",
      });
    }

    const consultation = await Consultation.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: "Consultation request not found",
      });
    }

    res.status(200).json({
      success: true,
      consultation,
    });
  } catch (error) {
    console.error("Error updating consultation status:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update consultation status",
    });
  }
};

// Delete a consultation
const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findByIdAndDelete(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: "Consultation request not found",
      });
    }

    res.status(200).json({
      success: true,
      consultation,
    });
  } catch (error) {
    console.error("Error deleting consultation:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to delete consultation request",
    });
  }
};

module.exports = {
  submitConsultation,
  getAllConsultations,
  getConsultationById,
  updateConsultationStatus,
  deleteConsultation,
};
