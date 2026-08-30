const User =
    require("../../models/User");

const LOYALTY_TRANSACTION_TYPES =
    require(
        "../../constants/loyaltyTransactionTypes"
    );

const createTransaction =
    require("./createTransaction");


const handleOrderCancellation =
    async ({
        order,
        performedBy,
        session,
    }) => {

        const user =
            await User.findById(
                order.customer.user
            )
                .session(
                    session
                );


        if (!user) {

            throw new Error(
                "Order customer was not found for loyalty cancellation."
            );

        }


        const pendingPoints =
            Number(
                order.loyalty
                    ?.pointsPending ||
                0
            );


        if (
            pendingPoints >
                0 &&
            !order.loyalty
                ?.pendingCancelled &&
            Number(
                order.loyalty
                    ?.pointsAwarded ||
                0
            ) ===
                0
        ) {

            user.loyalty
                .pendingPoints =
                Number(
                    user.loyalty
                        ?.pendingPoints ||
                    0
                ) -
                pendingPoints;


            order.loyalty
                .pendingCancelled =
                true;


            await user.save({
                session,
            });


            await createTransaction({

                user,

                type:
                    LOYALTY_TRANSACTION_TYPES
                        .EARN_CANCELLED,

                points:
                    pendingPoints,

                pendingDelta:
                    -pendingPoints,

                order:
                    order._id,

                orderNumber:
                    order.orderNumber,

                eventKey:
                    `ORDER:${order.orderNumber}:EARN_CANCELLED`,

                note:
                    `Pending points cancelled with order ${order.orderNumber}`,

                performedBy:
                    performedBy?._id ||
                    null,

                session,

            });

        }


        const redeemedPoints =
            Number(
                order.loyalty
                    ?.pointsRedeemed ||
                0
            );


        if (
            redeemedPoints >
                0 &&
            !order.loyalty
                ?.redemptionRestoredOnCancellation
        ) {

            user.loyalty
                .availablePoints =
                Number(
                    user.loyalty
                        ?.availablePoints ||
                    0
                ) +
                redeemedPoints;


            order.loyalty
                .redemptionRestoredOnCancellation =
                true;


            await user.save({
                session,
            });


            await createTransaction({

                user,

                type:
                    LOYALTY_TRANSACTION_TYPES
                        .REDEEM_RESTORE,

                points:
                    redeemedPoints,

                availableDelta:
                    redeemedPoints,

                order:
                    order._id,

                orderNumber:
                    order.orderNumber,

                eventKey:
                    `ORDER:${order.orderNumber}:REDEEM_RESTORE`,

                note:
                    `Redeemed points restored after cancellation of ${order.orderNumber}`,

                performedBy:
                    performedBy?._id ||
                    null,

                session,

            });

        }

    };


module.exports =
    handleOrderCancellation;
