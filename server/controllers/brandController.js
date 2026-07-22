const Brand = require("../models/Brand");

const asyncHandler = require("../middleware/asyncHandler");

const {
  successResponse,
} = require("../utils/apiResponse");

const MESSAGES = require("../constants/messages");

// Create Brand
const createBrand = asyncHandler(async (req, res) => {

  const existingBrand = await Brand.findOne({
    name: req.body.name,
  });

  if (existingBrand) {
    res.status(409);
    throw new Error(MESSAGES.BRAND.ALREADY_EXISTS);
  }

  const brand = await Brand.create(req.body);

  return successResponse(
    res,
    brand,
    MESSAGES.BRAND.CREATED,
    201
  );
});

// Get All Brands
const getBrands = asyncHandler(async (req, res) => {

  const brands = await Brand.find({
    isActive: true,
  }).sort({
    createdAt: -1,
  });

  return successResponse(
    res,
    brands,
    MESSAGES.BRAND.LIST_RETRIEVED
  );
});

// Get Brand By Slug
const getBrandBySlug = asyncHandler(async (req, res) => {

  const brand = await Brand.findOne({
    slug: req.params.slug,
    isActive: true,
  });

  if (!brand) {
    res.status(404);
    throw new Error(MESSAGES.BRAND.NOT_FOUND);
  }

  return successResponse(
    res,
    brand,
    MESSAGES.BRAND.RETRIEVED
  );
});

// Update Brand
const updateBrand = asyncHandler(async (req, res) => {

  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!brand) {
    res.status(404);
    throw new Error(MESSAGES.BRAND.NOT_FOUND);
  }

  return successResponse(
    res,
    brand,
    MESSAGES.BRAND.UPDATED
  );
});

// Soft Delete Brand
const deleteBrand = asyncHandler(async (req, res) => {

  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    res.status(404);
    throw new Error(MESSAGES.BRAND.NOT_FOUND);
  }

  brand.isActive = false;

  await brand.save();

  return successResponse(
    res,
    null,
    MESSAGES.BRAND.DELETED
  );
});

module.exports = {
  createBrand,
  getBrands,
  getBrandBySlug,
  updateBrand,
  deleteBrand,
};