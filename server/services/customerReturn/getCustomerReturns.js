const CustomerReturn =
    require(
        "../../models/CustomerReturn"
    );


const getCustomerReturns =
    async (queryParams) => {

        const page =
            Math.max(
                Number(
                    queryParams.page
                ) || 1,
                1
            );


        const limit =
            Math.min(
                Math.max(
                    Number(
                        queryParams.limit
                    ) || 20,
                    1
                ),
                100
            );


        const filter = {};


        if (queryParams.status) {

            filter.status =
                queryParams.status
                    .toLowerCase();

        }


        if (queryParams.orderNumber) {

            filter.orderNumber =
                queryParams.orderNumber;

        }


        const skip =
            (page - 1) *
            limit;


        const total =
            await CustomerReturn
                .countDocuments(
                    filter
                );


        const returns =
            await CustomerReturn
                .find(filter)

                .populate(
                    "customer",
                    "firstName lastName email phone"
                )

                .populate(
                    "receivedBy",
                    "firstName lastName email"
                )

                .sort({
                    createdAt: -1,
                })

                .skip(skip)

                .limit(limit);


        return {

            returns,

            pagination: {

                page,

                limit,

                total,

                pages:
                    Math.ceil(
                        total /
                        limit
                    ),

            },

        };

    };


module.exports =
    getCustomerReturns;