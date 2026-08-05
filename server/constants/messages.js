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
        LIST_RETRIEVED: "Orders retrieved successfully",
        NOT_FOUND: "Order not found",
        STATUS_UPDATED: "Order status updated successfully",
        DASHBOARD_RETRIEVED:
            "Dashboard statistics retrieved successfully",
    },
    AUTH: {
        REGISTER_SUCCESS: "User registered successfully",
        LOGIN_SUCCESS: "Login successful",
        LOGOUT_SUCCESS: "Logged out successfully",
        CURRENT_USER_RETRIEVED: "Current user retrieved successfully",

        INVALID_CREDENTIALS: "Invalid email or password",
        EMAIL_ALREADY_EXISTS: "Email already exists",
        UNAUTHORIZED: "Not authorized",
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