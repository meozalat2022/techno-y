const mongoose =
    require("mongoose");

const Order =
    require("../../models/Order");

const inventoryService =
    require("../inventory");

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


const updateOrderStatus = async ({
    orderNumber,
    status,
    user,
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


    try {

        session.startTransaction();


        const order =
            await Order.findOne({
                orderNumber,
            })
                .session(session);


        if (!order) {

            throw new Error(
                MESSAGES.ORDER.NOT_FOUND
            );

        }


        const allowedStatuses =
            ORDER_STATUS_FLOW[
                order.status
            ] || [];


        if (
            !allowedStatuses.includes(
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


        if (
            newStatus ===
            ORDER_STATUS.CANCELLED
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
                            REFERENCE_TYPES.ORDER,

                        reference:
                            order.orderNumber,

                        notes:
                            "Order cancelled",

                        performedBy:
                            user?._id ||
                            null,

                        session,

                    });

            }

        }


        order.status =
            newStatus;


        await order.save({
            session,
        });


        await session
            .commitTransaction();


        return order;

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
    updateOrderStatus;