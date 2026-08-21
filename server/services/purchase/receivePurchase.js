const mongoose =
    require("mongoose");

const Purchase =
    require("../../models/Purchase");

const inventoryService =
    require("../inventory");

const findDocumentOrThrow =
    require("../../utils/findDocumentOrThrow");

const INVENTORY_MOVEMENT_TYPES =
    require("../../constants/inventoryMovementTypes");

const REFERENCE_TYPES =
    require("../../constants/inventoryReferenceTypes");

const STOCK_OPERATIONS =
    require("../../constants/stockOperations");

const validateReceive =
    require("./validateReceive");

const updatePurchaseStatus =
    require("./updatePurchaseStatus");


const receivePurchase = async ({
    purchaseId,
    receivedItems,
    user,
}) => {

    const session =
        await mongoose.startSession();

    try {

        await session.startTransaction();

        const purchase =
            await findDocumentOrThrow(
                Purchase,
                {
                    _id: purchaseId,
                },
                "Purchase",
                session
            );

        validateReceive(
            purchase,
            receivedItems
        );

        const receivedItemMap =
            new Map(
                receivedItems.map(item => [
                    item.product.toString(),
                    item,
                ])
            );

        for (
            const purchaseItem
            of purchase.items
        ) {

            const receivedItem =
                receivedItemMap.get(
                    purchaseItem.product.toString()
                );

            if (!receivedItem) {
                continue;
            }

            purchaseItem.receivedQuantity +=
                receivedItem.quantityReceived;

            const stock =
                await inventoryService.updateStock({

                    productId:
                        purchaseItem.product,

                    quantity:
                        receivedItem.quantityReceived,

                    operation:
                        STOCK_OPERATIONS.INCREASE,

                    session,

                });

            await inventoryService.createMovement({

                product:
                    purchaseItem.product,

                type:
                    INVENTORY_MOVEMENT_TYPES.PURCHASE,

                quantity:
                    receivedItem.quantityReceived,

                previousStock:
                    stock.previousStock,

                newStock:
                    stock.newStock,

                referenceType:
                    REFERENCE_TYPES.PURCHASE,

                reference:
                    purchase.purchaseNumber,

                notes:
                    "Purchase received",

                performedBy:
                    user?._id || null,

                session,

            });

        }

        updatePurchaseStatus(
            purchase
        );

        await purchase.save({
            session,
        });

        await session.commitTransaction();

        return purchase;

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        await session.endSession();

    }

};


module.exports = receivePurchase;