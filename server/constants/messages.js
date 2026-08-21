const MESSAGES = {

    PRODUCT: {

        CREATED:
            "Product created successfully",

        UPDATED:
            "Product updated successfully",

        DELETED:
            "Product deleted successfully",

        RETRIEVED:
            "Product retrieved successfully",

        LIST_RETRIEVED:
            "Products retrieved successfully",

        NOT_FOUND:
            "Product not found",

        SKU_ALREADY_EXISTS:
            "SKU already exists",

        ONE_OR_MORE_NOT_FOUND:
            "One or more products were not found",

        OUT_OF_STOCK:
            title =>
                `${title} is out of stock.`,

        INSUFFICIENT_STOCK:
            (title, stock) =>
                `Only ${stock} units of ${title} are available.`,

    },


    CATEGORY: {

        CREATED:
            "Category created successfully",

        UPDATED:
            "Category updated successfully",

        DELETED:
            "Category deleted successfully",

        RETRIEVED:
            "Category retrieved successfully",

        LIST_RETRIEVED:
            "Categories retrieved successfully",

        NOT_FOUND:
            "Category not found",

        ALREADY_EXISTS:
            "Category already exists",

    },


    BRAND: {

        CREATED:
            "Brand created successfully",

        UPDATED:
            "Brand updated successfully",

        DELETED:
            "Brand deleted successfully",

        RETRIEVED:
            "Brand retrieved successfully",

        LIST_RETRIEVED:
            "Brands retrieved successfully",

        NOT_FOUND:
            "Brand not found",

        ALREADY_EXISTS:
            "Brand already exists",

    },


    ORDER: {

        CREATED:
            "Order placed successfully",

        UPDATED:
            "Order updated successfully",

        RETRIEVED:
            "Order retrieved successfully",

        LIST_RETRIEVED:
            "Orders retrieved successfully",

        NOT_FOUND:
            "Order not found",

        STATUS_UPDATED:
            "Order status updated successfully",

        STATUS_REQUIRED:
            "Order status is required.",

        INVALID_STATUS_TRANSITION:
            (currentStatus, newStatus) =>
                `Cannot change order status from '${currentStatus}' to '${newStatus}'.`,

        DASHBOARD_RETRIEVED:
            "Dashboard statistics retrieved successfully",

    },


    PURCHASE: {

        CREATED:
            "Purchase created successfully",

        RETRIEVED:
            "Purchase retrieved successfully",

        LIST_RETRIEVED:
            "Purchases retrieved successfully",

        SUBMITTED:
            "Purchase submitted successfully",

        RECEIVED:
            "Purchase received successfully",

        NOT_FOUND:
            "Purchase not found",

        SUPPLIER_REQUIRED:
            "Supplier is required.",

        ITEMS_REQUIRED:
            "Purchase must contain at least one item.",

        PRODUCT_REQUIRED:
            "Product is required.",

        QUANTITY_INVALID:
            "Quantity must be a valid number greater than zero.",

        UNIT_COST_INVALID:
            "Unit cost must be a valid number greater than or equal to zero.",

        DUPLICATE_PRODUCT:
            "A product can only appear once in a purchase.",

        CANNOT_SUBMIT:
            "Only draft purchases can be submitted.",

        CANNOT_RECEIVE:
            "Purchase cannot receive inventory in its current status.",

        NO_RECEIVED_ITEMS:
            "No received items were provided.",

        PRODUCT_NOT_IN_PURCHASE:
            "Product does not belong to this purchase.",

        RECEIVED_QUANTITY_INVALID:
            "Received quantity must be greater than zero.",

        RECEIVED_QUANTITY_EXCEEDS_REMAINING:
            "Received quantity cannot exceed the remaining purchase quantity.",

        DUPLICATE_RECEIVED_PRODUCT:
            "A product can only be received once per request.",

    },


    SUPPLIER: {

        CREATED:
            "Supplier created successfully",

        UPDATED:
            "Supplier updated successfully",

        DELETED:
            "Supplier deleted successfully",

        RETRIEVED:
            "Supplier retrieved successfully",

        LIST_RETRIEVED:
            "Suppliers retrieved successfully",

        NOT_FOUND:
            "Supplier not found",

        NAME_REQUIRED:
            "Supplier name is required.",

        PHONE_REQUIRED:
            "Supplier phone is required.",

    },


    INVENTORY: {

        ADJUSTED:
            "Stock adjusted successfully.",

        INVALID_OPERATION:
            "Invalid stock operation.",

        OPERATION_REQUIRED:
            "Operation must be increase or decrease.",

        INSUFFICIENT_STOCK:
            "Insufficient stock.",

        REFERENCE_REQUIRED:
            "Inventory movement reference is required.",

        REFERENCE_TYPE_REQUIRED:
            "Inventory movement reference type is required.",

        PRODUCT_REQUIRED:
            "Inventory movement product is required.",

        MOVEMENT_TYPE_REQUIRED:
            "Inventory movement type is required.",

        ADJUSTMENT_REASON_REQUIRED:
            "Adjustment reason is required.",

    },


    STOCK: {

        INSUFFICIENT:
            "Insufficient stock.",

        INVALID_OPERATION:
            "Invalid stock operation.",

    },


    VALIDATION: {

        REQUIRED_FIELD:
            field =>
                `${field} is required.`,

        INVALID_VALUE:
            field =>
                `Invalid ${field}.`,

        MUST_BE_GREATER_THAN_ZERO:
            field =>
                `${field} must be greater than zero.`,

        INVALID_ARRAY:
            field =>
                `${field} must be an array.`,

    },


    AUTH: {

        REGISTER_SUCCESS:
            "User registered successfully",

        LOGIN_SUCCESS:
            "Login successful",

        LOGOUT_SUCCESS:
            "Logged out successfully",

        CURRENT_USER_RETRIEVED:
            "Current user retrieved successfully",

        USER_RETRIEVED:
            "Current user retrieved successfully",

        INVALID_CREDENTIALS:
            "Invalid email or password",

        EMAIL_ALREADY_EXISTS:
            "Email already exists",

        UNAUTHORIZED:
            "Not authorized",

        NOT_AUTHORIZED:
            "Not authorized",

        INVALID_TOKEN:
            "Invalid token",

        ADMIN_ACCESS_REQUIRED:
            "Administrator access required",

    },


    UPLOAD: {

        NO_IMAGES:
            "No images were provided.",

        SUCCESS:
            "Images uploaded successfully",

        INVALID_FILE_TYPE:
            "Only image files are allowed.",

        FILE_TOO_LARGE:
            "Uploaded image is too large.",

    },


    COMMON: {

        RESOURCE_NOT_FOUND:
            "Resource not found",

        INVALID_TOKEN:
            "Invalid token",

        TOKEN_EXPIRED:
            "Token expired",

        VALIDATION_FAILED:
            "Validation failed",

        INTERNAL_SERVER_ERROR:
            "Internal server error",

    },
    SUPPLIER_RETURN: {

    CREATED:
        "Supplier return created successfully",

    SENT:
        "Supplier return sent successfully",

    REJECTED:
        "Supplier return rejected successfully",

    RETRIEVED:
        "Supplier return retrieved successfully",

    LIST_RETRIEVED:
        "Supplier returns retrieved successfully",

    NOT_FOUND:
        "Supplier return not found",

    PURCHASE_NOT_FOUND:
        "Purchase not found.",

    ITEMS_REQUIRED:
        "Supplier return must contain at least one item.",

    PRODUCT_REQUIRED:
        "Product is required.",

    QUANTITY_INVALID:
        "Return quantity must be greater than zero.",

    REASON_REQUIRED:
        "Supplier return reason is required.",

    DUPLICATE_PRODUCT:
        "A product can only appear once in a supplier return.",

    PRODUCT_NOT_IN_PURCHASE:
        "Product does not belong to this purchase.",

    EXCEEDS_RETURNABLE:
        title =>
            `Cannot return more than the remaining returnable quantity for ${title}.`,

    CANNOT_SEND:
        "Supplier return request not found or cannot be sent.",

    CANNOT_REJECT:
        "Supplier return request not found or cannot be rejected.",

},

};


module.exports = MESSAGES;