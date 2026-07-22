const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");

const asyncHandler = require("../middleware/asyncHandler");
const generateUniqueSlug = require("../utils/slug");

const { successResponse } = require("../utils/apiResponse");
const MESSAGES = require("../constants/messages");

// ==========================================
// Create Product
// ==========================================
const createProduct = asyncHandler(async (req, res) => {

    const data = req.body;

    // Generate unique slug
    data.slug = await generateUniqueSlug(data.title);

    // Validate Category
    const category = await Category.findById(data.category);

    if (!category) {
        res.status(404);
        throw new Error(MESSAGES.CATEGORY.NOT_FOUND);
    }

    // Validate Brand
    const brand = await Brand.findById(data.brand);

    if (!brand) {
        res.status(404);
        throw new Error(MESSAGES.BRAND.NOT_FOUND);
    }

    // Validate SKU uniqueness
    const existingSku = await Product.findOne({
        sku: data.sku,
    });

    if (existingSku) {
        res.status(409);
        throw new Error(MESSAGES.PRODUCT.SKU_ALREADY_EXISTS);
    }

    const product = await Product.create(data);

    await product.populate("category", "name");
    await product.populate("brand", "name");

    return successResponse(
        res,
        product,
        MESSAGES.PRODUCT.CREATED,
        201
    );

});

// ==========================================
// Get Products
// ==========================================
const getProducts = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const skip = (page - 1) * limit;

    const query = {
        isActive: true,
    };

    if (req.query.search) {
        query.title = {
            $regex: req.query.search,
            $options: "i",
        };
    }

    if (req.query.category) {
        query.category = req.query.category;
    }

    if (req.query.brand) {
        query.brand = req.query.brand;
    }

    if (req.query.featured === "true") {
        query.featured = true;
    }

    const totalProducts =
        await Product.countDocuments(query);

    const products =
        await Product.find(query)
            .populate("category", "name")
            .populate("brand", "name")
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(limit);

    return successResponse(
        res,
        products,
        MESSAGES.PRODUCT.LIST_RETRIEVED,
        200,
        {
            page,
            limit,
            total: totalProducts,
            pages: Math.ceil(totalProducts / limit),
        }
    );

});

// ==========================================
// Get Product By Slug
// ==========================================
const getProductBySlug = asyncHandler(async (req, res) => {

    const product = await Product.findOne({
        slug: req.params.slug,
        isActive: true,
    })
        .populate("category")
        .populate("brand");

    if (!product) {
        res.status(404);
        throw new Error(MESSAGES.PRODUCT.NOT_FOUND);
    }

    return successResponse(
        res,
        product,
        MESSAGES.PRODUCT.RETRIEVED
    );

});

// ==========================================
// Update Product
// ==========================================
const updateProduct = asyncHandler(async (req, res) => {

    const product =
        await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error(MESSAGES.PRODUCT.NOT_FOUND);
    }

    const data = req.body;

    // Generate new slug if title changes
    if (data.title) {
        data.slug = await generateUniqueSlug(
            data.title,
            req.params.id
        );
    }

    // Validate Category
    if (data.category) {

        const category =
            await Category.findById(data.category);

        if (!category) {
            res.status(404);
            throw new Error(MESSAGES.CATEGORY.NOT_FOUND);
        }

    }

    // Validate Brand
    if (data.brand) {

        const brand =
            await Brand.findById(data.brand);

        if (!brand) {
            res.status(404);
            throw new Error(MESSAGES.BRAND.NOT_FOUND);
        }

    }

    // Validate SKU
    if (data.sku) {

        const existingSku =
            await Product.findOne({
                sku: data.sku,
                _id: { $ne: req.params.id },
            });

        if (existingSku) {
            res.status(409);
            throw new Error(MESSAGES.PRODUCT.SKU_ALREADY_EXISTS);
        }

    }

    Object.assign(product, data);

    const updatedProduct =
        await product.save();

    await updatedProduct.populate("category", "name");
    await updatedProduct.populate("brand", "name");

    return successResponse(
        res,
        updatedProduct,
        MESSAGES.PRODUCT.UPDATED
    );

});

// ==========================================
// Soft Delete Product
// ==========================================
const deleteProduct = asyncHandler(async (req, res) => {

    const product =
        await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error(MESSAGES.PRODUCT.NOT_FOUND);
    }

    product.isActive = false;

    await product.save();

    return successResponse(
        res,
        null,
        MESSAGES.PRODUCT.DELETED
    );

});

module.exports = {
    createProduct,
    getProducts,
    getProductBySlug,
    updateProduct,
    deleteProduct,
};