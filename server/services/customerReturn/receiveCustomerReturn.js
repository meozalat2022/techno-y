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


            /*
             * Process every returned order line.
             */
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


                /*
                 * =========================================================
                 * NORMAL PRODUCT RETURN
                 * =========================================================
                 *
                 * A normal product owns its own physical stock, so the
                 * returned quantity is added directly to that product.
                 */
                if (
                    orderItem.isBundle !== true
                ) {

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

                }


                /*
                 * =========================================================
                 * BUNDLE RETURN
                 * =========================================================
                 *
                 * Bundles do not own physical stock.
                 *
                 * Example:
                 *
                 * Bundle:
                 *   Vacuum A × 2
                 *   Vacuum B × 1
                 *
                 * Customer returns:
                 *   Bundle × 2
                 *
                 * We restore:
                 *   Vacuum A +4
                 *   Vacuum B +2
                 *
                 * We use orderItem.bundleComponents rather than the
                 * current Product.bundleItems because the Bundle may have
                 * been modified after the original order was created.
                 */
                else {

                    const bundleComponents =
                        Array.isArray(
                            orderItem
                                .bundleComponents
                        )
                            ? orderItem
                                .bundleComponents
                            : [];


                    if (
                        bundleComponents.length ===
                        0
                    ) {

                        throw new Error(
                            `Cannot receive Bundle return for "${orderItem.title}" because the order does not contain a Bundle component snapshot.`
                        );

                    }


                    for (
                        const component
                        of bundleComponents
                    ) {

                        const componentProductId =
                            component.product;


                        const componentQuantity =
                            Number(
                                component.quantity
                            );


                        if (
                            !componentProductId
                        ) {

                            throw new Error(
                                `Bundle "${orderItem.title}" contains an invalid component reference.`
                            );

                        }


                        if (
                            !Number.isInteger(
                                componentQuantity
                            ) ||
                            componentQuantity <=
                                0
                        ) {

                            throw new Error(
                                `Bundle "${orderItem.title}" contains an invalid component quantity.`
                            );

                        }


                        /*
                         * One returned Bundle restores the number of
                         * physical component units defined in the
                         * historical Bundle snapshot.
                         *
                         * Therefore:
                         *
                         * component return quantity =
                         * returned Bundle quantity × component quantity
                         */
                        const componentReturnQuantity =
                            returnItem.quantity *
                            componentQuantity;


                        const stockUpdate =
                            await inventoryService
                                .updateStock({

                                    productId:
                                        componentProductId,

                                    quantity:
                                        componentReturnQuantity,

                                    operation:
                                        STOCK_OPERATIONS
                                            .INCREASE,

                                    session,

                                });


                        await inventoryService
                            .createMovement({

                                product:
                                    stockUpdate
                                        .productId,

                                type:
                                    INVENTORY_MOVEMENT_TYPES
                                        .RETURN_IN,

                                quantity:
                                    componentReturnQuantity,

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
                                    `Bundle return: ${orderItem.title}`,

                                performedBy:
                                    user?._id ||
                                    null,

                                session,

                            });

                    }

                }


                /*
                 * The returnedQuantity belongs to the ORDER LINE.
                 *
                 * For a Bundle:
                 *   Bundle × 1 returned
                 * means returnedQuantity increases by 1,
                 * not by the number of physical components.
                 */
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


            /*
             * Loyalty processing remains unchanged.
             *
             * It operates on the returned order quantities,
             * not on the physical component quantities.
             */
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

            if (
                session.inTransaction()
            ) {

                await session
                    .abortTransaction();

            }


            throw error;

        } finally {

            await session
                .endSession();

        }

    };


module.exports =
    receiveCustomerReturn;