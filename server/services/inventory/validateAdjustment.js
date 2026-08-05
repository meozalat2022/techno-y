const validateAdjustment = ({
    productId,
    quantity,
    operation,
    reason,
}) => {

    if (!productId) {
        throw new Error("Product ID is required.");
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error(
            "Quantity must be greater than zero."
        );
    }

    if (
        operation !== "increase" &&
        operation !== "decrease"
    ) {
        throw new Error(
            "Operation must be increase or decrease."
        );
    }

    if (!reason?.trim()) {
        throw new Error(
            "Adjustment reason is required."
        );
    }

};

module.exports = validateAdjustment;