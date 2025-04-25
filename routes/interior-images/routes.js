// routes/collections/routes.js

const InteriorImage = require("../../model/InteriorImage");
const Collection = require("../../model/Collection");

// Add new interior image
const addInteriorImage = async (req, res) => {
  try {
    const { name, image, collection } = req.body;

    if (!name || !image || !collection) {
      return res.status(400).json({
        success: false,
        error: "Name, image and collection are required",
      });
    }

    // Verify collection exists
    const collectionExists = await Collection.findById(collection.trim());
    if (!collectionExists) {
      return res.status(400).json({
        success: false,
        error: "Collection not found",
      });
    }

    const interiorImage = await InteriorImage.create({
      name,
      image,
      collection,
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
    if (req.query.collection) {
      query.collection = req.query.collection;
    }

    // Search by name if provided
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }

    const totalImages = await InteriorImage.countDocuments(query);

    const interiorImages = await InteriorImage.find(query)
      .populate("collection", "name image")
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
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single interior image by ID
const getInteriorImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const interiorImage = await InteriorImage.findById(id).populate(
      "collection",
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
    const { name, image, collection } = req.body;

    // Verify collection exists if provided
    if (collection) {
      const collectionExists = await Collection.findById(collection);
      if (!collectionExists) {
        return res.status(400).json({
          success: false,
          error: "Collection not found",
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (image) updateData.image = image;
    if (collection) updateData.collection = collection;

    const interiorImage = await InteriorImage.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("collection", "name image");

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

module.exports = {
  addInteriorImage,
  getAllInteriorImages,
  deleteInteriorImage,
  updateInteriorImage,
  getInteriorImageById,
};
