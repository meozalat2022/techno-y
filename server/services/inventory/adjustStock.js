const mongoose = require("mongoose");

const validateAdjustment = require("./validateAdjustment");
const updateStock = require("./updateStock");
const generateAdjustmentNumber = require("./generateAdjustmentNumber");
const createMovement = require("./createMovement");
const STOCK_OPERATIONS =
    require("../../constants/stockOperations");
const INVENTORY_MOVEMENT_TYPES = require("../../constants/inventoryMovementTypes");
const REFERENCE_TYPES = require("../../constants/inventoryReferenceTypes");

const adjustStock = async ({
    productId,
    quantity,
    operation,
    reason,
    user,
}) => {

    validateAdjustment({
        productId,
        quantity,
        operation,
        reason,
    });

    const session = await mongoose.startSession();

    try {

        await session.startTransaction();
        const stock = await updateStock({
            productId,
            quantity,
            operation,
            session,
        });

        const adjustmentNumber =
            await generateAdjustmentNumber(session);
        const movementType =
            operation === STOCK_OPERATIONS.INCREASE
                ? INVENTORY_MOVEMENT_TYPES.ADJUSTMENT_IN
                : INVENTORY_MOVEMENT_TYPES.ADJUSTMENT_OUT;

        await createMovement({

            product: stock.productId,

            type:
                movementType,

            quantity,

            previousStock:
                stock.previousStock,

            newStock:
                stock.newStock,

            referenceType:
                REFERENCE_TYPES.ADJUSTMENT,

            reference:
                adjustmentNumber,

            notes: reason,

            performedBy: user?._id,

            session,

        });

        await session.commitTransaction();

        return stock;

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        await session.endSession();

    }

};

module.exports = adjustStock;