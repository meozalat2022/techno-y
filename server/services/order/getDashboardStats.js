const Order = require("../../models/Order");

const getDashboardStats = async () => {

    const startOfToday = new Date();

    startOfToday.setHours(0, 0, 0, 0);

    const [

        totalOrders,
        pending,
        confirmed,
        packed,
        shipped,
        delivered,
        cancelled,

        todayOrders,

        totalRevenue,

        todayRevenue,

    ] = await Promise.all([

        Order.countDocuments(),

        Order.countDocuments({ status: "pending" }),

        Order.countDocuments({ status: "confirmed" }),

        Order.countDocuments({ status: "packed" }),

        Order.countDocuments({ status: "shipped" }),

        Order.countDocuments({ status: "delivered" }),

        Order.countDocuments({ status: "cancelled" }),

        Order.countDocuments({
            createdAt: {
                $gte: startOfToday,
            },
        }),

        Order.aggregate([
            {
                $match: {
                    status: {
                        $ne: "cancelled",
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totals.total",
                    },
                },
            },
        ]),

        Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfToday,
                    },
                    status: {
                        $ne: "cancelled",
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totals.total",
                    },
                },
            },
        ]),

    ]);
    return {

        totalOrders,

        pending,

        confirmed,

        packed,

        shipped,

        delivered,

        cancelled,

        todayOrders,

        totalRevenue:
            totalRevenue[0]?.total || 0,

        todayRevenue:
            todayRevenue[0]?.total || 0,

    };

};

module.exports = getDashboardStats;