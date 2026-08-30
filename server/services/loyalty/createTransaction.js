const LoyaltyTransaction =
    require(
        "../../models/LoyaltyTransaction"
    );


const createTransaction =
    async ({
        user,
        type,
        points,
        availableDelta = 0,
        pendingDelta = 0,
        order = null,
        orderNumber = "",
        customerReturn = null,
        returnNumber = "",
        eventKey,
        note = "",
        performedBy = null,
        session,
    }) => {

        const existing =
            await LoyaltyTransaction
                .findOne({
                    eventKey,
                })
                .session(
                    session
                );


        if (existing) {

            return existing;

        }


        const [transaction] =
            await LoyaltyTransaction
                .create(
                    [
                        {
                            user:
                                user._id,

                            type,

                            points:
                                Math.max(
                                    Number(
                                        points
                                    ) || 0,
                                    0
                                ),

                            availableDelta,

                            pendingDelta,

                            availableBalanceAfter:
                                Number(
                                    user.loyalty
                                        ?.availablePoints ||
                                    0
                                ),

                            pendingBalanceAfter:
                                Number(
                                    user.loyalty
                                        ?.pendingPoints ||
                                    0
                                ),

                            order,

                            orderNumber,

                            customerReturn,

                            returnNumber,

                            eventKey,

                            note,

                            performedBy,
                        },
                    ],
                    {
                        session,
                    }
                );


        return transaction;

    };


module.exports =
    createTransaction;
