const User =
    require("../../models/User");

const LOYALTY_TRANSACTION_TYPES =
    require(
        "../../constants/loyaltyTransactionTypes"
    );

const createTransaction =
    require("./createTransaction");


const handleOrderDelivered =
    async ({
        order,
        performedBy,
        session,
    }) => {

        const points =
            Number(
                order.loyalty
                    ?.pointsPending ||
                0
            );


        if (
            points <=
                0 ||
            Number(
                order.loyalty
                    ?.pointsAwarded ||
                0
            ) >=
                points
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
                "Order customer was not found for loyalty award."
            );

        }


        user.loyalty
            .pendingPoints =
            Number(
                user.loyalty
                    ?.pendingPoints ||
                0
            ) -
            points;


        user.loyalty
            .availablePoints =
            Number(
                user.loyalty
                    ?.availablePoints ||
                0
            ) +
            points;


        await user.save({
            session,
        });


        await createTransaction({

            user,

            type:
                LOYALTY_TRANSACTION_TYPES
                    .EARN_AVAILABLE,

            points,

            availableDelta:
                points,

            pendingDelta:
                -points,

            order:
                order._id,

            orderNumber:
                order.orderNumber,

            eventKey:
                `ORDER:${order.orderNumber}:DELIVER`,

            note:
                `Points became available after delivery of ${order.orderNumber}`,

            performedBy:
                performedBy?._id ||
                null,

            session,

        });


        order.loyalty
            .pointsAwarded =
            points;


        order.loyalty
            .awardedAt =
            new Date();

    };


module.exports =
    handleOrderDelivered;
