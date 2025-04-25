// routes/collections/routes.js
const Collection = require("../../model/Collection");
const InteriorImage = require("../../model/InteriorImage");

// Create a new collection
const addCollection = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        success: false,
        error: "Name and image are required",
      });
    }

    // Check if collection with same name already exists
    const existingCollection = await Collection.findOne({ name });
    if (existingCollection) {
      return res.status(400).json({
        success: false,
        error: "Collection with this name already exists",
      });
    }

    const collection = await Collection.create({
      name: name.trim(),
      image: image.trim(),
    });

    res.status(201).json({
      success: true,
      collection,
    });
  } catch (error) {
    console.error("Collection creation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error creating collection",
    });
  }
};

// Get all collections
const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      collections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete a collection
const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if any interior images are using this collection
    const imageCount = await InteriorImage.countDocuments({
      collectionRef: id,
    });

    if (imageCount > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete collection with existing interior images",
      });
    }

    const collection = await Collection.findByIdAndDelete(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update a collection
const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    const collection = await Collection.findByIdAndUpdate(
      id,
      { name, image },
      { new: true, runValidators: true }
    );

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  addCollection,
  getAllCollections,
  deleteCollection,
  updateCollection,
};
