const Purchase =
    require("../../models/Purchase");


const getPurchases = async (queryParams) => {

    const page =
        Math.max(
            Number(queryParams.page) || 1,
            1
        );

    const limit =
        Math.min(
            Math.max(
                Number(queryParams.limit) || 20,
                1
            ),
            100
        );

    const skip =
        (page - 1) * limit;


    const filter = {};


    if (queryParams.status) {

        filter.status =
            queryParams.status.toLowerCase();

    }


    if (queryParams.search) {

        const keyword =
            queryParams.search.trim();

        if (keyword) {

            filter.purchaseNumber = {
                $regex: keyword,
                $options: "i",
            };

        }

    }


    if (queryParams.supplier) {

        filter.supplier =
            queryParams.supplier;

    }


    const totalPurchases =
        await Purchase.countDocuments(
            filter
        );


    const purchases =
        await Purchase.find(filter)

            .populate(
                "supplier",
                "name"
            )

            .sort({
                createdAt: -1,
            })

            .skip(skip)

            .limit(limit);


    return {

        purchases,

        pagination: {

            page,

            limit,

            total:
                totalPurchases,

            pages:
                Math.ceil(
                    totalPurchases / limit
                ),

        },

    };

};


module.exports = getPurchases;