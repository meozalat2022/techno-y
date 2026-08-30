const mongoose =
    require("mongoose");

const Order =
    require("../../models/Order");

const CustomerReturn =
    require(
        "../../models/CustomerReturn"
    );

const inventoryService =
    require("../inventory");

const loyaltyService =
    require("../loyalty");

const CUSTOMER_RETURN_STATUS =
    require(
        "../../constants/customerReturnStatus"
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


const receiveCustomerReturn =
    async ({
        returnId,
        user,
    }) => {

        const session =
            await mongoose.startSession();


        try {

            session.startTransaction();


            const customerReturn =
                await CustomerReturn
                    .findOne({

                        _id:
                            returnId,

                        status:
                            CUSTOMER_RETURN_STATUS
                                .REQUESTED,

                    })
                    .session(session);


            if (!customerReturn) {

                throw new Error(
                    "Return request not found or cannot be received."
                );

            }


            const order =
                await Order.findById(
                    customerReturn.order
                )
                    .session(session);


            if (!order) {

                throw new Error(
                    "Order not found."
                );

            }


            const orderItemMap =
                new Map(
                    order.items.map(
                        item => [
                            item.product
                                .toString(),
                            item,
                        ]
                    )
                );


            for (
                const returnItem
                of customerReturn.items
            ) {

                const orderItem =
                    orderItemMap.get(
                        returnItem.product
                            .toString()
                    );


                if (!orderItem) {

                    throw new Error(
                        "Returned product no longer belongs to the order."
                    );

                }


                const returnedQuantity =
                    orderItem
                        .returnedQuantity ||
                    0;


                const remainingReturnable =
                    orderItem.quantity -
                    returnedQuantity;


                if (
                    returnItem.quantity >
                    remainingReturnable
                ) {

                    throw new Error(
                        `Cannot receive more than the remaining returnable quantity for ${orderItem.title}.`
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
                                    .INCREASE,

                            session,

                        });


                await inventoryService
                    .createMovement({

                        product:
                            returnItem
                                .product,

                        type:
                            INVENTORY_MOVEMENT_TYPES
                                .RETURN_IN,

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
                                .CUSTOMER_RETURN,

                        reference:
                            customerReturn
                                .returnNumber,

                        notes:
                            customerReturn
                                .reason,

                        performedBy:
                            user?._id ||
                            null,

                        session,

                    });


                orderItem
                    .returnedQuantity =
                    returnedQuantity +
                    returnItem.quantity;

            }


            customerReturn.status =
                CUSTOMER_RETURN_STATUS
                    .RECEIVED;


            customerReturn.receivedAt =
                new Date();


            customerReturn.receivedBy =
                user?._id ||
                null;


            await loyaltyService
                .handleCustomerReturnReceived({

                    order,

                    customerReturn,

                    performedBy:
                        user,

                    session,

                });


            await order.save({
                session,
            });


            await customerReturn.save({
                session,
            });


            await session
                .commitTransaction();


            return customerReturn;

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
    receiveCustomerReturn;