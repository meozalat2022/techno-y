const express =
    require("express");

const router =
    express.Router();

const {
    createOrder,
    getOrderByNumber,
    getOrders,
    updateOrderStatus,
    getDashboardStats,
    getMyOrders,
    getMyOrderByNumber,
} =
    require(
        "../controllers/orderController"
    );

const {
    protect,
} =
    require(
        "../middleware/authMiddleware"
    );

const admin =
    require(
        "../middleware/adminMiddleware"
    );


router.get(
    "/",
    protect,
    admin,
    getOrders
);


router.get(
    "/dashboard",
    protect,
    admin,
    getDashboardStats
);


router.get(
    "/my-orders",
    protect,
    getMyOrders
);


router.get(
    "/my-orders/:orderNumber",
    protect,
    getMyOrderByNumber
);


router.post(
    "/",
    protect,
    createOrder
);


router.patch(
    "/:orderNumber/status",
    protect,
    admin,
    updateOrderStatus
);


router.get(
    "/:orderNumber",
    protect,
    admin,
    getOrderByNumber
);


module.exports = router;