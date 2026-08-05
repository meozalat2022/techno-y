const Order = require("../../models/Order");

const getMyOrders = async (
    userId,
    queryParams
) => {

    const page =
        Number(queryParams.page) || 1;

    const limit =
        Number(queryParams.limit) || 10;

    const skip =
        (page - 1) * limit;

    const query = {

        "customer.user": userId,

    };

    const total =
        await Order.countDocuments(query);

    const orders =
        await Order.find(query)

            .sort({
                createdAt: -1,
            })

            .skip(skip)

            .limit(limit)

            .select(
                "orderNumber status totals.total createdAt"
            );

    return {

        orders,

        meta: {

            page,

            limit,

            total,

            pages:
                Math.ceil(total / limit),

        },

    };

};

module.exports = getMyOrders;