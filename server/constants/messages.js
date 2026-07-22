const MESSAGES = {
    PRODUCT: {
    CREATED: "Product created successfully",
    UPDATED: "Product updated successfully",
    DELETED: "Product deleted successfully",
    RETRIEVED: "Product retrieved successfully",
    LIST_RETRIEVED: "Products retrieved successfully",
    NOT_FOUND: "Product not found",
    SKU_ALREADY_EXISTS: "SKU already exists",
},

    CATEGORY: {
        CREATED: "Category created successfully",
        UPDATED: "Category updated successfully",
        DELETED: "Category deleted successfully",
        RETRIEVED: "Category retrieved successfully",
    },

    BRAND: {
        CREATED: "Brand created successfully",
        UPDATED: "Brand updated successfully",
        DELETED: "Brand deleted successfully",
        RETRIEVED: "Brand retrieved successfully",
    },

    ORDER: {
        CREATED: "Order placed successfully",
        UPDATED: "Order updated successfully",
        RETRIEVED: "Order retrieved successfully",
    },
    COMMON: {
    RESOURCE_NOT_FOUND: "Resource not found",
    INVALID_TOKEN: "Invalid token",
    TOKEN_EXPIRED: "Token expired",
    VALIDATION_FAILED: "Validation failed",
    INTERNAL_SERVER_ERROR: "Internal server error"
}
};

module.exports = MESSAGES;