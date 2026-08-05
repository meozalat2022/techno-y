const Order = require("../../models/Order");

const getOrders = async (queryParams) => {

    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 20;

    const skip = (page - 1) * limit;

    const filter  = {};

    if (queryParams.status) {
        filter.status = queryParams.status.toLowerCase();
    }

    if (queryParams.search) {

    const keyword = queryParams.search.trim();

    filter.$or = [

        {
            orderNumber: {
                $regex: keyword,
                $options: "i",
            },
        },

        {
            "customer.firstName": {
                $regex: keyword,
                $options: "i",
            },
        },

        {
            "customer.lastName": {
                $regex: keyword,
                $options: "i",
            },
        },

        {
            "customer.email": {
                $regex: keyword,
                $options: "i",
            },
        },

        {
            "customer.phone": {
                $regex: keyword,
                $options: "i",
            },
        },

    ];

}

    const totalOrders =
        await Order.countDocuments(filter);

    const orders =
        await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

    return {

        orders,

        pagination: {

            page,

            limit,

            total: totalOrders,

            pages: Math.ceil(
                totalOrders / limit
            ),

        },

    };

};

module.exports = getOrders;