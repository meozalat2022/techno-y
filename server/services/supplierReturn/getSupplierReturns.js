const SupplierReturn =
    require(
        "../../models/SupplierReturn"
    );


const getSupplierReturns =
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


        if (queryParams.purchaseNumber) {

            filter.purchaseNumber =
                queryParams
                    .purchaseNumber;

        }


        if (queryParams.supplier) {

            filter.supplier =
                queryParams.supplier;

        }


        const skip =
            (page - 1) *
            limit;


        const total =
            await SupplierReturn
                .countDocuments(
                    filter
                );


        const returns =
            await SupplierReturn
                .find(filter)

                .populate(
                    "supplier",
                    "name phone email"
                )

                .populate(
                    "createdBy",
                    "firstName lastName email"
                )

                .populate(
                    "sentBy",
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
    getSupplierReturns;