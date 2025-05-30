// routes/collections/routes.js

const InteriorImage = require("../../model/InteriorImage");
const Collection = require("../../model/Collection");

// Add new interior image
const addInteriorImage = async (req, res) => {
  try {
    const { name, image, collectionRef } = req.body;

    if (!name || !image || !collectionRef) {
      return res.status(400).json({
        success: false,
        error: "Name, image and collection are required",
      });
    }

    // Verify collection exists
    const collectionExists = await Collection.findById(collectionRef.trim());
    if (!collectionExists) {
      return res.status(400).json({
        success: false,
        error: "Collection not found",
      });
    }

    const interiorImage = await InteriorImage.create({
      name,
      image,
      collectionRef,
    });

    res.status(201).json({
      success: true,
      interiorImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all interior images with pagination and filtering
const getAllInteriorImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by collection if provided
    if (req.query.collectionRef) {
      query.collectionRef = req.query.collectionRef;
    }

    // Search by name if provided
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }

    const totalImages = await InteriorImage.countDocuments(query);

    const interiorImages = await InteriorImage.find(query)
      .populate("collectionRef", "name image") // Changed from "collection" to "collectionRef"
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalImages / limit);

    res.status(200).json({
      success: true,
      interiorImages,
      totalImages,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching interior images:", error); // Added better error logging
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single interior image by ID
// In the same file, update getInteriorImageById
const getInteriorImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const interiorImage = await InteriorImage.findById(id).populate(
      "collectionRef", // Changed from "collection" to "collectionRef"
      "name image"
    );

    if (!interiorImage) {
      return res.status(404).json({
        success: false,
        error: "Interior image not found",
      });
    }

    res.status(200).json({
      success: true,
      interiorImage,
    });
  } catch (error) {
    console.error("Error fetching interior image:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete interior image
const deleteInteriorImage = async (req, res) => {
  try {
    const { id } = req.params;

    const interiorImage = await InteriorImage.findByIdAndDelete(id);

    if (!interiorImage) {
      return res.status(404).json({
        success: false,
        error: "Interior image not found",
      });
    }

    res.status(200).json({
      success: true,
      interiorImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update interior image
const updateInteriorImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, collectionRef } = req.body;

    // Basic validation
    if (!name || !image || !collectionRef) {
      return res.status(400).json({
        success: false,
        error: "Name, image and collectionRef are required",
      });
    }

    // Verify collection exists
    const collectionExists = await Collection.findById(collectionRef);
    if (!collectionExists) {
      return res.status(400).json({
        success: false,
        error: "Collection not found",
      });
    }

    const updatedImage = await InteriorImage.findByIdAndUpdate(
      id,
      { name, image, collectionRef },
      { new: true, runValidators: true }
    ).populate("collectionRef", "name image");

    if (!updatedImage) {
      return res.status(404).json({
        success: false,
        error: "Interior image not found",
      });
    }

    res.status(200).json({
      success: true,
      interiorImage: updatedImage,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

module.exports = {
  addInteriorImage,
  getAllInteriorImages,
  deleteInteriorImage,
  updateInteriorImage,
  getInteriorImageById,
};
