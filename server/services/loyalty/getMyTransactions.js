const LoyaltyTransaction =
    require(
        "../../models/LoyaltyTransaction"
    );


const getMyTransactions =
    async ({
        userId,
        page = 1,
        limit = 20,
    }) => {

        const safePage =
            Math.max(
                Number(page) ||
                    1,
                1
            );


        const safeLimit =
            Math.min(
                Math.max(
                    Number(limit) ||
                        20,
                    1
                ),
                100
            );


        const skip =
            (
                safePage -
                1
            ) *
            safeLimit;


        const filter = {
            user:
                userId,
        };


        const [
            transactions,
            total,
        ] =
            await Promise.all([

                LoyaltyTransaction
                    .find(filter)
                    .sort({
                        createdAt:
                            -1,
                    })
                    .skip(
                        skip
                    )
                    .limit(
                        safeLimit
                    ),

                LoyaltyTransaction
                    .countDocuments(
                        filter
                    ),

            ]);


        return {

            transactions,

            pagination: {

                page:
                    safePage,

                limit:
                    safeLimit,

                total,

                pages:
                    Math.max(
                        Math.ceil(
                            total /
                            safeLimit
                        ),
                        1
                    ),

            },

        };

    };


module.exports =
    getMyTransactions;
