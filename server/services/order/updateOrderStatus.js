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



/*
 * Restore physical stock for one product.
 */
const restorePhysicalProduct =
    async ({
        productId,
        quantity,
        order,
        user,
        session,
    }) => {

        const stockUpdate =
            await inventoryService
                .updateStock({

                    productId,

                    quantity,

                    operation:
                        STOCK_OPERATIONS
                            .INCREASE,

                    session,

                });


        await inventoryService
            .createMovement({

                product:
                    productId,

                type:
                    INVENTORY_MOVEMENT_TYPES
                        .ORDER_CANCELLATION,

                quantity,

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
                    order.orderNumber,

                notes:
                    "Order cancelled",

                performedBy:
                    user?._id ||
                    null,

                session,

            });

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
         * transient transaction errors.
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



                /*
                 * CANCELLED
                 *
                 * Restore the exact physical
                 * products that were deducted when
                 * the order was created.
                 */
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

                        /*
                         * NORMAL PRODUCT
                         */
                        if (
                            item.isBundle !==
                            true
                        ) {

                            await restorePhysicalProduct({

                                productId:
                                    item.product,

                                quantity:
                                    item.quantity,

                                order,

                                user,

                                session,

                            });

                            continue;

                        }



                        /*
                         * BUNDLE PRODUCT
                         *
                         * Restore from the snapshot
                         * stored in the order.
                         */
                        const components =
                            Array.isArray(
                                item.bundleComponents
                            )
                                ? item.bundleComponents
                                : [];


                        if (
                            components.length === 0
                        ) {

                            throw new Error(
                                "Bundle order item has no component snapshot."
                            );

                        }


                        for (
                            const component
                            of components
                        ) {

                            const componentQuantity =
                                Number(
                                    component.quantity
                                );


                            if (
                                !Number.isInteger(
                                    componentQuantity
                                ) ||
                                componentQuantity <= 0
                            ) {

                                throw new Error(
                                    "Invalid Bundle component quantity."
                                );

                            }


                            const totalQuantity =
                                item.quantity *
                                componentQuantity;


                            await restorePhysicalProduct({

                                productId:
                                    component.product,

                                quantity:
                                    totalQuantity,

                                order,

                                user,

                                session,

                            });

                        }

                    }


                    order.payment
                        .inventoryRestored =
                        true;

                }



                /*
                 * Persist payment changes in the
                 * same transaction.
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