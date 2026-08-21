const Order =
    require("../../models/Order");

const ORDER_STATUS =
    require(
        "../../constants/orderStatus"
    );


const getDashboardStats =
    async () => {

        const startOfToday =
            new Date();


        startOfToday.setHours(
            0,
            0,
            0,
            0
        );


        const [

            totalOrders,

            pending,

            confirmed,

            processing,

            packed,

            shipped,

            delivered,

            cancelled,

            todayOrders,

            totalRevenue,

            todayRevenue,

        ] =
            await Promise.all([

                Order.countDocuments(),

                Order.countDocuments({
                    status:
                        ORDER_STATUS.PENDING,
                }),

                Order.countDocuments({
                    status:
                        ORDER_STATUS.CONFIRMED,
                }),

                Order.countDocuments({
                    status:
                        ORDER_STATUS.PROCESSING,
                }),

                Order.countDocuments({
                    status:
                        ORDER_STATUS.PACKED,
                }),

                Order.countDocuments({
                    status:
                        ORDER_STATUS.SHIPPED,
                }),

                Order.countDocuments({
                    status:
                        ORDER_STATUS.DELIVERED,
                }),

                Order.countDocuments({
                    status:
                        ORDER_STATUS.CANCELLED,
                }),

                Order.countDocuments({

                    createdAt: {
                        $gte:
                            startOfToday,
                    },

                }),

                Order.aggregate([

                    {
                        $match: {

                            status: {
                                $ne:
                                    ORDER_STATUS
                                        .CANCELLED,
                            },

                        },
                    },

                    {
                        $group: {

                            _id:
                                null,

                            total: {
                                $sum:
                                    "$totals.total",
                            },

                        },
                    },

                ]),

                Order.aggregate([

                    {
                        $match: {

                            createdAt: {
                                $gte:
                                    startOfToday,
                            },

                            status: {
                                $ne:
                                    ORDER_STATUS
                                        .CANCELLED,
                            },

                        },
                    },

                    {
                        $group: {

                            _id:
                                null,

                            total: {
                                $sum:
                                    "$totals.total",
                            },

                        },
                    },

                ]),

            ]);


        return {

            totalOrders,

            pending,

            confirmed,

            processing,

            packed,

            shipped,

            delivered,

            cancelled,

            todayOrders,

            totalRevenue:
                totalRevenue[0]
                    ?.total || 0,

            todayRevenue:
                todayRevenue[0]
                    ?.total || 0,

        };

    };


module.exports =
    getDashboardStats;