const Category = require("../models/Category");

const asyncHandler = require("../middleware/asyncHandler");

const {
  successResponse,
} = require("../utils/apiResponse");

const MESSAGES = require("../constants/messages");

// Create Category
const createCategory = asyncHandler(async (req, res) => {

  const existingCategory = await Category.findOne({
    name: req.body.name,
  });

  if (existingCategory) {
    res.status(409);
    throw new Error(MESSAGES.CATEGORY.ALREADY_EXISTS);
  }

  const category = await Category.create(req.body);

  return successResponse(
    res,
    category,
    MESSAGES.CATEGORY.CREATED,
    201
  );

});

// Get All Categories
const getCategories = asyncHandler(async (req, res) => {

  const categories = await Category.find({
    isActive: true,
  }).sort({
    createdAt: -1,
  });

  return successResponse(
    res,
    categories,
    MESSAGES.CATEGORY.LIST_RETRIEVED
  );

});

// Get Category By Slug
const getCategoryBySlug = asyncHandler(async (req, res) => {

  const category = await Category.findOne({
    slug: req.params.slug,
    isActive: true,
  });

  if (!category) {
    res.status(404);
    throw new Error(MESSAGES.CATEGORY.NOT_FOUND);
  }

  return successResponse(
    res,
    category,
    MESSAGES.CATEGORY.RETRIEVED
  );

});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    res.status(404);
    throw new Error(MESSAGES.CATEGORY.NOT_FOUND);
  }

  return successResponse(
    res,
    category,
    MESSAGES.CATEGORY.UPDATED
  );

});

// Soft Delete Category
const deleteCategory = asyncHandler(async (req, res) => {

  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error(MESSAGES.CATEGORY.NOT_FOUND);
  }

  category.isActive = false;

  await category.save();

  return successResponse(
    res,
    null,
    MESSAGES.CATEGORY.DELETED
  );

});

module.exports = {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
};