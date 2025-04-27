// routes/blogs/routes.js
const Blog = require("../../model/blog");

// Create a new blog post
const createBlog = async (req, res) => {
  try {
    const { title, coverImage, content, excerpt, author, tags, isPublished } =
      req.body;

    if (!title || !coverImage || !content || !excerpt) {
      return res.status(400).json({
        success: false,
        error: "Title, cover image, content, and excerpt are required",
      });
    }

    const blog = await Blog.create({
      title,
      coverImage,
      content,
      excerpt,
      author: author || "Admin",
      tags: tags || [],
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Blog creation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error creating blog post",
    });
  }
};

// Get all blog posts with filtering and pagination
const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by publication status if provided
    if (req.query.isPublished !== undefined) {
      query.isPublished = req.query.isPublished === "true";
    }

    // Search by title, content, or tags
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { content: { $regex: req.query.search, $options: "i" } },
        { tags: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Filter by tag if provided
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }

    const totalBlogs = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "title slug coverImage excerpt author tags createdAt isPublished"
      );

    const totalPages = Math.ceil(totalBlogs / limit);

    res.status(200).json({
      success: true,
      blogs,
      totalBlogs,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch blog posts",
    });
  }
};

// Get a single blog post by slug (for public viewing)
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug, isPublished: true });

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch blog post",
    });
  }
};

// Get a single blog post by ID (for admin editing)
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch blog post",
    });
  }
};

// Update a blog post
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, coverImage, content, excerpt, author, tags, isPublished } =
      req.body;

    // Check if required fields are present
    if (!title || !coverImage || !content || !excerpt) {
      return res.status(400).json({
        success: false,
        error: "Title, cover image, content, and excerpt are required",
      });
    }

    // Get current blog to handle slug update correctly
    const currentBlog = await Blog.findById(id);
    if (!currentBlog) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
      });
    }

    // Set up update data
    const updateData = {
      title,
      coverImage,
      content,
      excerpt,
      author: author || currentBlog.author,
      tags: tags || currentBlog.tags,
      isPublished:
        isPublished !== undefined ? isPublished : currentBlog.isPublished,
    };

    // If title changed, update slug
    if (title !== currentBlog.title) {
      updateData.slug = title
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Blog update error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error updating blog post",
    });
  }
};

// Delete a blog post
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Blog deletion error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error deleting blog post",
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
};
