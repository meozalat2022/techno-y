const InventoryMovement = require("../../models/InventoryMovement");

const MESSAGES =
    require("../../constants/messages");

const createMovement = async ({
    product,
    type,
    quantity,
    previousStock,
    newStock,
    reference = "",
    referenceType,
    notes = "",
    performedBy = null,
    session,
}) => {

    // Required fields

    if (!product) {
        throw new Error(
            MESSAGES.INVENTORY.PRODUCT_REQUIRED
        );
    }

    if (!type) {
        throw new Error(
            MESSAGES.INVENTORY.MOVEMENT_TYPE_REQUIRED
        );
    }

    if (!referenceType) {
        throw new Error(
            MESSAGES.INVENTORY.REFERENCE_TYPE_REQUIRED
        );
    }

    if (!reference) {
        throw new Error(
            MESSAGES.INVENTORY.REFERENCE_REQUIRED
        );
    }

    // Numeric validation

    if (
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {
        throw new Error(
            MESSAGES.VALIDATION.MUST_BE_GREATER_THAN_ZERO(
                "Quantity"
            )
        );
    }

    if (!Number.isFinite(previousStock)) {
        throw new Error(
            MESSAGES.VALIDATION.INVALID_VALUE(
                "Previous stock"
            )
        );
    }

    if (!Number.isFinite(newStock)) {
        throw new Error(
            MESSAGES.VALIDATION.INVALID_VALUE(
                "New stock"
            )
        );
    }

    const movement = await InventoryMovement.create(
        [
            {
                product,
                type,
                quantity,
                previousStock,
                newStock,
                reference,
                referenceType,
                notes,
                performedBy,
            },
        ],
        {
            session,
        }
    );

    return movement[0];

};

module.exports = createMovement;