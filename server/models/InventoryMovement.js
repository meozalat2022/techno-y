const mongoose = require("mongoose");
const INVENTORY_MOVEMENT_TYPES =
    require("../constants/inventoryMovementTypes");
    const REFERENCE_TYPES = require("../constants/inventoryReferenceTypes");

const movementSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: Object.values(INVENTORY_MOVEMENT_TYPES),
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        previousStock: {
            type: Number,
            required: true,
            min: 0,
        },

        newStock: {
            type: Number,
            required: true,
            min: 0,
        },

        reference: {
            type: String,
            default: "",
        },

        referenceType: {
            type: String,
            enum: Object.values(REFERENCE_TYPES),
        },
        

        notes: {
            type: String,
            default: "",
            trim: true,
        },

        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

    },
    {
        timestamps: true,
    }
);

movementSchema.index({
    product: 1,
    createdAt: -1,
});

module.exports = mongoose.model(
    "InventoryMovement",
    movementSchema
);