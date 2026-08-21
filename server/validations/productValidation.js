const {
    body,
} = require("express-validator");


const createProductValidation = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage(
            "Product title is required"
        ),

    body("sku")
        .trim()
        .notEmpty()
        .withMessage(
            "Product SKU is required"
        ),

    body("category")
        .notEmpty()
        .withMessage(
            "Category is required"
        )
        .isMongoId()
        .withMessage(
            "Invalid category ID"
        ),

    body("brand")
        .notEmpty()
        .withMessage(
            "Brand is required"
        )
        .isMongoId()
        .withMessage(
            "Invalid brand ID"
        ),

    body("regularPrice")
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Regular price must be zero or greater"
        ),

    body("salePrice")
        .optional()
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Sale price must be zero or greater"
        ),

    body("weight")
        .optional()
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Weight must be zero or greater"
        ),

    body("lowStockThreshold")
        .optional()
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Low stock threshold must be zero or greater"
        ),

];


const updateProductValidation = [

    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
            "Product title cannot be empty"
        ),

    body("sku")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
            "Product SKU cannot be empty"
        ),

    body("category")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid category ID"
        ),

    body("brand")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid brand ID"
        ),

    body("regularPrice")
        .optional()
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Regular price must be zero or greater"
        ),

    body("salePrice")
        .optional()
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Sale price must be zero or greater"
        ),

    body("weight")
        .optional()
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Weight must be zero or greater"
        ),

    body("lowStockThreshold")
        .optional()
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Low stock threshold must be zero or greater"
        ),

];


module.exports = {

    createProductValidation,

    updateProductValidation,

};