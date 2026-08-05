const InventoryMovement = require("../../models/InventoryMovement");

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

    if (!referenceType) {
    throw new Error("Inventory movement referenceType is required.");
}

if (!reference) {
    throw new Error("Inventory movement reference is required.");
}

if (!product) {
    throw new Error(
        "Inventory movement product is required."
    );
}

if (!type) {
    throw new Error(
        "Inventory movement type is required."
    );
}

    const movement = await InventoryMovement.create(
        [{
            product,
            type,
            quantity,
            previousStock,
            newStock,
            reference,
            notes,
            performedBy,
            referenceType
        }],


        {
            session,
        }

        
    );

    return movement[0];

};

module.exports = createMovement;