const StoreSale =
    require("../../models/StoreSale");


const getStoreSales =
    async ({
        page = 1,
        limit = 20,
    } = {}) => {

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


        const [
            sales,
            total,
        ] =
            await Promise.all([

                StoreSale.find({})
                    .populate(
                        "performedBy",
                        "firstName lastName email"
                    )
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

                StoreSale
                    .countDocuments({}),

            ]);


        return {

            sales,

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
    getStoreSales;
