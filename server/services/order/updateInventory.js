const inventoryService = require("../inventory");
const INVENTORY_MOVEMENT_TYPES =
    require("../../constants/inventoryMovementTypes");
const REFERENCE_TYPES =
    require("../../constants/inventoryReferenceTypes");
const STOCK_OPERATIONS =
    require("../../constants/stockOperations");


    const updateInventory = async ({
    orderItems,
    orderNumber,
    user,
    session,
}) => {

    for (const item of orderItems) {

        const stockUpdate =
            await inventoryService.updateStock({

                productId: item.product,

                quantity: item.quantity,

                operation:
                    STOCK_OPERATIONS.DECREASE,

                session,

            });

        await inventoryService.createMovement({

            product: stockUpdate.productId,

            type:
                INVENTORY_MOVEMENT_TYPES.SALE,

            quantity: item.quantity,

            previousStock:
                stockUpdate.previousStock,

            newStock:
                stockUpdate.newStock,

            referenceType:
                REFERENCE_TYPES.ORDER,

            reference:
                orderNumber,

            notes:
                "Order placed",

            performedBy:
                user?._id || null,

            session,

        });

    }

};

module.exports = updateInventory;

