const MESSAGES =
    require("../../constants/messages");

const validateAdjustment = ({
    productId,
    quantity,
    operation,
    reason,
}) => {

    if (!productId) {
        throw new Error(
            MESSAGES.VALIDATION.REQUIRED_FIELD("Product ID")
        );
    }

    if (
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {
        throw new Error(
            MESSAGES.VALIDATION.MUST_BE_GREATER_THAN_ZERO("Quantity")
        );
    }

    if (
        operation !== "increase" &&
        operation !== "decrease"
    ) {
        throw new Error(
            MESSAGES.INVENTORY.OPERATION_REQUIRED
        );
    }

    if (!reason?.trim()) {
        throw new Error(
            MESSAGES.INVENTORY.ADJUSTMENT_REASON_REQUIRED
        );
    }

};

module.exports = validateAdjustment;