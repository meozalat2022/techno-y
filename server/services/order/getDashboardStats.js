const Order =
    require("../../models/Order");


const BundleRecommendationEvent =
    require(
        "../../models/BundleRecommendationEvent"
    );


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

            recommendationEvents,

            topBundleSales,

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


                /*
                 * Recommendation funnel analytics.
                 */

                BundleRecommendationEvent.aggregate([

                    {

                        $group: {

                            _id:
                                null,


                            shown: {

                                $sum: {

                                    $cond: [

                                        {

                                            $eq: [

                                                "$eventType",

                                                "shown",

                                            ],

                                        },

                                        1,

                                        0,

                                    ],

                                },

                            },


                            accepted: {

                                $sum: {

                                    $cond: [

                                        {

                                            $eq: [

                                                "$eventType",

                                                "accepted",

                                            ],

                                        },

                                        1,

                                        0,

                                    ],

                                },

                            },


                            exactShown: {

                                $sum: {

                                    $cond: [

                                        {

                                            $and: [

                                                {

                                                    $eq: [

                                                        "$eventType",

                                                        "shown",

                                                    ],

                                                },

                                                {

                                                    $eq: [

                                                        "$recommendationType",

                                                        "exact",

                                                    ],

                                                },

                                            ],

                                        },

                                        1,

                                        0,

                                    ],

                                },

                            },


                            partialShown: {

                                $sum: {

                                    $cond: [

                                        {

                                            $and: [

                                                {

                                                    $eq: [

                                                        "$eventType",

                                                        "shown",

                                                    ],

                                                },

                                                {

                                                    $eq: [

                                                        "$recommendationType",

                                                        "partial",

                                                    ],

                                                },

                                            ],

                                        },

                                        1,

                                        0,

                                    ],

                                },

                            },

                        },

                    },

                ]),


                /*
                 * Bundle sales analytics.
                 *
                 * Cancelled orders are excluded.
                 *
                 * returnedQuantity is deducted so revenue
                 * represents net retained bundle sales.
                 */

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

                        $unwind:
                            "$items",

                    },


                    {

                        $match: {

                            "items.isBundle":
                                true,

                        },

                    },


                    {

                        $project: {

                            bundleId:
                                "$items.product",


                            title:
                                "$items.title",


                            quantity: {

                                $max: [

                                    {

                                        $subtract: [

                                            "$items.quantity",

                                            {

                                                $ifNull: [

                                                    "$items.returnedQuantity",

                                                    0,

                                                ],

                                            },

                                        ],

                                    },

                                    0,

                                ],

                            },


                            revenue: {

                                $multiply: [

                                    "$items.pricing.finalPrice",

                                    {

                                        $max: [

                                            {

                                                $subtract: [

                                                    "$items.quantity",

                                                    {

                                                        $ifNull: [

                                                            "$items.returnedQuantity",

                                                            0,

                                                        ],

                                                    },

                                                ],

                                            },

                                            0,

                                        ],

                                    },

                                ],

                            },

                        },

                    },


                    {

                        $group: {

                            _id:
                                "$bundleId",

                            title: {

                                $first:
                                    "$title",

                            },

                            unitsSold: {

                                $sum:
                                    "$quantity",

                            },

                            revenue: {

                                $sum:
                                    "$revenue",

                            },

                        },

                    },


                    {

                        $sort: {

                            revenue:
                                -1,

                        },

                    },

                ]),

            ]);


        const recommendationSummary =
            recommendationEvents[0] || {

                shown:
                    0,

                accepted:
                    0,

                exactShown:
                    0,

                partialShown:
                    0,

            };


        const shown =
            Number(
                recommendationSummary.shown
            ) || 0;


        const accepted =
            Number(
                recommendationSummary.accepted
            ) || 0;


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
                    ?.total ||
                0,


            todayRevenue:

                todayRevenue[0]
                    ?.total ||
                0,


            bundleRecommendationAnalytics: {

                shown,


                accepted,


                acceptanceRate:

                    shown > 0

                        ? Number(

                            (

                                (
                                    accepted /
                                    shown
                                ) *
                                100

                            ).toFixed(2)

                        )

                        : 0,


                exactShown:

                    Number(
                        recommendationSummary
                            .exactShown
                    ) || 0,


                partialShown:

                    Number(
                        recommendationSummary
                            .partialShown
                    ) || 0,


                bundleUnitsSold:

                    topBundleSales.reduce(

                        (
                            total,
                            bundle
                        ) =>

                            total +
                            Number(
                                bundle.unitsSold ||
                                0
                            ),

                        0

                    ),


                bundleRevenue:

                    topBundleSales.reduce(

                        (
                            total,
                            bundle
                        ) =>

                            total +
                            Number(
                                bundle.revenue ||
                                0
                            ),

                        0

                    ),


                topBundles:

                    topBundleSales
                        .slice(
                            0,
                            5
                        )
                        .map(
                            bundle => ({

                                bundleId:
                                    bundle._id,

                                title:
                                    bundle.title,

                                unitsSold:

                                    Number(
                                        bundle.unitsSold ||
                                        0
                                    ),

                                revenue:

                                    Number(
                                        bundle.revenue ||
                                        0
                                    ),

                            })
                        ),

            },

        };

    };


module.exports =
    getDashboardStats;