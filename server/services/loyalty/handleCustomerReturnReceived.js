const User =
    require("../../models/User");

const LOYALTY_TRANSACTION_TYPES =
    require(
        "../../constants/loyaltyTransactionTypes"
    );

const createTransaction =
    require("./createTransaction");


const calculateReturnRatio =
    order => {

        const subtotal =
            Number(
                order.totals
                    ?.subtotal ||
                0
            );


        if (
            subtotal <=
            0
        ) {

            return 0;

        }


        const returnedGross =
            order.items.reduce(
                (
                    total,
                    item
                ) => {

                    const returnedQuantity =
                        Number(
                            item.returnedQuantity ||
                            0
                        );


                    const unitPrice =
                        Number(
                            item.pricing
                                ?.finalPrice ||
                            0
                        );


                    return (
                        total +
                        (
                            returnedQuantity *
                            unitPrice
                        )
                    );

                },
                0
            );


        return Math.min(
            Math.max(
                returnedGross /
                subtotal,
                0
            ),
            1
        );

    };


const handleCustomerReturnReceived =
    async ({
        order,
        customerReturn,
        performedBy,
        session,
    }) => {

        const ratio =
            calculateReturnRatio(
                order
            );


        if (
            ratio <=
            0
        ) {

            return;

        }


        const user =
            await User.findById(
                order.customer.user
            )
                .session(
                    session
                );


        if (!user) {

            throw new Error(
                "Order customer was not found for loyalty return adjustment."
            );

        }


        /*
         * 1) Reverse earned points proportionally.
         * On a full return the target equals the
         * entire awarded amount.
         */
        const pointsAwarded =
            Number(
                order.loyalty
                    ?.pointsAwarded ||
                0
            );


        const alreadyReversed =
            Number(
                order.loyalty
                    ?.pointsReversed ||
                0
            );


        let targetReversed =
            Math.floor(
                pointsAwarded *
                ratio
            );


        if (
            ratio >=
            1
        ) {

            targetReversed =
                pointsAwarded;

        }


        targetReversed =
            Math.min(
                targetReversed,
                pointsAwarded
            );


        const pointsToReverse =
            Math.max(
                targetReversed -
                    alreadyReversed,
                0
            );


        if (
            pointsToReverse >
            0
        ) {

            /*
             * Balance is allowed to go negative.
             * This prevents a customer from escaping
             * a reversal simply because they already
             * spent the points on another order.
             */
            user.loyalty
                .availablePoints =
                Number(
                    user.loyalty
                        ?.availablePoints ||
                    0
                ) -
                pointsToReverse;


            order.loyalty
                .pointsReversed =
                alreadyReversed +
                pointsToReverse;


            await user.save({
                session,
            });


            await createTransaction({

                user,

                type:
                    LOYALTY_TRANSACTION_TYPES
                        .RETURN_EARN_REVERSAL,

                points:
                    pointsToReverse,

                availableDelta:
                    -pointsToReverse,

                order:
                    order._id,

                orderNumber:
                    order.orderNumber,

                customerReturn:
                    customerReturn._id,

                returnNumber:
                    customerReturn
                        .returnNumber,

                eventKey:
                    `RETURN:${customerReturn.returnNumber}:EARN_REVERSAL`,

                note:
                    `Earned points reversed for ${customerReturn.returnNumber}`,

                performedBy:
                    performedBy?._id ||
                    null,

                session,

            });

        }


        /*
         * 2) Restore redeemed points proportionally.
         * This keeps a returned order from permanently
         * consuming loyalty points.
         */
        const pointsRedeemed =
            Number(
                order.loyalty
                    ?.pointsRedeemed ||
                0
            );


        const alreadyRestored =
            Number(
                order.loyalty
                    ?.redeemedPointsRestored ||
                0
            );


        let targetRestored =
            Math.floor(
                pointsRedeemed *
                ratio
            );


        if (
            ratio >=
            1
        ) {

            targetRestored =
                pointsRedeemed;

        }


        targetRestored =
            Math.min(
                targetRestored,
                pointsRedeemed
            );


        const pointsToRestore =
            Math.max(
                targetRestored -
                    alreadyRestored,
                0
            );


        if (
            pointsToRestore >
            0
        ) {

            user.loyalty
                .availablePoints =
                Number(
                    user.loyalty
                        ?.availablePoints ||
                    0
                ) +
                pointsToRestore;


            order.loyalty
                .redeemedPointsRestored =
                alreadyRestored +
                pointsToRestore;


            await user.save({
                session,
            });


            await createTransaction({

                user,

                type:
                    LOYALTY_TRANSACTION_TYPES
                        .RETURN_REDEMPTION_RESTORE,

                points:
                    pointsToRestore,

                availableDelta:
                    pointsToRestore,

                order:
                    order._id,

                orderNumber:
                    order.orderNumber,

                customerReturn:
                    customerReturn._id,

                returnNumber:
                    customerReturn
                        .returnNumber,

                eventKey:
                    `RETURN:${customerReturn.returnNumber}:REDEMPTION_RESTORE`,

                note:
                    `Redeemed points restored for ${customerReturn.returnNumber}`,

                performedBy:
                    performedBy?._id ||
                    null,

                session,

            });

        }

    };


module.exports =
    handleCustomerReturnReceived;
