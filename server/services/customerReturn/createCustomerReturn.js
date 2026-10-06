const mongoose =
    require("mongoose");

const Order =
    require("../../models/Order");

const CustomerReturn =
    require(
        "../../models/CustomerReturn"
    );

const ROLES =
    require("../../constants/roles");

const CUSTOMER_RETURN_STATUS =
    require(
        "../../constants/customerReturnStatus"
    );

const generateReturnNumber =
    require("./generateReturnNumber");

const validateReturn =
    require("./validateReturn");


const notificationService =
    require("../notification");


const createCustomerReturn =
    async ({
        orderNumber,
        items,
        reason,
        notes = "",
        user,
    }) => {

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
                    "Order not found."
                );

            }


            if (
                user.role !==
                    ROLES.ADMIN &&
                order.customer.user
                    ?.toString() !==
                    user._id.toString()
            ) {

                throw new Error(
                    "You are not authorized to return this order."
                );

            }


            const existingRequestedReturn =
                await CustomerReturn.findOne({

                    order:
                        order._id,

                    status:
                        CUSTOMER_RETURN_STATUS
                            .REQUESTED,

                })
                    .session(session);


            if (existingRequestedReturn) {

                throw new Error(
                    "This order already has an open return request."
                );

            }


            validateReturn({
                order,
                items,
                reason,
            });


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


            const returnItems =
                items.map(item => {

                    const orderItem =
                        orderItemMap.get(
                            item.product
                                .toString()
                        );


                    return {

                        product:
                            orderItem
                                .product,

                        title:
                            orderItem
                                .title,

                        sku:
                            orderItem.sku,

                        quantity:
                            item.quantity,

                        unitPrice:
                            orderItem
                                .pricing
                                .finalPrice,

                    };

                });


            const returnNumber =
                await generateReturnNumber(
                    session
                );


            const [customerReturn] =
                await CustomerReturn.create(
                    [
                        {

                            returnNumber,

                            order:
                                order._id,

                            orderNumber:
                                order.orderNumber,

                            customer:
                                order.customer
                                    .user,

                            items:
                                returnItems,

                            reason:
                                reason.trim(),

                            notes,

                        },
                    ],
                    {
                        session,
                    }
                );


            await session
                .commitTransaction();


            const notificationReturn =
                await customerReturn
                    .populate(
                        "customer",
                        "firstName lastName email phone"
                    );


            await notificationService
                .notifyCustomerReturnRequested(
                    notificationReturn
                );


            return notificationReturn;

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
    createCustomerReturn;