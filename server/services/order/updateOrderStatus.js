const mongoose =
    require("mongoose");

const Order =
    require("../../models/Order");

const inventoryService =
    require("../inventory");

const loyaltyService =
    require("../loyalty");

const MESSAGES =
    require("../../constants/messages");

const ORDER_STATUS =
    require(
        "../../constants/orderStatus"
    );

const ORDER_STATUS_FLOW =
    require(
        "../../constants/orderStatusFlow"
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


const applyPaymentPatch = (
    order,
    paymentPatch
) => {

    if (
        !paymentPatch ||
        typeof paymentPatch !==
            "object"
    ) {
        return;
    }


    Object.entries(
        paymentPatch
    ).forEach(
        ([
            key,
            value,
        ]) => {

            if (
                value !==
                undefined
            ) {

                order.payment[
                    key
                ] =
                    value;

            }

        }
    );

};


const updateOrderStatus = async ({
    orderNumber,
    status,
    user,
    paymentPatch = null,
}) => {

    if (
        typeof status !==
            "string" ||
        !status.trim()
    ) {

        throw new Error(
            MESSAGES.ORDER.STATUS_REQUIRED
        );

    }


    const newStatus =
        status
            .trim()
            .toLowerCase();


    const session =
        await mongoose.startSession();


    let updatedOrder =
        null;


    try {

        /*
         * withTransaction() automatically retries
         * transient transaction errors such as
         * MongoDB write conflicts.
         *
         * This is important for OPay because the
         * merchant /close request and OPay callback
         * can reconcile the same order concurrently.
         */
        await session.withTransaction(
            async () => {

                const order =
                    await Order.findOne({
                        orderNumber,
                    })
                        .session(
                            session
                        );


                if (!order) {

                    throw new Error(
                        MESSAGES.ORDER
                            .NOT_FOUND
                    );

                }


                const alreadyAtStatus =
                    order.status ===
                    newStatus;


                /*
                 * Treat an already-applied status
                 * as idempotent instead of rejecting
                 * it as an invalid transition.
                 *
                 * If an old/inconsistent cancelled
                 * order somehow has not had inventory
                 * restored, the cancellation block
                 * below can still repair it.
                 */
                if (
                    !alreadyAtStatus
                ) {

                    const allowedStatuses =
                        ORDER_STATUS_FLOW[
                            order.status
                        ] || [];


                    if (
                        !allowedStatuses
                            .includes(
                                newStatus
                            )
                    ) {

                        throw new Error(
                            MESSAGES.ORDER
                                .INVALID_STATUS_TRANSITION(
                                    order.status,
                                    newStatus
                                )
                        );

                    }

                }


                if (
                    newStatus ===
                        ORDER_STATUS
                            .CANCELLED &&
                    !order.payment
                        .inventoryRestored
                ) {

                    for (
                        const item
                        of order.items
                    ) {

                        const stockUpdate =
                            await inventoryService
                                .updateStock({

                                    productId:
                                        item.product,

                                    quantity:
                                        item.quantity,

                                    operation:
                                        STOCK_OPERATIONS
                                            .INCREASE,

                                    session,

                                });


                        await inventoryService
                            .createMovement({

                                product:
                                    item.product,

                                type:
                                    INVENTORY_MOVEMENT_TYPES
                                        .ORDER_CANCELLATION,

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
                                    order
                                        .orderNumber,

                                notes:
                                    "Order cancelled",

                                performedBy:
                                    user?._id ||
                                    null,

                                session,

                            });

                    }


                    order.payment
                        .inventoryRestored =
                        true;

                }


                /*
                 * For terminal OPay states we persist
                 * the payment result in the SAME
                 * transaction as the cancellation /
                 * inventory restoration.
                 */
                applyPaymentPatch(
                    order,
                    paymentPatch
                );


                order.status =
                    newStatus;


                if (
                    newStatus ===
                    ORDER_STATUS
                        .CANCELLED
                ) {

                    await loyaltyService
                        .handleOrderCancellation({

                            order,

                            performedBy:
                                user,

                            session,

                        });

                }


                if (
                    newStatus ===
                    ORDER_STATUS
                        .DELIVERED
                ) {

                    await loyaltyService
                        .handleOrderDelivered({

                            order,

                            performedBy:
                                user,

                            session,

                        });

                }


                await order.save({
                    session,
                });


                updatedOrder =
                    order;

            }
        );


        return updatedOrder;

    } finally {

        await session
            .endSession();

    }

};


module.exports =
    updateOrderStatus;
