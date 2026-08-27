const Product =
    require("../../models/Product");

const inventoryService =
    require("../inventory");

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

    for (
        const item
        of orderItems
    ) {

        /*
         * Re-read the current product inside the same
         * MongoDB transaction so the online safety buffer
         * is enforced at the moment stock is actually
         * deducted, not only during pre-validation.
         */
        const product =
            await Product.findById(
                item.product
            )
                .select(
                    "trackInventory onlineSafetyStock"
                )
                .session(
                    session
                );


        if (!product) {

            throw new Error(
                "Product not found."
            );

        }


        if (
            product.trackInventory ===
            false
        ) {

            continue;

        }


        const stockUpdate =
            await inventoryService
                .updateStock({

                    productId:
                        item.product,

                    quantity:
                        item.quantity,

                    operation:
                        STOCK_OPERATIONS
                            .DECREASE,

                    minimumRemainingStock:
                        Number(
                            product
                                .onlineSafetyStock ||
                            0
                        ),

                    session,

                });


        await inventoryService
            .createMovement({

                product:
                    stockUpdate
                        .productId,

                type:
                    INVENTORY_MOVEMENT_TYPES
                        .SALE,

                quantity:
                    item.quantity,

                previousStock:
                    stockUpdate
                        .previousStock,

                newStock:
                    stockUpdate
                        .newStock,

                referenceType:
                    REFERENCE_TYPES
                        .ORDER,

                reference:
                    orderNumber,

                notes:
                    "Online order placed",

                performedBy:
                    user?._id ||
                    null,

                session,

            });

    }

};


module.exports =
    updateInventory;
