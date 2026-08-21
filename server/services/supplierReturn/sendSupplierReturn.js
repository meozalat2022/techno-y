const mongoose =
    require("mongoose");

const Purchase =
    require("../../models/Purchase");

const SupplierReturn =
    require(
        "../../models/SupplierReturn"
    );

const inventoryService =
    require("../inventory");

const MESSAGES =
    require("../../constants/messages");

const SUPPLIER_RETURN_STATUS =
    require(
        "../../constants/supplierReturnStatus"
    );

const STOCK_OPERATIONS =
    require(
        "../../constants/stockOperations"
    );

const INVENTORY_MOVEMENT_TYPES =
    require(
        "../../constants/inventoryMovementTypes"
    );

const REFERENCE_TYPES =
    require(
        "../../constants/inventoryReferenceTypes"
    );


const sendSupplierReturn =
    async ({
        returnId,
        user,
    }) => {

        const session =
            await mongoose.startSession();


        try {

            session.startTransaction();


            const supplierReturn =
                await SupplierReturn
                    .findOne({

                        _id:
                            returnId,

                        status:
                            SUPPLIER_RETURN_STATUS
                                .REQUESTED,

                    })
                    .session(session);


            if (!supplierReturn) {

                throw new Error(
                    MESSAGES.SUPPLIER_RETURN
                        .CANNOT_SEND
                );

            }


            const purchase =
                await Purchase.findById(
                    supplierReturn.purchase
                )
                    .session(session);


            if (!purchase) {

                throw new Error(
                    MESSAGES.SUPPLIER_RETURN
                        .PURCHASE_NOT_FOUND
                );

            }


            const purchaseItemMap =
                new Map(
                    purchase.items.map(
                        item => [
                            item.product
                                .toString(),
                            item,
                        ]
                    )
                );


            for (
                const returnItem
                of supplierReturn.items
            ) {

                const purchaseItem =
                    purchaseItemMap.get(
                        returnItem.product
                            .toString()
                    );


                if (!purchaseItem) {

                    throw new Error(
                        MESSAGES.SUPPLIER_RETURN
                            .PRODUCT_NOT_IN_PURCHASE
                    );

                }


                const returnedQuantity =
                    purchaseItem
                        .returnedQuantity ||
                    0;


                const remainingReturnable =
                    purchaseItem
                        .receivedQuantity -
                    returnedQuantity;


                if (
                    returnItem.quantity >
                    remainingReturnable
                ) {

                    throw new Error(
                        MESSAGES.SUPPLIER_RETURN
                            .EXCEEDS_RETURNABLE(
                                purchaseItem
                                    .title
                            )
                    );

                }


                const stockUpdate =
                    await inventoryService
                        .updateStock({

                            productId:
                                returnItem
                                    .product,

                            quantity:
                                returnItem
                                    .quantity,

                            operation:
                                STOCK_OPERATIONS
                                    .DECREASE,

                            session,

                        });


                await inventoryService
                    .createMovement({

                        product:
                            returnItem
                                .product,

                        type:
                            INVENTORY_MOVEMENT_TYPES
                                .RETURN_OUT,

                        quantity:
                            returnItem
                                .quantity,

                        previousStock:
                            stockUpdate
                                .previousStock,

                        newStock:
                            stockUpdate
                                .newStock,

                        referenceType:
                            REFERENCE_TYPES
                                .SUPPLIER_RETURN,

                        reference:
                            supplierReturn
                                .returnNumber,

                        notes:
                            supplierReturn
                                .reason,

                        performedBy:
                            user?._id ||
                            null,

                        session,

                    });


                purchaseItem
                    .returnedQuantity =
                    returnedQuantity +
                    returnItem.quantity;

            }


            supplierReturn.status =
                SUPPLIER_RETURN_STATUS
                    .SENT;


            supplierReturn.sentAt =
                new Date();


            supplierReturn.sentBy =
                user?._id ||
                null;


            await purchase.save({
                session,
            });


            await supplierReturn.save({
                session,
            });


            await session
                .commitTransaction();


            return supplierReturn;

        } catch (error) {

            await session
                .abortTransaction();

            throw error;

        } finally {

            await session
                .endSession();

        }

    };


module.exports =
    sendSupplierReturn;