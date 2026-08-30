const User =
    require("../../models/User");

const LOYALTY_TRANSACTION_TYPES =
    require(
        "../../constants/loyaltyTransactionTypes"
    );

const calculateOrderLoyalty =
    require("./calculateOrderLoyalty");

const createTransaction =
    require("./createTransaction");


const applyOrderCreation =
    async ({
        userId,
        orderNumber,
        subtotal,
        requestedPoints = 0,
        session,
    }) => {

        const user =
            await User.findById(
                userId
            )
                .session(
                    session
                );


        if (!user) {

            throw new Error(
                "User not found."
            );

        }


        if (!user.loyalty) {

            user.loyalty = {
                availablePoints:
                    0,
                pendingPoints:
                    0,
            };

        }


        const result =
            calculateOrderLoyalty({

                subtotal,

                requestedPoints,

                availablePoints:
                    user.loyalty
                        .availablePoints,

            });


        if (
            result.pointsRedeemed >
            0
        ) {

            user.loyalty
                .availablePoints -=
                result.pointsRedeemed;

        }


        if (
            result.pointsToEarn >
            0
        ) {

            user.loyalty
                .pendingPoints +=
                result.pointsToEarn;

        }


        await user.save({
            session,
        });


        if (
            result.pointsRedeemed >
            0
        ) {

            await createTransaction({

                user,

                type:
                    LOYALTY_TRANSACTION_TYPES
                        .REDEEM,

                points:
                    result.pointsRedeemed,

                availableDelta:
                    -result
                        .pointsRedeemed,

                orderNumber,

                eventKey:
                    `ORDER:${orderNumber}:REDEEM`,

                note:
                    `Redeemed on order ${orderNumber}`,

                performedBy:
                    user._id,

                session,

            });

        }


        if (
            result.pointsToEarn >
            0
        ) {

            await createTransaction({

                user,

                type:
                    LOYALTY_TRANSACTION_TYPES
                        .EARN_PENDING,

                points:
                    result.pointsToEarn,

                pendingDelta:
                    result.pointsToEarn,

                orderNumber,

                eventKey:
                    `ORDER:${orderNumber}:EARN_PENDING`,

                note:
                    `Pending points for order ${orderNumber}`,

                performedBy:
                    user._id,

                session,

            });

        }


        return {

            loyalty: {

                pointsRedeemed:
                    result
                        .pointsRedeemed,

                redemptionAmount:
                    result
                        .redemptionAmount,

                pointsPending:
                    result
                        .pointsToEarn,

                pointsAwarded:
                    0,

                pointsReversed:
                    0,

                redeemedPointsRestored:
                    0,

                pendingCancelled:
                    false,

                redemptionRestoredOnCancellation:
                    false,

                awardedAt:
                    null,

            },

            discount:
                result.redemptionAmount,

            total:
                Math.max(
                    Number(
                        subtotal
                    ) -
                    result
                        .redemptionAmount,
                    0
                ),

        };

    };


module.exports =
    applyOrderCreation;
