const validatePurchase = ({
    supplier,
    items,
}) => {

    if (!supplier) {
        throw new Error("Supplier is required.");
    }

    if (!Array.isArray(items) || items.length === 0) {
        throw new Error(
            "Purchase must contain at least one item."
        );
    }

};

module.exports = validatePurchase;